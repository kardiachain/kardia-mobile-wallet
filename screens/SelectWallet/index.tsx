/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ethers} from 'ethers';
import {getBalance} from '../../services/account';
import {getStakingAmount} from '../../services/staking';
import {ThemeContext} from '../../ThemeContext';
import {styles} from './style';
import List from '../../components/List';
import Button from '../../components/Button';
import {truncate} from '../../utils/string';
import {parseKaiBalance} from '../../utils/number';
import Icon from 'react-native-vector-icons/Entypo';
import {getLanguageString} from '../../utils/lang';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {languageAtom} from '../../atoms/language';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  getWallets,
  saveMnemonic,
  saveSelectedWallet,
  saveWallets,
} from '../../utils/local';
import {selectedWalletAtom, walletsAtom} from '../../atoms/wallets';
import { SafeAreaView } from 'react-native-safe-area-context';

const SelectWallet = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [walletList, setWalletList] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(false);
  const language = useRecoilValue(languageAtom);
  const {theme} = useContext(ThemeContext);

  const navigation = useNavigation();
  const {params} = useRoute();
  const mnemonic = params ? (params as any).mnemonic : '';

  const setWallets = useSetRecoilState(walletsAtom);
  const setSelectedWallet = useSetRecoilState(selectedWalletAtom);

  const onSelect = async (_wallet: Wallet) => {
    const localWallets = await getWallets();
    const _privateKey = _wallet.privateKey;
    const walletAddress = _wallet.address;
    const balance = await getBalance(walletAddress);
    const staked = await getStakingAmount(walletAddress);

    const wallet: Wallet = {
      privateKey: _privateKey,
      address: walletAddress,
      balance,
      staked,
    };

    const walletExisted = localWallets
      .map((item) => item.address)
      .includes(wallet.address);

    if (walletExisted) {
      Alert.alert(getLanguageString(language, 'WALLET_EXISTED'));
      return;
    }

    await saveMnemonic(
      walletAddress,
      mnemonic !== '' ? mnemonic.trim() : 'FROM_PK',
    );
    const _wallets = JSON.parse(JSON.stringify(localWallets));
    _wallets.push(wallet);
    await saveWallets(_wallets);
    await saveSelectedWallet(_wallets.length - 1);
    setWallets(_wallets);
    setSelectedWallet(_wallets.length - 1);
    if (params && (params as any).fromNoWallet) {
      return;
    } 
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  // const onError = (error: any) => {};

  const handler = async () => {
    try {
      let newWalletList = [];
      for (let index = startIndex; index < startIndex + 5; index++) {
        const promise = new Promise<Wallet>(async (resolve, reject) => {
          const ethWallet = ethers.Wallet.fromMnemonic(
            mnemonic.trim(),
            `m/44'/60'/0'/0/${index}`,
          );
          const walletAddress = ethWallet.address;
          const _privateKey = ethWallet.privateKey;
          try {
            const balance = await getBalance(walletAddress);
            const staked = await getStakingAmount(walletAddress);
            const wallet: Wallet = {
              privateKey: _privateKey,
              address: walletAddress,
              balance,
              staked,
            };
            resolve(wallet);
          } catch (error) {
            reject(error);
          }
        });

        newWalletList.push(promise);
      }
      newWalletList = await Promise.all(newWalletList);
      const currentWalletList: Wallet[] = JSON.parse(
        JSON.stringify(walletList),
      );
      setWalletList(currentWalletList.concat(newWalletList));
      setLoading(false);
    } catch (error) {
      console.error(error);
      // onError && onError(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      handler();
    }, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startIndex]);

  return (
    <SafeAreaView
      style={[
        styles.selectWalletContainer,
        {backgroundColor: theme.backgroundColor},
      ]}>
      <Icon.Button
        style={{paddingLeft: 0}}
        name="chevron-left"
        onPress={() => navigation.goBack()}
        backgroundColor="transparent"
      />
      <Text
        allowFontScaling={false}
        style={{
          color: theme.textColor,
          // textAlign: 'center',
          fontSize: 36,
          marginBottom: 20,
        }}>
        {getLanguageString(language, 'SELECT_YOUR_WALLET')}
      </Text>
      {/* <Text allowFontScaling={false} style={{color: 'rgba(252, 252, 252, 0.54)', fontSize: 16}}>
        {getLanguageString(language, 'SELECT_YOUR_WALLET_DESCRIPTION')}
      </Text> */}
      <View style={{flex: 0.8, justifyContent: 'center', marginTop: 36}}>
        {walletList.length > 0 && (
          <List
            // loading={loading}
            // loadingColor={theme.textColor}
            // loadingSize="large"
            items={walletList.map((item) => {
              return {
                ...item,
                ...{
                  label: item.address,
                  value: item.address,
                },
              };
            })}
            render={(item, index) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.walletItem,
                    {
                      backgroundColor: theme.backgroundFocusColor,
                    },
                  ]}
                  onPress={() => onSelect(walletList[index])}>
                  <View
                    style={{
                      backgroundColor: theme.backgroundColor,
                      width: 32,
                      height: 32,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 12,
                      marginRight: 16,
                    }}>
                    <Image
                      style={{width: 20, height: 20}}
                      source={require('../../assets/icon/home_dark.png')}
                    />
                  </View>
                  <View>
                    <Text allowFontScaling={false} style={{color: theme.textColor, fontSize: 13}}>
                      {truncate(item.address, 10, 10)}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: theme.textColor,
                        fontSize: theme.defaultFontSize,
                      }}>
                      <Text allowFontScaling={false} style={{color: theme.mutedTextColor}}>
                        Balance:
                      </Text>{' '}
                      {parseKaiBalance(item.balance)} KAI
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
        {loading && (
          <ActivityIndicator size={'large'} color={theme.textColor} />
        )}
      </View>
      {!loading && (
        <Button
          type="outline"
          onPress={() => setStartIndex(startIndex + 5)}
          size="large"
          title={getLanguageString(language, 'LOAD_MORE_WALLET')}
          style={{marginTop: 12}}
        />
      )}
    </SafeAreaView>
  );
};

export default SelectWallet;
