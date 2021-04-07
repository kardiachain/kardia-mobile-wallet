/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {useRecoilValue} from 'recoil';
import {languageAtom} from '../../../atoms/language';
import {selectedWalletAtom, walletsAtom} from '../../../atoms/wallets';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import {ThemeContext} from '../../../ThemeContext';
import {getLanguageString} from '../../../utils/lang';
import {copyToClipboard} from '../../../utils/string';

const {width: viewportWidth} = Dimensions.get('window');

const QRModal = ({
  onClose,
  visible,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const wallets = useRecoilValue(walletsAtom);
  const selectedWallet = useRecoilValue(selectedWalletAtom);
  const language = useRecoilValue(languageAtom);

  const {theme} = useContext(ThemeContext);

  return (
    <Modal
      visible={visible}
      showCloseButton={false}
      contentStyle={{
        paddingHorizontal: 0,
        backgroundColor: theme.backgroundFocusColor,
        height: 550,
      }}
      onClose={onClose}>
      <Text allowFontScaling={false} style={{fontSize: 20, fontWeight: 'bold', color: theme.textColor}}>
        {getLanguageString(language, 'SCAN_QR_FOR_ADDRESS')}
      </Text>
      <TouchableOpacity
        onPress={() =>
          copyToClipboard(
            wallets[selectedWallet] ? wallets[selectedWallet].address : '',
          )
        }>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 14,
            fontStyle: 'italic',
            paddingHorizontal: 18,
            textAlign: 'center',
            textDecorationLine: 'underline',
            color: theme.textColor,
          }}>
          {wallets[selectedWallet] ? wallets[selectedWallet].address : ''}
        </Text>
      </TouchableOpacity>
      <Text
        allowFontScaling={false}
        style={{
          fontStyle: 'italic',
          fontWeight: 'bold',
          paddingHorizontal: 12,
          paddingVertical: 16,
          color: theme.primaryColor,
          textAlign: 'center',
          fontSize: theme.defaultFontSize
        }}>
        {getLanguageString(language, 'ERC20_WARNING')}
      </Text>
      <View
        style={{
          padding: 32,
          backgroundColor: theme.backgroundColor,
          borderRadius: 12,
        }}>
        <QRCode
          size={viewportWidth / 2}
          value={wallets[selectedWallet] ? wallets[selectedWallet].address : ''}
          logo={require('../../../assets/logo.png')}
          logoBackgroundColor="#FFFFFF"
          logoSize={22}
          logoMargin={2}
          logoBorderRadius={20}
          color={theme.textColor}
          backgroundColor={theme.backgroundColor}
        />
      </View>
      <Button
        title={getLanguageString(language, 'CLOSE')}
        onPress={onClose}
        style={{marginTop: 32, marginHorizontal: 20}}
      />
    </Modal>
  );
};

export default QRModal;
