import {format} from 'date-fns';
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import {useRecoilValue} from 'recoil';
import {addressBookAtom} from '../../../atoms/addressBook';
import {languageAtom} from '../../../atoms/language';
import {selectedWalletAtom, walletsAtom} from '../../../atoms/wallets';
import Button from '../../../components/Button';
import Divider from '../../../components/Divider';
import Modal from '../../../components/Modal';
import {ThemeContext} from '../../../ThemeContext';
import numeral from 'numeral';
import {
  getDateFNSLocale,
  getLanguageString,
  parseCardAvatar,
} from '../../../utils/lang';
import {parseDecimals} from '../../../utils/number';
import {
  getFromAddressBook,
  getAddressAvatar,
  truncate,
} from '../../../utils/string';
import NewAddressModal from '../NewAddressModal';
import {styles} from './style';
import {getTxDetail} from '../../../services/transaction';

export default ({
  txObj,
  visible,
  onClose,
}: {
  txObj?: Record<string, any>;
  visible: boolean;
  onClose: () => void;
}) => {
  const {theme} = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);
  const dateLocale = getDateFNSLocale(language);

  const wallets = useRecoilValue(walletsAtom);
  const selectedWallet = useRecoilValue(selectedWalletAtom);
  const addressBook = useRecoilValue(addressBookAtom);

  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  const [txFee, setTxFee] = useState(0);

  useEffect(() => {
    (async () => {
      if (!txObj) {
        return;
      }
      const tx = await getTxDetail(txObj.transactionHash);
      setTxFee(Number(tx.fee));
    })();
  }, [txObj]);

  const isNewContact = () => {
    return (
      getFromAddressBook(addressBook, getOtherAddress()) === getOtherAddress()
    );
  };

  const getOtherAddress = () => {
    if (
      !txObj ||
      !wallets[selectedWallet] ||
      !wallets[selectedWallet].address
    ) {
      return '';
    }
    if (txObj.from !== wallets[selectedWallet].address) {
      return txObj.from;
    }
    return txObj.to;
  };

  const renderOwnAddress = (address: string) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 12,
          marginTop: 4,
          backgroundColor: theme.backgroundColor,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <Image
          style={{width: 52, height: 32, marginRight: 12}}
          source={parseCardAvatar(wallets[selectedWallet].cardAvatarID || 0)}
        />
        <View>
          <Text allowFontScaling={false} style={{color: '#FFFFFF', fontWeight: 'bold'}}>
            {wallets[selectedWallet].name}
          </Text>
          <Text allowFontScaling={false} style={{color: 'rgba(252, 252, 252, 0.54)', fontSize: 12}}>
            {truncate(address, 10, 10)}
          </Text>
        </View>
      </View>
    );
  };

  const renderOtherAddress = (address: string) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 12,
          marginTop: 4,
          backgroundColor: theme.backgroundColor,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        {isNewContact() || getAddressAvatar(addressBook, address) === '' ? (
          <View
            style={{
              width: 52,
              height: 32,
              marginRight: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={styles.newContactAvatarContainer}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/icon/user.png')}
              />
            </View>
          </View>
        ) : (
          <Image
            style={{width: 20, height: 20}}
            source={{uri: getAddressAvatar(addressBook, address)}}
          />
        )}
        <View>
          <Text allowFontScaling={false} style={{color: '#FFFFFF', fontWeight: 'bold'}}>
            {isNewContact()
              ? getLanguageString(language, 'NEW_CONTACT')
              : getFromAddressBook(addressBook, address)}
          </Text>
          <Text allowFontScaling={false} style={{color: 'rgba(252, 252, 252, 0.54)', fontSize: 12}}>
            {truncate(address, 10, 10)}
          </Text>
        </View>
        {isNewContact() && (
          <View style={{alignItems: 'flex-end', flex: 1}}>
            <Button
              title={getLanguageString(language, 'SAVE_TO_ADDRESS_BOOK')}
              onPress={() => setShowAddAddressModal(true)}
              type="link"
              textStyle={{textDecorationLine: 'none', fontSize: 12}}
            />
          </View>
        )}
      </View>
    );
  };

  if (!txObj) {
    return null;
  }

  if (showAddAddressModal) {
    return (
      <NewAddressModal
        address={getOtherAddress()}
        visible={true}
        onClose={() => {
          setShowAddAddressModal(false);
        }}
      />
    );
  }

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      contentStyle={{backgroundColor: theme.backgroundFocusColor, height: 520}}>
      <View style={[styles.container]}>
        <View
          style={{
            width: 64,
            height: 64,

            borderRadius: 16,
            backgroundColor: theme.backgroundColor,

            // flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',

            position: 'absolute',
            top: -67,

            borderWidth: 1,
            borderColor: 'gray',
          }}>
          {txObj.type === 'IN' ? (
            <Image
              source={require('../../../assets/icon/receive.png')}
              style={styles.logo}
            />
          ) : (
            <Image
              source={require('../../../assets/icon/send.png')}
              style={styles.logo}
            />
          )}
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            allowFontScaling={false}
            style={[
              styles.amountText,
              {color: theme.textColor, marginRight: 12},
            ]}>
            {numeral(parseDecimals(txObj.value, txObj.decimals)).format(
              '0,0.00',
            )}
          </Text>
          <Text allowFontScaling={false} style={{color: theme.textColor, fontSize: 18}}>
            {txObj.tokenSymbol}
          </Text>
        </View>
        <Text allowFontScaling={false} style={styles.txhash}>{truncate(txObj.hash, 14, 14)}</Text>
        <View>
          <View
            style={{
              backgroundColor: theme.backgroundColor,
              borderRadius: 4,
              paddingVertical: 9,
              paddingHorizontal: 12,
              marginTop: 12,
              flexDirection: 'row',
            }}>
            <Image
              style={{width: 16, height: 16, marginRight: 8}}
              source={require('../../../assets/icon/calendar.png')}
            />
            <Text allowFontScaling={false} style={{fontSize: 12, color: theme.textColor}}>
              {format(txObj.date, 'hh:mm aa, E dd/MM/yyyy', {
                locale: dateLocale,
              })}
            </Text>
          </View>
        </View>
        <Divider />
        <View style={{justifyContent: 'flex-start', width: '100%'}}>
          <Text allowFontScaling={false} style={{color: theme.mutedTextColor, fontSize: 12}}>
            {getLanguageString(language, 'FROM')}
          </Text>
          {txObj.from !== getOtherAddress()
            ? renderOwnAddress(txObj.from)
            : renderOtherAddress(txObj.from)}
        </View>
        <View
          style={{justifyContent: 'flex-start', width: '100%', marginTop: 12}}>
          <Text allowFontScaling={false} style={{color: theme.mutedTextColor, fontSize: 12}}>
            {getLanguageString(language, 'TO')}
          </Text>
          {txObj.to !== getOtherAddress()
            ? renderOwnAddress(txObj.to)
            : renderOtherAddress(txObj.to)}
        </View>
        <Divider />
        <View style={{justifyContent: 'flex-start', width: '100%'}}>
          <Text allowFontScaling={false} style={{color: theme.mutedTextColor, fontSize: 12}}>
            {getLanguageString(language, 'TRANSACTION_FEE')}
          </Text>
          <Text allowFontScaling={false} style={{color: theme.textColor, fontSize: 15}}>
            {txFee} KAI
          </Text>
        </View>
        <Divider />
        <Button
          title={getLanguageString(language, 'OK_TEXT')}
          type="primary"
          block={true}
          onPress={onClose}
          textStyle={{fontWeight: 'bold'}}
        />
      </View>
    </Modal>
  );
};
