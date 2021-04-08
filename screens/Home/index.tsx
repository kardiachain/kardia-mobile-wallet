/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Image, Linking, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './style';
import HomeHeader from './Header';
import QRModal from '../common/AddressQRCode';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {selectedWalletAtom, walletsAtom} from '../../atoms/wallets';
import {
  getAppPasscodeSetting,
  getSelectedWallet,
  getWalkThroughView,
  getWallets,
} from '../../utils/local';
import {ThemeContext} from '../../ThemeContext';
import {getBalance} from '../../services/account';
import CardSliderSection from './CardSliderSection';
import {languageAtom} from '../../atoms/language';
import numeral from 'numeral';
import {getLanguageString} from '../../utils/lang';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import RemindPasscodeModal from '../common/RemindPasscodeModal';
import {getStakingAmount} from '../../services/staking';
import TokenListSection from './TokenListSection';
import {showTabBarAtom} from '../../atoms/showTabBar';
import {parseKaiBalance} from '../../utils/number';
import {tokenInfoAtom} from '../../atoms/token';
import {weiToKAI} from '../../services/transaction/amount';
import Button from '../../components/Button';
import { SIMPLEX_URL } from '../../config';

const HomeScreen = () => {
  const [showQRModal, setShowQRModal] = useState(false);
  const tokenInfo = useRecoilValue(tokenInfoAtom);
  const [showPasscodeRemindModal, setShowPasscodeRemindModal] = useState(false);
  const [inited, setInited] = useState(false);

  const [wallets, setWallets] = useRecoilState(walletsAtom);
  const [selectedWallet, setSelectedWallet] = useRecoilState(
    selectedWalletAtom,
  );

  const setTabBarVisible = useSetRecoilState(showTabBarAtom);

  const {theme} = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {

      // Get local auth setting
      const enabled = await getAppPasscodeSetting();
      if (!enabled) {
        setShowPasscodeRemindModal(true);
      } else {
        setShowPasscodeRemindModal(false);
      }
      setInited(true);
    })();
  }, []);

  const updateWalletBalance = async (newSelectedWallet?: number) => {
    const _wallets = await getWallets();
    const _selectedWallet =
      newSelectedWallet !== undefined
        ? newSelectedWallet
        : await getSelectedWallet();
    if (!_wallets[_selectedWallet]) {
      return;
    }
    try {
      const balance = await getBalance(_wallets[_selectedWallet].address);
      const staked = await getStakingAmount(_wallets[_selectedWallet].address);
      const newWallets: Wallet[] = JSON.parse(JSON.stringify(_wallets));
      newWallets.forEach((walletItem, index) => {
        if (walletItem.address === _wallets[_selectedWallet].address) {
          newWallets[index].balance = balance;
          newWallets[index].staked = staked;
        }
      });
      setWallets(newWallets);
      _selectedWallet !== selectedWallet && setSelectedWallet(_selectedWallet);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      updateWalletBalance();
      setTabBarVisible(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    if (!inited) {
      return;
    }
    updateWalletBalance(selectedWallet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWallet]);

  if (!inited) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: theme.backgroundColor}}>
        <ActivityIndicator color={theme.textColor} size="large" />
      </SafeAreaView>
    );
  }

  if (showPasscodeRemindModal) {
    setShowPasscodeRemindModal(false);
    // navigation.navigate('NewPasscode');
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Setting',
          state: {
            routes: [{name: 'NewPasscode', params: {fromHome: true}}],
          },
        },
      ],
    });
  }

  const _getBalance = () => {
    if (!wallets[selectedWallet]) return 0;
    return wallets[selectedWallet].balance;
  }

  const _getStaked = () => {
    if (!wallets[selectedWallet]) return 0;
    return wallets[selectedWallet].staked;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.backgroundColor}}>
      <HomeHeader />
      <QRModal visible={showQRModal} onClose={() => setShowQRModal(false)} />
      <View style={[styles.bodyContainer]}>
        <CardSliderSection showQRModal={() => setShowQRModal(true)} />
        <View
          style={{
            paddingVertical: 24,
            paddingHorizontal: 16,
            backgroundColor: 'rgba(58, 59, 60, 0.42)',
            borderRadius: 12,
            marginHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Image
              style={{width: 32, height: 32, marginRight: 12}}
              source={require('../../assets/logo_dark.png')}
            />
            <View>
              <Text allowFontScaling={false} style={{color: 'rgba(252, 252, 252, 0.54)', fontSize: 10}}>
                {getLanguageString(language, 'BALANCE')}
              </Text>
              <Text allowFontScaling={false} style={{color: theme.textColor, fontSize: 18}}>
                {parseKaiBalance(_getBalance(), true)}{' '}
                <Text allowFontScaling={false} style={{color: 'rgba(252, 252, 252, 0.54)'}}>KAI</Text>
              </Text>
              <Text allowFontScaling={false} style={{color: 'rgba(252, 252, 252, 0.54)', fontSize: 10}}>
                ~${' '}
                {numeral(
                  tokenInfo.price *
                    (Number(weiToKAI(_getBalance())) +
                    _getStaked()),
                ).format('0,0.00a')}
              </Text>
            </View>
          </View>
          <Button
            title={getLanguageString(language, 'BUY_KAI')}
            // onPress={() => Alert.alert('Coming soon')}
            onPress={() => Linking.openURL(SIMPLEX_URL)}
            type="ghost"
            size="small"
            textStyle={{color: '#000000', fontWeight: 'bold'}}
            style={{paddingHorizontal: 16, paddingVertical: 8}}
          />
        </View>
        <TokenListSection />
        {/* <RemindPasscodeModal
          visible={showPasscodeRemindModal}
          onClose={() => setShowPasscodeRemindModal(false)}
          enablePasscode={() => {
            setShowPasscodeRemindModal(false);
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Setting',
                  state: {
                    routes: [{name: 'Setting'}, {name: 'SettingPasscode'}],
                  },
                },
              ],
            });
          }}
        /> */}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
