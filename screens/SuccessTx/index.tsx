/* eslint-disable react-native/no-inline-styles */
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {format} from 'date-fns';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {addressBookAtom} from '../../atoms/addressBook';
import {languageAtom} from '../../atoms/language';
import {showTabBarAtom} from '../../atoms/showTabBar';
import Button from '../../components/Button';
import Divider from '../../components/Divider';
import {getTxDetail} from '../../services/transaction';
import {getTxDetail as getKRC20TxDetail} from '../../services/krc20';
import {ThemeContext} from '../../ThemeContext';
import {getDateFNSLocale, getLanguageString} from '../../utils/lang';
import {truncate} from '../../utils/string';
import {styles} from './style';
import {parseDecimals} from '../../utils/number';
import numeral from 'numeral';
import TextAvatar from '../../components/TextAvatar';

export default () => {
  const {params} = useRoute();
  const navigation = useNavigation();

  const txHash = params ? (params as any).txHash : '';
  const type = params ? (params as any).type : 'normal';
  const userAddress = params ? (params as any).userAddress : '';
  const tokenAddress = params ? (params as any).tokenAddress : '';
  const tokenSymbol = params ? (params as any).tokenSymbol : '';
  const tokenAvatar = params ? (params as any).tokenAvatarß : '';
  const tokenDecimals = params ? (params as any).tokenDecimals : -1;
  const validatorItem: Validator = params ? (params as any).validatorItem : {};
  const claimAmount = params ? (params as any).claimAmount : '';
  const undelegateAmount = params ? (params as any).undelegateAmount : '';
  const withdrawAmount = params ? (params as any).withdrawAmount : '';

  const {theme} = useContext(ThemeContext);

  const setTabBarVisible = useSetRecoilState(showTabBarAtom);
  const language = useRecoilValue(languageAtom);
  const dateLocale = getDateFNSLocale(language);

  // const [receiver, setReceiver] = useState('');
  const [address, setAddress] = useState<Record<string, any>>({});
  const [txObj, setTxObj] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const addressBook = useRecoilValue(addressBookAtom);

  useFocusEffect(
    useCallback(() => {
      setTabBarVisible(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    (async () => {
      while (true) {
        let tx: Record<string, any>;
        if (type === 'krc20') {
          tx = await getKRC20TxDetail(tokenAddress, userAddress, txHash);
        } else {
          tx = await getTxDetail(txHash);
        }
        if (tx && tx.hash) {
          const rs = addressBook.filter((item) => item.address === tx.to);
          setAddress(rs[0] || {});
          setTxObj(tx);
          setLoading(false);
          break;
        }
      }
    })();
  }, [addressBook, tokenAddress, txHash, type, userAddress]);

  const renderAmount = () => {
    switch (type) {
      case 'normal':
      case 'delegate':
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Text
              allowFontScaling={false}
              style={{color: theme.textColor, fontSize: 32, marginRight: 12}}>
              {numeral(txObj.amount).format('0,0.00')}
            </Text>
            <Text allowFontScaling={false} style={{color: 'rgba(252, 252, 252, 0.54)', fontSize: 18}}>
              KAI
            </Text>
          </View>
        );
      case 'krc20':
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Text
              allowFontScaling={false}
              style={{color: theme.textColor, fontSize: 32, marginRight: 12}}>
              {parseDecimals(txObj.value, tokenDecimals)}
            </Text>
            <Text allowFontScaling={false} style={{color: 'rgba(252, 252, 252, 0.54)', fontSize: 18}}>
              {tokenSymbol}
            </Text>
          </View>
        );
      case 'claim':
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Text
              allowFontScaling={false}
              style={{color: theme.textColor, fontSize: 32, marginRight: 12}}>
              {numeral(claimAmount).format('0,0.00')}
            </Text>
            <Text allowFontScaling={false} style={{color: 'rgba(252, 252, 252, 0.54)', fontSize: 18}}>
              KAI
            </Text>
          </View>
        );
      case 'withdraw':
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Text
              allowFontScaling={false}
              style={{color: theme.textColor, fontSize: 32, marginRight: 12}}>
              {numeral(withdrawAmount).format('0,0.00')}
            </Text>
            <Text allowFontScaling={false} style={{color: 'rgba(252, 252, 252, 0.54)', fontSize: 18}}>
              KAI
            </Text>
          </View>
        );
      case 'undelegate':
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Text
              allowFontScaling={false}
              style={{color: theme.textColor, fontSize: 32, marginRight: 12}}>
              {numeral(undelegateAmount).format('0,0.00')}
            </Text>
            <Text allowFontScaling={false} style={{color: 'rgba(252, 252, 252, 0.54)', fontSize: 18}}>
              KAI
            </Text>
          </View>
        );
      default:
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Text
              allowFontScaling={false}
              style={{color: theme.textColor, fontSize: 32, marginRight: 12}}>
              {numeral(txObj.amount).format('0,0.00')}
            </Text>
            <Text allowFontScaling={false} style={{color: 'rgba(252, 252, 252, 0.54)', fontSize: 18}}>
              KAI
            </Text>
          </View>
        );
    }
  };

  const renderReceiver = () => {
    switch (type) {
      case 'normal':
        return (
          <View style={styles.addressContainer}>
            <View
              style={{
                width: 48,
                height: 48,
                marginRight: 12,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.backgroundColor,
              }}>
              <Image
                style={{width: 20, height: 20}}
                source={
                  address.avatar
                    ? {uri: address.avatar}
                    : require('../../assets/icon/user.png')
                }
              />
            </View>
            <View>
              <Text
                allowFontScaling={false}
                style={[
                  styles.addressName,
                  {color: theme.textColor, fontSize: 13},
                ]}>
                {address.name
                  ? address.name
                  : getLanguageString(language, 'NEW_CONTACT')}
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.addressHash,
                  {
                    color: 'rgba(252, 252, 252, 0.54)',
                    fontSize: theme.defaultFontSize,
                  },
                ]}>
                {truncate(address.address, 15, 15)}
              </Text>
            </View>
          </View>
        );
      case 'delegate':
      case 'claim':
      case 'undelegate':
      case 'withdraw':
        return (
          <View style={styles.addressContainer}>
            <TextAvatar
              text={validatorItem.name}
              style={{
                width: 32,
                height: 32,
                borderRadius: 12,
                marginRight: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              textStyle={{fontSize: 16}}
            />
            <View style={{justifyContent: 'space-between'}}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.addressName,
                  {color: theme.textColor, fontSize: 13},
                ]}>
                {validatorItem.name}
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.commissionRateText,
                  {
                    color: 'rgba(252, 252, 252, 0.54)',
                    fontSize: theme.defaultFontSize,
                  },
                ]}>
                Rate: {validatorItem.commissionRate} %
              </Text>
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.addressContainer}>
            <View
              style={{
                width: 48,
                height: 48,
                marginRight: 12,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.backgroundColor,
              }}>
              <Image
                style={{width: 20, height: 20}}
                source={
                  address.avatar
                    ? {uri: address.avatar}
                    : require('../../assets/icon/user.png')
                }
              />
            </View>
            <View>
              <Text
                allowFontScaling={false}
                style={[
                  styles.addressName,
                  {color: theme.textColor, fontSize: 13},
                ]}>
                {address.name
                  ? address.name
                  : getLanguageString(language, 'NEW_CONTACT')}
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.addressHash,
                  {
                    color: 'rgba(252, 252, 252, 0.54)',
                    fontSize: theme.defaultFontSize,
                  },
                ]}>
                {truncate(address.address, 15, 15)}
              </Text>
            </View>
          </View>
        );
    }
  };

  const renderSuccessDesc = () => {
    switch (type) {
      case 'normal':
        return getLanguageString(language, 'TX_SUCCESS');
      case 'delegate':
        return getLanguageString(language, 'DELEGATE_SUCCESS');
      case 'undelegate':
        return getLanguageString(language, 'UNDELEGATE_SUCCESS').replace(/{{KAI_AMOUNT}}/g, numeral(undelegateAmount).format('0,0.00'));
      case 'withdraw': 
        return getLanguageString(language, 'WITHDRAW_SUCCESS').replace(/{{KAI_AMOUNT}}/g, numeral(withdrawAmount).format('0,0.00'))
      default:
        return getLanguageString(language, 'TX_SUCCESS');
    }
  };

  const handleBack = () => {
    switch (type) {
      case 'normal':
        navigation.goBack()
        break;
      case 'delegate':
      case 'claim':
      case 'undelegate':
      case 'withdraw':
        navigation.reset({
          index: 0,
          routes: [{name: 'Staking'}],
        });
        break;
      case 'krc20':
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Home',
              state: {
                routes: [{name: 'TokenDetail', params: {
                  tokenSymbol,
                  tokenAddress,
                  tokenDecimals,
                  tokenAvatar,
                }}],
              }
            }
          ],
        });
        break;
      default:
        navigation.goBack()
        break;
    }
  }

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}>
        <ActivityIndicator color={theme.textColor} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View
        style={{
          // marginTop: 95,
          width: '100%',
          height: 272,
        }}>
        <ImageBackground
          imageStyle={{resizeMode: 'contain'}}
          style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}
          source={require('../../assets/success_tx.png')}>
          <Image
            style={{width: 86, height: 86}}
            source={require('../../assets/icon/success_tx_icon.png')}
          />
          <Text
            allowFontScaling={false}
            style={{color: theme.textColor, fontSize: 32, fontWeight: 'bold'}}>
            {getLanguageString(language, 'SUCCESS')}
          </Text>
          <Text allowFontScaling={false} style={{color: theme.textColor, fontSize: 15, marginTop: 8, textAlign: 'center', paddingHorizontal: 18}}>
            {renderSuccessDesc()}
          </Text>
        </ImageBackground>
      </View>
      {renderReceiver()}
      <Divider
        style={{width: 280, backgroundColor: '#60636C', marginVertical: 32}}
      />
      <Text allowFontScaling={false} style={{textAlign: 'center', color: theme.textColor, fontSize: 15}}>
        {getLanguageString(language, 'TRANSACTION_AMOUNT')}
      </Text>
      {renderAmount()}
      <Text allowFontScaling={false} style={{fontSize: 15, color: 'rgba(252, 252, 252, 0.54)'}}>
        {txObj.date &&
          format(txObj.date, 'MMM dd, yyyy - hh:mm aa', {
            locale: dateLocale,
          })}
      </Text>
      <Button
        title={getLanguageString(language, 'OK_TEXT')}
        onPress={handleBack}
        style={{marginTop: 95}}
        textStyle={{fontWeight: 'bold'}}
      />
    </View>
  );
};
