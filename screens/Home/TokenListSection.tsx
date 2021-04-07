/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ThemeContext} from '../../ThemeContext';
import List from '../../components/List';
import {styles} from './style';
import {parseDecimals} from '../../utils/number';
import Button from '../../components/Button';
import {useRecoilValue} from 'recoil';
import numeral from 'numeral';
import {getLanguageString} from '../../utils/lang';
import {languageAtom} from '../../atoms/language';
// import {getTokenList} from '../../utils/local';
import NewTokenModal from '../common/NewTokenModal';
import {krc20ListAtom} from '../../atoms/krc20';
import {getBalance} from '../../services/krc20';
import {getSelectedWallet, getWallets} from '../../utils/local';
import {selectedWalletAtom} from '../../atoms/wallets';

const TokenListSection = () => {
  const navigation = useNavigation();
  const {theme} = useContext(ThemeContext);
  const selectedWallet = useRecoilValue(selectedWalletAtom);

  const language = useRecoilValue(languageAtom);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [balance, setBalance] = useState<number[]>([]);
  const tokenList = useRecoilValue(krc20ListAtom);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const _wallets = await getWallets();
      const _selectedWallet = await getSelectedWallet();
      const promiseArr = tokenList.map((i) => {
        return getBalance(i.address, _wallets[_selectedWallet].address);
      });
      const balanceArr = await Promise.all(promiseArr);
      setBalance(balanceArr);
      setLoading(false);
    })();
  }, [tokenList, selectedWallet]);

  const renderIcon = (avatar: string) => {
    return (
      <View style={{flex: 0.3, marginRight: 12}}>
        <View
          style={{
            width: 30,
            height: 30,

            borderRadius: 15,
            backgroundColor: 'white',

            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',

            borderWidth: 1,
            borderColor: 'gray',
          }}>
          {avatar ? (
            <Image source={{uri: avatar}} style={styles.tokenLogo} />
          ) : (
            <Image
              source={require('../../assets/logo.png')}
              style={styles.kaiLogo}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.tokenListContainer}>
      <NewTokenModal visible={showModal} onClose={() => setShowModal(false)} />
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 20,
        }}>
        <Text allowFontScaling={false} style={{fontSize: 18, fontWeight: 'bold', color: theme.textColor}}>
          {getLanguageString(language, 'KRC20_TOKENS_SECTION_TITLE')}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('KRC20Tokens')}>
          <Text allowFontScaling={false} style={{fontSize: theme.defaultFontSize, color: theme.textColor}}>
            {getLanguageString(language, 'VIEW_ALL')} ({tokenList.length})
          </Text>
        </TouchableOpacity>
      </View>
      {tokenList.length === 0 && !loading && (
        <View style={{alignItems: 'center', marginTop: 45}}>
          <Image
            style={{width: 111, height: 52}}
            source={require('../../assets/no_tokens_dark.png')}
          />
          <Text allowFontScaling={false} style={[styles.noTXText, {color: theme.textColor}]}>
            {getLanguageString(language, 'NO_TOKENS')}
          </Text>
          <Button
            type="outline"
            textStyle={{fontWeight: 'bold', fontSize: 12}}
            style={{paddingVertical: 8, paddingHorizontal: 16}}
            onPress={() => setShowModal(true)}
            title={`+ ${getLanguageString(language, 'ADD_TOKEN')}`}
          />
        </View>
      )}
      <List
        items={tokenList}
        loading={loading}
        loadingColor={theme.textColor}
        keyExtractor={(item) => item.id}
        render={(item, index) => {
          return (
            <View
              key={item.name}
              style={{
                padding: 15,
                marginHorizontal: 20,
                borderRadius: 8,
                marginVertical: 6,
                backgroundColor: theme.backgroundFocusColor,
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                }}
                onPress={() => {
                  navigation.navigate('Home', {
                    screen: 'TokenDetail',
                    initial: false,
                    params: {
                      tokenAddress: item.address,
                      name: item.name,
                      symbol: item.symbol,
                      avatar: item.avatar,
                      decimals: item.decimals,
                      // balance: balance[index],
                    },
                  });
                }}>
                {renderIcon(item.avatar)}
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    height: '100%',
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: theme.textColor,
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>
                    {item.name}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    // flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}>
                  <Text allowFontScaling={false} style={[styles.kaiAmount, {color: theme.textColor}]}>
                    {numeral(
                      parseDecimals(balance[index], item.decimals),
                    ).format('0,0.00')}
                  </Text>
                  <Text allowFontScaling={false} style={{color: theme.ghostTextColor}}>
                    {item.symbol}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={null}
      />
    </View>
  );
};

export default TokenListSection;
