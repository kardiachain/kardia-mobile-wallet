import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {
  ImageURISource,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useRecoilState, useRecoilValue} from 'recoil';
import {ThemeContext} from '../../ThemeContext';
import {addressBookAtom} from '../../atoms/addressBook';
import {languageAtom} from '../../atoms/language';
import Button from '../../components/Button';
import CustomImagePicker from '../../components/ImagePicker';
import TextInput from '../../components/TextInput';
import {getLanguageString} from '../../utils/lang';
import {saveAddressBook} from '../../utils/local';
import ScanQRAddressModal from '../common/ScanQRAddressModal';
import {styles} from './style';
import {truncate} from '../../utils/string';

const NewAddress = () => {
  const {params} = useRoute();

  const {theme} = useContext(ThemeContext);
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [errName, setErrName] = useState('');
  const [address, setAddress] = useState(
    params && (params as any).address ? (params as any).address : '',
  );
  const [errAddress, setErrAddress] = useState('');
  const [avatar, setAvatar] = useState<ImageURISource>({uri: ''});
  const [addressBook, setAddressBook] = useRecoilState(addressBookAtom);
  const [showModal, setShowModal] = useState(false);
  const language = useRecoilValue(languageAtom);

  const saveAddress = async () => {
    let isValid = true;
    if (!name) {
      setErrName(getLanguageString(language, 'REQUIRED_FIELD'));
      isValid = false;
    }
    if (!address) {
      setErrAddress(getLanguageString(language, 'REQUIRED_FIELD'));
      isValid = false;
    }

    if (!isValid) {
      return;
    }
    const currentAB: Address[] = JSON.parse(JSON.stringify(addressBook));
    currentAB.push({
      address,
      name,
      avatar: avatar.uri ? avatar.uri : '',
    });
    setAddressBook(currentAB);
    saveAddressBook(currentAB);
    navigation.navigate('AddressBook');
  };

  const showQRScanner = () => {
    setShowModal(true);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <ScanQRAddressModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onScanned={(_address) => {
            setAddress(_address);
            setShowModal(false);
          }}
        />
        <View style={styles.avatarPickerContainer}>
          <CustomImagePicker image={avatar} onSelect={setAvatar} />
        </View>
        <View style={styles.formFieldContainer}>
          <TextInput
            message={errName}
            headline={getLanguageString(language, 'ADDRESS_NAME')}
            block
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.formFieldContainer}>
          <TextInput
            message={errAddress}
            headline={getLanguageString(language, 'ADDRESS_ADDRESS')}
            block
            value={truncate(address, 17, 17)}
            onChangeText={setAddress}
            iconName="qrcode"
            onIconPress={showQRScanner}
          />
        </View>
        <Button
          title={getLanguageString(language, 'SAVE')}
          type="primary"
          onPress={saveAddress}
          style={styles.saveButton}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewAddress;
