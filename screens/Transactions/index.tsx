/* eslint-disable react-native/no-inline-styles */
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {SafeAreaView} from 'react-native-safe-area-context';
import {selectedWalletAtom, walletsAtom} from '../../atoms/wallets';
import {truncate} from '../../utils/string';
import {styles} from './style';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {getTxByAddress} from '../../services/transaction';
import {parseKaiBalance} from '../../utils/number';
import {format} from 'date-fns';
import IconButton from '../../components/IconButton';
import {getDateFNSLocale, getLanguageString} from '../../utils/lang';
import {languageAtom} from '../../atoms/language';
import NewTxModal from '../common/NewTxModal';
import {ThemeContext} from '../../ThemeContext';
import {getSelectedWallet, getWallets} from '../../utils/local';
import Button from '../../components/Button';
import {groupByDate} from '../../utils/date';
import TxDetailModal from '../common/TxDetailModal';
import {ScrollView} from 'react-native-gesture-handler';
import {showTabBarAtom} from '../../atoms/showTabBar';
import { HEADER_HEIGHT } from '../../theme';

const TransactionScreen = () => {
  const {theme} = useContext(ThemeContext);
  const navigation = useNavigation();

  const [wallets] = useRecoilState(walletsAtom);
  const [selectedWallet] = useRecoilState(selectedWalletAtom);
  const [txList, setTxList] = useState([] as any[]);
  const [showNewTxModal, setShowNewTxModal] = useState(false);
  const language = useRecoilValue(languageAtom);

  const [showTxDetail, setShowTxDetail] = useState(false);
  const [txObjForDetail, setTxObjForDetail] = useState();

  const setTabBarVisible = useSetRecoilState(showTabBarAtom);

  useFocusEffect(
    useCallback(() => {
      setTabBarVisible(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const parseTXForList = (tx: Transaction) => {
    return {
      label: tx.hash,
      value: tx.hash,
      amount: tx.amount,
      date: tx.date,
      from: tx.from,
      to: tx.to,
      hash: tx.hash,
      txFee: tx.fee,
      blockHash: tx.blockHash || '',
      blockNumber: tx.blockNumber || '',
      status: tx.status,
      type:
        wallets[selectedWallet] && tx.from === wallets[selectedWallet].address
          ? 'OUT'
          : 'IN',
    };
  };

  const getTX = async () => {
    const localWallets = await getWallets();
    const localSelectedWallet = await getSelectedWallet();
    if (
      !localWallets[localSelectedWallet] ||
      !localWallets[localSelectedWallet].address
    ) {
      return;
    }
    try {
      const newTxList = await getTxByAddress(
        localWallets[localSelectedWallet].address,
        1,
        1000,
      );
      setTxList(newTxList.map(parseTXForList));
    } catch (error) {
      console.error(error);
    }
  };

  const renderIcon = (status: number, type: 'IN' | 'OUT') => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            width: 32,
            height: 32,

            borderRadius: 12,
            backgroundColor: theme.backgroundColor,

            // flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',

            // borderWidth: 1,
            // borderColor: 'gray',
          }}>
          {type === 'IN' ? (
            <Image
              source={require('../../assets/icon/receive.png')}
              style={styles.kaiLogo}
            />
          ) : (
            <Image
              source={require('../../assets/icon/send.png')}
              style={styles.kaiLogo}
            />
          )}
        </View>
        {status ? (
          <AntIcon
            name="checkcircle"
            size={14}
            color={'green'}
            style={{position: 'absolute', right: 0, bottom: 0}}
          />
        ) : (
          <AntIcon
            name="closecircle"
            size={14}
            color={'red'}
            style={{position: 'absolute', right: 0, bottom: 0}}
          />
        )}
      </View>
    );
  };

  useEffect(() => {
    getTX();
    const getTxInterval = setInterval(() => {
      getTX();
    }, 3000);
    return () => clearInterval(getTxInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <NewTxModal
        visible={showNewTxModal}
        onClose={() => setShowNewTxModal(false)}
      />
      <TxDetailModal
        visible={showTxDetail}
        onClose={() => setShowTxDetail(false)}
        txObj={txObjForDetail}
      />
      <View style={styles.header}>
        <Text allowFontScaling={false} style={[styles.headline, {color: theme.textColor}]}>
          {getLanguageString(language, 'RECENT_TRANSACTION')}
        </Text>
        <IconButton
          name="bell-o"
          color={theme.textColor}
          size={18}
          onPress={() => navigation.navigate('Notification')}
        />
      </View>
      {groupByDate(txList, 'date').length === 0 && (
        <View style={styles.noTXContainer}>
          <Image
            style={{width: 87, height: 66, marginBottom: 23}}
            source={require('../../assets/no_tx_butterfly.png')}
          />
          <Image
            style={{width: 170, height: 140}}
            source={require('../../assets/no_tx_box.png')}
          />
          <Text allowFontScaling={false} style={[styles.noTXText, {color: theme.textColor}]}>
            {getLanguageString(language, 'NO_TRANSACTION')}
          </Text>
          <Button
            type="primary"
            onPress={() => setShowNewTxModal(true)}
            title={getLanguageString(language, 'SEND_NOW')}
            block={true}
            icon={
              <AntIcon
                name="plus"
                size={20}
                color={'#000000'}
                style={{marginRight: 8}}
              />
            }
          />
        </View>
      )}
      <ScrollView>
        {groupByDate(txList, 'date').map((txsByDate) => {
          const dateLocale = getDateFNSLocale(language);
          return (
            <React.Fragment key={`transaction-by-${txsByDate.date.getTime()}`}>
              <Text
                allowFontScaling={false}
                style={{
                  marginHorizontal: 20,
                  color: theme.textColor,
                }}>
                {format(txsByDate.date, 'E, dd/MM/yyyy', {locale: dateLocale})}
              </Text>
              {txsByDate.items.map((item: any, index: number) => {
                return (
                  <View
                    key={`tx-item-${index}`}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      marginHorizontal: 20,
                      marginVertical: 8,
                      borderRadius: 8,
                      backgroundColor: theme.backgroundFocusColor,
                    }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        setTxObjForDetail(item);
                        setShowTxDetail(true);
                      }}>
                      {renderIcon(item.status, item.type)}
                      <View
                        style={{
                          flexDirection: 'column',
                          flex: 4,
                          paddingHorizontal: 14,
                        }}>
                        <Text allowFontScaling={false} style={{color: '#FFFFFF'}}>
                          {item.type === 'IN'
                            ? getLanguageString(language, 'TX_TYPE_RECEIVED')
                            : getLanguageString(language, 'TX_TYPE_SEND')}
                        </Text>
                        <Text allowFontScaling={false} style={{color: '#DBDBDB', fontSize: 12}}>
                          {truncate(item.label, 8, 10)}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 3,
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.kaiAmount,
                            item.type === 'IN'
                              ? {color: '#53B680'}
                              : {color: 'red'},
                          ]}>
                          {item.type === 'IN' ? '+' : '-'}
                          {parseKaiBalance(item.amount, true)} KAI
                        </Text>
                        <Text allowFontScaling={false} style={{color: '#DBDBDB', fontSize: 12}}>
                          {format(item.date, 'hh:mm aa')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </React.Fragment>
          );
        })}
      </ScrollView>
      {txList.length > 0 && (
        <Button
          type="primary"
          icon={<AntIcon name="plus" size={24} color={theme.name === 'dark' ? '#000000': '#FFFFFF'} />}
          size="small"
          onPress={() => setShowNewTxModal(true)}
          style={styles.floatingButton}
        />
      )}
    </SafeAreaView>
  );
};

export default TransactionScreen;
