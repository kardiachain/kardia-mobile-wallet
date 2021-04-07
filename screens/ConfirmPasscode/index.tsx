/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import OtpInputs from 'react-native-otp-inputs';
import TouchID from 'react-native-touch-id';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {languageAtom} from '../../atoms/language';
import Button from '../../components/Button';
import {ThemeContext} from '../../ThemeContext';
import {getLanguageString} from '../../utils/lang';
import {getAppPasscode} from '../../utils/local';
import {styles} from './style';
import {localAuthAtom} from '../../atoms/localAuth';
import Divider from '../../components/Divider';

const optionalConfigObject = {
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false, // if true is passed, itwill allow isSupported to return an error if the device is not enrolled in touch id/face id etc. Otherwise, it will just tell you what method is supported, even if the user is not enrolled.  (default false)
};

const ConfirmPasscode = () => {
  const {theme} = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);

  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [touchSupported, setTouchSupported] = useState(false);
  const [touchType, setTouchType] = useState('');
  const setLocalAuth = useSetRecoilState(localAuthAtom);

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
  }, []);

  const handleSubmit = async () => {
    const localPass = await getAppPasscode();
    if (localPass !== passcode) {
      setError(getLanguageString(language, 'WRONG_PIN'));
      return;
    }
    setLocalAuth(true);
  };

  const authByTouchID = async () => {
    TouchID.authenticate('Use touch ID to access wallet', optionalConfigObject)
      .then(async () => {
        setLocalAuth(true);
      })
      .catch((err: any) => {
        // Failure code
        console.log(err);
      });
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <Text allowFontScaling={false} style={[styles.title, {color: theme.textColor}]}>
        {getLanguageString(language, 'ENTER_PIN_CODE')}
      </Text>
      <View style={{marginVertical: 24, width: '100%'}}>
        <OtpInputs
          // TODO: remove ts-ignore after issue fixed
          // @ts-ignore
          keyboardType="decimal-pad"
          handleChange={setPasscode}
          numberOfInputs={4}
          autofillFromClipboard={false}
          style={styles.otpContainer}
          inputStyles={{
            ...styles.otpInput,
            ...{backgroundColor: theme.backgroundFocusColor, color: theme.textColor},
          }}
          secureTextEntry={true}
        />
        {error !== '' && (
          <Text
            allowFontScaling={false}
            style={{color: 'red', paddingHorizontal: 20, fontStyle: 'italic'}}>
            {error}
          </Text>
        )}
      </View>
      <Divider style={{width: 32, backgroundColor: '#F0F1F2'}} />
      {touchSupported && (
        <TouchableOpacity
          onPress={authByTouchID}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 20,
          }}>
          {touchType === 'FaceID' ? (
            <Image
              style={{width: 30, height: 30, marginRight: 8}}
              source={require('../../assets/icon/face_id_dark.png')}
            />
          ) : (
            <Icon name="finger-print" color={theme.textColor} size={30} />
          )}
          <Text allowFontScaling={false} style={{color: theme.textColor}}>
            Authenticate by {touchType}
          </Text>
        </TouchableOpacity>
      )}
      <Button
        block
        title={getLanguageString(language, 'CONFIRM')}
        onPress={handleSubmit}
      />
    </View>
  );
};

export default ConfirmPasscode;
