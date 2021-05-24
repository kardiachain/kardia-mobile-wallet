import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Keyboard, Platform, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { showTabBarAtom } from '../../atoms/showTabBar';
import CustomText from '../../components/Text';
import { ThemeContext } from '../../ThemeContext';
import ExchangeScreen from './LimitScreen';
import SelectingPair from './SelectingPair';
import MarketScreen from './MarketScreen';
import { getLanguageString } from '../../utils/lang';
import { languageAtom } from '../../atoms/language';
import { useQuery } from '@apollo/client';
import { GET_PAIRS } from '../../services/dex/queries';
import { selectedWalletAtom, walletsAtom } from '../../atoms/wallets';
import { formatDexToken } from '../../services/dex';
import UnderMaintainence from '../common/UnderMaintainence';
import { dexStatusAtom } from '../../atoms/dexStatus';
import ComingSoon from '../common/ComingSoon';

export default () => {
  const theme = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);

  const [type, setType] = useState('MARKET');
  const [selectingPair, setSelectingPair] = useState(false)

  const [tokenFrom, setTokenFrom] = useState<PairToken>()
  const [tokenFromLiquidity, setTokenFromLiquidity] = useState('');
  const [tokenTo, setTokenTo] = useState<PairToken>()
  const [tokenToLiquidity, setTokenToLiquidity] = useState('');
  const [pairAddress, setPairAddress] = useState('');
  const setTabBarVisible = useSetRecoilState(showTabBarAtom)
  const wallets = useRecoilValue(walletsAtom)
  const selectedWallet = useRecoilValue(selectedWalletAtom)
  const dexStatus = useRecoilValue(dexStatusAtom)

  const { loading, error, data: pairData } = useQuery(GET_PAIRS);

  useFocusEffect(
    useCallback(() => {
      setTabBarVisible(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    if (pairData && pairData.pairs) {
      const pair = pairData.pairs[0]
      if (!pair) return
      setTokenFrom(formatDexToken(pair.t1, wallets[selectedWallet]));
      setTokenTo(formatDexToken(pair.t2, wallets[selectedWallet]));
      setTokenFromLiquidity(pair.token1_liquidity);
      setTokenToLiquidity(pair.token2_liquidity)
      setPairAddress(pair.contract_address)
      setSelectingPair(false)
    }
  }, [pairData])

  useEffect(() => {
    if (!selectingPair) {
      setTabBarVisible(true)
    }
  }, [selectingPair])

  if (dexStatus === 'OFFLINE') {
    return <UnderMaintainence />
  }

  if (dexStatus === 'COMING_SOON') {
    return <ComingSoon />
  }

  if (selectingPair) {
    return (
      <SelectingPair
        pairData={pairData}
        loading={loading}
        goBack={() => setSelectingPair(false)}
        onSelect={(from: PairToken, to: PairToken, liquidityFrom, liquidityTo, pairAddress) => {
          setTokenFrom(from);
          setTokenTo(to);
          setSelectingPair(false);
          setTokenFromLiquidity(liquidityFrom);
          setTokenToLiquidity(liquidityTo)
          setPairAddress(pairAddress)
        }}
      />
    )
  }

  return (
    <SafeAreaView style={{backgroundColor: theme.backgroundColor, flex: 1, paddingHorizontal: 20}}>
      {/* <ExchangeScreen /> */}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1}}>
          <View style={{width: '100%', alignItems: 'center'}}>
            <View style={{borderRadius: 12, borderColor: 'rgba(96, 99, 108, 1)', borderWidth: 1.5, padding: 4, flexDirection: 'row', marginBottom: 32}}>
              <TouchableOpacity 
                style={{paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8, width: 116, height: 36, backgroundColor: type === 'MARKET' ? theme.backgroundFocusColor : 'transparent'}}
                onPress={() => setType('MARKET')}
              >
                <CustomText style={{color: theme.textColor, textAlign: 'center', fontWeight: type === 'MARKET' ? '500' : undefined, fontFamily: type === 'MARKET' && Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined}}>
                  {getLanguageString(language, 'MARKET_TITLE')}
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8, width: 116, height: 36, backgroundColor: type === 'LIMIT' ? theme.backgroundFocusColor : 'transparent'}}
                onPress={() => setType('LIMIT')}
              >
                <CustomText style={{color: theme.textColor, textAlign: 'center', fontWeight: type === 'LIMIT' ? '500' : undefined, fontFamily: type === 'LIMIT' && Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined}}>
                  {getLanguageString(language, 'LIMIT_TITLE')}
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
          {type === 'MARKET' ? 
            <MarketScreen 
              triggerSelectPair={() => setSelectingPair(true)} 
              tokenFrom={tokenFrom}
              tokenTo={tokenTo}
              tokenFromLiquidity={tokenFromLiquidity}
              tokenToLiquidity={tokenToLiquidity}
              pairAddress={pairAddress}
            /> 
            : 
            <ExchangeScreen />}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
};