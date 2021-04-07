/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {formatDistanceToNowStrict, isSameDay, format} from 'date-fns';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {ThemeContext} from '../../ThemeContext';
import List from '../../components/List';
import {truncate} from '../../utils/string';
import {styles} from './style';
import {parseKaiBalance} from '../../utils/number';
import Button from '../../components/Button';
import {useRecoilValue} from 'recoil';
import {selectedWalletAtom, walletsAtom} from '../../atoms/wallets';
import {getTxByAddress} from '../../services/transaction';
import {
  getDateFNSLocale,
  getDateTimeFormat,
  getLanguageString,
} from '../../utils/lang';
import {languageAtom} from '../../atoms/language';
import {getSelectedWallet, getWallets} from '../../utils/local';

const TxListSection = () => {
  const navigation = useNavigation();
  const {theme} = useContext(ThemeContext);
  const [txList, setTxList] = useState([] as any[]);

  const wallets = useRecoilValue(walletsAtom);
  const selectedWallet = useRecoilValue(selectedWalletAtom);
  const language = useRecoilValue(languageAtom);
  const [loading, setLoading] = useState(true);
  const [cachedAddress, setCachedAddress] = useState('');

  const parseTXForList = (tx: Transaction, currentWalletAddress: string) => {
    return {
      label: tx.hash,
      value: tx.hash,
      amount: tx.amount,
      date: tx.date,
      status: tx.status,
      type: tx.from === currentWalletAddress ? 'OUT' : 'IN',
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
    setCachedAddress(localWallets[localSelectedWallet].address);
    try {
      const newTxList = await getTxByAddress(
        localWallets[localSelectedWallet].address,
        1,
        7,
      );
      const parsedTxList = newTxList.map((tx: any) => {
        return parseTXForList(tx, localWallets[localSelectedWallet].address);
      });
      setTxList(parsedTxList);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      wallets[selectedWallet] &&
      cachedAddress !== wallets[selectedWallet].address
    ) {
      setLoading(true);
      getTX();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWallet, wallets]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getTX();
    }, 2000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderIcon = (status: number) => {
    return (
      <View style={{flex: 1, marginRight: 18}}>
        <View
          style={{
            width: 50,
            height: 50,

            borderRadius: 25,
            backgroundColor: 'white',

            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',

            borderWidth: 1,
            borderColor: 'gray',
          }}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.kaiLogo}
          />
          {status ? (
            <AntIcon
              name="checkcircle"
              size={20}
              color={'green'}
              style={{position: 'absolute', right: 0, bottom: 0}}
            />
          ) : (
            <AntIcon
              name="closecircle"
              size={20}
              color={'red'}
              style={{position: 'absolute', right: 0, bottom: 0}}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.transactionContainer}>
      <List
        items={txList}
        loading={loading}
        loadingColor={theme.textColor}
        render={(item, index) => {
          return (
            <View
              style={{
                padding: 15,
                backgroundColor:
                  index % 2 === 0
                    ? theme.backgroundFocusColor
                    : theme.backgroundColor,
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                }}
                onPress={() =>
                  navigation.navigate('Transaction', {
                    screen: 'TransactionDetail',
                    initial: false,
                    params: {txHash: item.label},
                  })
                }>
                {renderIcon(item.status)}
                <View
                  style={{
                    flex: 2.5,
                    flexDirection: 'column',
                  }}>
                  <Text allowFontScaling={false} style={{color: '#FFFFFF'}}>
                    {truncate(item.label, 6, 8)}
                  </Text>
                  <Text allowFontScaling={false} style={{color: 'gray'}}>
                    {isSameDay(item.date, new Date())
                      ? `${formatDistanceToNowStrict(item.date, {
                          locale: getDateFNSLocale(language),
                        })} ${getLanguageString(language, 'AGO')}`
                      : format(item.date, getDateTimeFormat(language), {
                          locale: getDateFNSLocale(language),
                        })}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 2.5,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.kaiAmount,
                      item.type === 'IN' ? {color: '#61b15a'} : {color: 'red'},
                    ]}>
                    {item.type === 'IN' ? '+' : '-'}
                    {parseKaiBalance(item.amount)} KAI
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text allowFontScaling={false} style={[styles.noTXText, {color: theme.textColor}]}>
            {getLanguageString(language, 'NO_TRANSACTION')}
          </Text>
        }
        header={
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 15,
            }}>
            <Text allowFontScaling={false} style={{fontSize: 18, fontWeight: 'bold', color: '#FFFFFF'}}>
              {getLanguageString(language, 'RECENT_TRANSACTION')}
            </Text>
            <Button
              type="link"
              onPress={() =>
                navigation.navigate('Transaction', {
                  screen: 'TransactionList',
                })
              }
              title={`${getLanguageString(language, 'VIEW_ALL')} >`}
            />
          </View>
        }
      />
    </View>
  );
};

export default TxListSection;
