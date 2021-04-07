/* eslint-disable react-native/no-inline-styles */
import {useNavigation, useRoute} from '@react-navigation/core';
import React, {useContext} from 'react';
import {ActivityIndicator, Image, Text, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {addressBookAtom} from '../../atoms/addressBook';
import {languageAtom} from '../../atoms/language';
import {format, formatDistanceToNowStrict, isSameDay} from 'date-fns';
import IconButton from '../../components/IconButton';
import {ThemeContext} from '../../ThemeContext';
import {
  getDateFNSLocale,
  getDateTimeFormat,
  getLanguageString,
} from '../../utils/lang';
import {parseDecimals} from '../../utils/number';
import {
  copyToClipboard,
  getFromAddressBook,
  truncate,
} from '../../utils/string';
import {styles} from './styles';
import numeral from 'numeral';
import {selectedWalletAtom, walletsAtom} from '../../atoms/wallets';
import Button from '../../components/Button';

const TokenTxDetail = () => {
  const navigation = useNavigation();
  const {params}: any = useRoute();
  const txData: KRC20Transaction = params ? JSON.parse(params.txData) : {};
  const tokenInfo: Partial<KRC20> = params ? (params as any).tokenInfo : {};
  const {theme} = useContext(ThemeContext);
  const avatar = tokenInfo.avatar || '';

  const language = useRecoilValue(languageAtom);
  const addressBook = useRecoilValue(addressBookAtom);
  const wallets = useRecoilValue(walletsAtom);
  const selectedWallet = useRecoilValue(selectedWalletAtom);

  const getOtherAddress = () => {
    if (
      !txData ||
      !wallets[selectedWallet] ||
      !wallets[selectedWallet].address
    ) {
      return '';
    }
    if (txData.from !== wallets[selectedWallet].address) {
      return txData.from;
    }
    return txData.to;
  };

  if (!txData) {
    return (
      <View
        style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <ActivityIndicator color={theme.textColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View
        style={{
          // flex: 1,
          width: '100%',
          alignItems: 'center',
          paddingVertical: 20,
        }}>
        <View
          style={{
            width: 90,
            height: 90,

            borderRadius: 45,
            backgroundColor: 'white',

            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',

            marginBottom: 12,
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
        <Text allowFontScaling={false} style={[styles.tokenBalance, {color: theme.textColor}]}>
          {numeral(
            parseDecimals(Number(txData.value), tokenInfo.decimals || 18),
          ).format('0,0.00')}{' '}
          {tokenInfo.symbol}
        </Text>
        {/* <Divider /> */}
      </View>
      <View style={styles.infoContainer}>
        <Text allowFontScaling={false} style={[styles.infoTitle, {color: theme.textColor}]}>
          {getLanguageString(language, 'FROM')}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text
            allowFontScaling={false}
            style={[
              styles.infoValue,
              {color: theme.textColor, marginRight: 6},
            ]}>
            {truncate(
              getFromAddressBook(addressBook, txData.from || ''),
              10,
              10,
            )}
          </Text>
          <IconButton
            color={theme.textColor}
            name="copy"
            size={16}
            onPress={() => copyToClipboard(txData.from)}
          />
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text allowFontScaling={false} style={[styles.infoTitle, {color: theme.textColor}]}>
          {getLanguageString(language, 'TO')}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text
            allowFontScaling={false}
            style={[
              styles.infoValue,
              {color: theme.textColor, marginRight: 6},
            ]}>
            {truncate(getFromAddressBook(addressBook, txData.to || ''), 10, 10)}
          </Text>
          <IconButton
            color={theme.textColor}
            name="copy"
            size={16}
            onPress={() => copyToClipboard(txData.to)}
          />
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text allowFontScaling={false} style={[styles.infoTitle, {color: theme.textColor}]}>
          {getLanguageString(language, 'TRANSACTION_DATE')}
        </Text>
        <Text allowFontScaling={false} style={[styles.infoValue, {color: theme.textColor}]}>
          {isSameDay(new Date(txData.time), new Date())
            ? `${formatDistanceToNowStrict(new Date(txData.time), {
                locale: getDateFNSLocale(language),
              })} ${getLanguageString(language, 'AGO')}`
            : format(new Date(txData.time), getDateTimeFormat(language), {
                locale: getDateFNSLocale(language),
              })}
        </Text>
      </View>
      <View style={{marginTop: 15, paddingHorizontal: 22, paddingVertical: 8}}>
        {getFromAddressBook(addressBook, getOtherAddress()) ===
          getOtherAddress() && (
          <Button
            title={getLanguageString(language, 'SAVE_TO_ADDRESS_BOOK')}
            type="secondary"
            block
            style={{marginBottom: 14}}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Address',
                    state: {
                      routes: [
                        {name: 'AddressBook'},
                        {
                          name: 'NewAddress',
                          params: {
                            address: getOtherAddress(),
                          },
                        },
                      ],
                    },
                  },
                ],
              });
            }}
          />
        )}
        <Button
          title={getLanguageString(language, 'GO_BACK')}
          type="outline"
          block
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

export default TokenTxDetail;
