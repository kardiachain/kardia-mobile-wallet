/* eslint-disable react-native/no-inline-styles */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Image, Keyboard, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Text, TouchableOpacity, View} from 'react-native';
import OtpInputs, {OtpInputsRef} from 'react-native-otp-inputs';
import TouchID from 'react-native-touch-id';
import {useRecoilValue} from 'recoil';
import {languageAtom} from '../../../atoms/language';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import {ThemeContext} from '../../../ThemeContext';
import {getLanguageString} from '../../../utils/lang';
import {getAppPasscode} from '../../../utils/local';
import {styles} from './style';
import Divider from '../../../components/Divider';

const optionalConfigObject = {
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false, // if true is passed, itwill allow isSupported to return an error if the device is not enrolled in touch id/face id etc. Otherwise, it will just tell you what method is supported, even if the user is not enrolled.  (default false)
};

export default ({
  visible,
  onClose,
  onSuccess,
}: {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const otpRef = useRef<OtpInputsRef>(null);
  const {theme} = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [touchSupported, setTouchSupported] = useState(false);
  const [touchType, setTouchType] = useState('');
  const [keyboardShown, setKeyboardShown] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const _keyboardDidShow = (e: any) => {
    setKeyboardOffset(e.endCoordinates.height);
    setKeyboardShown(true);
  };

  const _keyboardDidHide = () => {
    setKeyboardOffset(0);
    setKeyboardShown(false);
  };

  useEffect(() => {
    TouchID.isSupported(optionalConfigObject)
      .then((biometryType) => {
        // Success code
        if (biometryType === 'FaceID') {
          setTouchType(biometryType);
          console.log('FaceID is supported.');
        } else {
          setTouchType('TouchID');
          console.log('TouchID is supported.');
        }
        setTouchSupported(true);
      })
      .catch((err: any) => {
        // Failure code
        console.log(err);
      });

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

  const resetOTP = useCallback(() => {
    otpRef && otpRef.current && otpRef.current.reset();
  }, []);

  const verify = async () => {
    const localPass = await getAppPasscode();
    if (localPass !== passcode) {
      setError(getLanguageString(language, 'WRONG_PIN'));
      return;
    }
    onSuccess();
    onClose();
  };

  const authByTouchID = async () => {
    TouchID.authenticate(
      `Use ${touchType} to access wallet`,
      optionalConfigObject,
    )
      .then(() => {
        onSuccess();
        onClose();
      })
      .catch((err: any) => {
        // Failure code
        console.log(err);
      });
  };

  const closeAuthModal = () => {
    resetOTP();
    onClose();
  };

  const getModalStyle = () => {
    if (Platform.OS === 'android') {
      return {
        height: 350,
        backgroundColor: theme.backgroundFocusColor,
        alignItems: 'center',
      };
    } else {
      return {
        height: 350,
        backgroundColor: theme.backgroundFocusColor,
        alignItems: 'center',
        marginBottom: keyboardOffset,
        marginTop: -keyboardOffset,
      };
    }
  };

  return (
    <Modal
      visible={visible}
      showCloseButton={false}
      onClose={closeAuthModal}
      contentStyle={getModalStyle()}>
      <Text
        allowFontScaling={false}
        style={{
          textAlign: 'center',
          color: theme.mutedTextColor,
          fontSize: 15,
        }}>
        {getLanguageString(language, 'ENTER_PIN_CODE')}
      </Text>
      <OtpInputs
        // TODO: remove ts-ignore after issue fixed
        // @ts-ignore
        keyboardType="decimal-pad"
        // value={passcode}
        handleChange={setPasscode}
        numberOfInputs={4}
        autofillFromClipboard={false}
        style={styles.otpContainer}
        inputStyles={{
          ...styles.otpInput,
          ...{backgroundColor: theme.backgroundColor},
        }}
        secureTextEntry={true}
        ref={otpRef}
      />
      {error !== '' && (
        <Text
          allowFontScaling={false}
          style={{color: 'red', paddingHorizontal: 20, fontStyle: 'italic'}}>
          {error}
        </Text>
      )}
      <Divider style={{width: 32, backgroundColor: '#F0F1F2'}} />
      {touchSupported && (
        <TouchableOpacity
          onPress={authByTouchID}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 24,
          }}>
          {touchType === 'FaceID' ? (
            <Image
              style={{width: 30, height: 30, marginRight: 8}}
              source={require('../../../assets/icon/face_id_dark.png')}
            />
          ) : (
            <Icon
              style={{marginRight: 12}}
              name="finger-print"
              color={theme.textColor}
              size={24}
            />
          )}
          <Text allowFontScaling={false} style={{color: theme.textColor, fontSize: 15}}>
            Authenticate by {touchType}
          </Text>
        </TouchableOpacity>
      )}
      <View style={{width: '100%'}}>
        <Button
          title={getLanguageString(language, 'CANCEL')}
          onPress={closeAuthModal}
          type="outline"
          style={{marginBottom: 12}}
          block
        />
        <Button
          title={getLanguageString(language, 'CONFIRM')}
          onPress={verify}
          type="primary"
          block
        />
      </View>
    </Modal>
  );
};
