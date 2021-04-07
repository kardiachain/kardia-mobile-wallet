/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  ImageURISource,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useRecoilState, useRecoilValue} from 'recoil';
import {} from 'ethereumjs-util';
import {languageAtom} from '../../../atoms/language';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import TextInput from '../../../components/TextInput';
import {ThemeContext} from '../../../ThemeContext';
import {getLanguageString} from '../../../utils/lang';
import ScanQRAddressModal from '../ScanQRAddressModal';
import CustomImagePicker from '../../../components/ImagePicker';
import {styles} from './style';
import {addressBookAtom} from '../../../atoms/addressBook';
import {saveAddressBook} from '../../../utils/local';
import {toChecksum} from '../../../utils/string';

export default ({
  name = '',
  address = '',
  avatar = '',
  visible,
  isUpdate = false,
  onClose,
}: {
  name?: string;
  avatar?: string;
  address?: string;
  isUpdate?: boolean;
  visible: boolean;
  onClose: () => void;
}) => {
  const [abName, setABName] = useState(name);
  const [errName, setErrName] = useState(' ');
  const [abAvatar, setABAvatar] = useState<ImageURISource>({uri: avatar});
  const [abAddress, setABAddress] = useState(address);
  const [errAddress, setErrAddress] = useState(' ');
  const [showQRModal, setShowQRModal] = useState(false);
  const [keyboardShown, setKeyboardShown] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [addressBook, setAddressBook] = useRecoilState(addressBookAtom);

  const {theme} = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillShow', _keyboardDidShow);
      Keyboard.addListener('keyboardWillHide', _keyboardDidHide);
    } else {
      Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    }

    // cleanup function
    return () => {
      if (Platform.OS === 'ios') {
        Keyboard.removeListener('keyboardWillShow', _keyboardDidShow);
        Keyboard.removeListener('keyboardWillHide', _keyboardDidHide);
      } else {
        Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
      }
    };
  }, []);

  const _keyboardDidShow = (e: any) => {
    setKeyboardOffset(e.endCoordinates.height);
    setKeyboardShown(true);
  };

  const _keyboardDidHide = () => {
    setKeyboardOffset(0);
    setKeyboardShown(false);
  };

  const resetState = () => {
    setABName(name);
    setABAddress(address);
    setABAvatar({uri: avatar});
    setErrAddress(' ');
    setErrName(' ');
  };

  const closeModal = () => {
    resetState();
    onClose();
  };

  const showQRScanner = () => {
    setShowQRModal(true);
  };

  const handleSubmit = () => {
    let isValid = true;
    if (!abName) {
      setErrName(getLanguageString(language, 'REQUIRED_FIELD'));
      isValid = false;
    }
    if (!abAddress) {
      setErrAddress(getLanguageString(language, 'REQUIRED_FIELD'));
      isValid = false;
    }

    if (!isValid) {
      return;
    }
    const currentAB: Address[] = JSON.parse(JSON.stringify(addressBook));

    if (isUpdate) {
      const index = currentAB.findIndex((i) => i.address === address);
      if (index < 0) {
        setErrAddress(getLanguageString(language, 'ADDRESS_NOT_FOUND'));
        return;
      }
      currentAB[index].address = toChecksum(abAddress);
      currentAB[index].name = abName;
      currentAB[index].avatar = abAvatar.uri ? abAvatar.uri : '';
    } else {
      const index = currentAB.findIndex((i) => i.address === abAddress);
      if (index >= 0) {
        setErrAddress(getLanguageString(language, 'ADDRESS_EXISTS'));
        return;
      }
      currentAB.push({
        address: abAddress,
        name: abName,
        avatar: abAvatar.uri ? abAvatar.uri : '',
      });
    }

    setAddressBook(currentAB);
    saveAddressBook(currentAB);

    resetState();
    onClose();
  };

  const getModalStyle = () => {
    if (Platform.OS === 'android') {
      return {
        height: 460,
        backgroundColor: theme.backgroundFocusColor,
        // marginBottom: keyboardShown ? -70 : 0,
        // marginTop: keyboardShown ? 70 : 0,
      };
    } else {
      return {
        height: 460,
        backgroundColor: theme.backgroundFocusColor,
        marginBottom: keyboardOffset,
        marginTop: -keyboardOffset,
      };
    }
  };

  if (showQRModal) {
    return (
      <ScanQRAddressModal
        visible={showQRModal}
        onClose={() => setShowQRModal(false)}
        onScanned={(_address) => {
          setABAddress(_address);
          setShowQRModal(false);
        }}
      />
    );
  }

  return (
    <Modal
      visible={visible}
      showCloseButton={false}
      onClose={closeModal}
      contentStyle={getModalStyle()}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={[styles.container]}>
          <CustomImagePicker image={abAvatar} onSelect={setABAvatar} imageStyle={{
                // width: 80,
                // height: 80,
                borderRadius: 24,
              }} />
          <View
            style={{
              justifyContent: 'flex-start',
              width: '100%',
              marginBottom: 12,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme.mutedTextColor,
                fontSize: 12,
                marginBottom: 6,
              }}>
              {getLanguageString(language, 'ADDRESS_NAME')}
            </Text>
            <TextInput
              // headlineStyle={{color: 'black'}}
              onChangeText={setABName}
              value={abName}
              inputStyle={{
                backgroundColor: 'rgba(96, 99, 108, 1)',
                color: theme.textColor,
              }}
              message={errName}
            />
          </View>
          <View
            style={{
              justifyContent: 'flex-start',
              width: '100%',
              marginBottom: 12,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme.mutedTextColor,
                fontSize: 12,
                marginBottom: 6,
              }}>
              {getLanguageString(language, 'ADDRESS_ADDRESS')}
            </Text>
            <View
              style={{
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}>
              <View style={{flex: 1}}>
                <TextInput
                  // headlineStyle={{color: 'black'}}
                  onChangeText={setABAddress}
                  value={abAddress}
                  inputStyle={{
                    backgroundColor: 'rgba(96, 99, 108, 1)',
                    color: theme.textColor,
                  }}
                  message={errAddress}
                />
              </View>
              <TouchableOpacity
                onPress={showQRScanner}
                style={{
                  // flex: 1,
                  padding: 15,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  height: 44,
                  width: 44,
                  borderWidth: 1.5,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 8,
                }}>
                <Image
                  source={require('../../../assets/icon/scan_qr_dark.png')}
                  style={{width: 18, height: 18}}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Button
            type="outline"
            title={getLanguageString(language, 'CANCEL')}
            onPress={closeModal}
            block={true}
            style={{marginBottom: 12}}
          />
          <Button
            type="primary"
            title={getLanguageString(language, 'SAVE_TO_ADDRESS_BOOK')}
            onPress={handleSubmit}
            block={true}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
