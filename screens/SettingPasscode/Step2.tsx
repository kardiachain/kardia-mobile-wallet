/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {Text, View} from 'react-native';
import OtpInputs from 'react-native-otp-inputs';
import {useRecoilValue} from 'recoil';
import ENIcon from 'react-native-vector-icons/Entypo';
import {languageAtom} from '../../atoms/language';
import Button from '../../components/Button';
import {ThemeContext} from '../../ThemeContext';
import {getLanguageString} from '../../utils/lang';
import {styles} from './style';
import {useNavigation} from '@react-navigation/core';

const Step2 = ({
  step1Passcode,
  onConfirm,
}: {
  step1Passcode: string;
  onConfirm: () => void;
}) => {
  const navigation = useNavigation();
  const language = useRecoilValue(languageAtom);
  const {theme} = useContext(ThemeContext);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (passcode !== step1Passcode) {
      setError(getLanguageString(language, 'CONFIRM_PASSCODE_NOT_MATCH'));
      return;
    }

    onConfirm();
  };

  return (
    <>
      <View
        style={{
          // flexDirection: 'row',
          width: '100%',
          // justifyContent: 'flex-start',
          marginBottom: 114,
        }}>
        <ENIcon.Button
          name="chevron-left"
          onPress={() => navigation.goBack()}
          backgroundColor="transparent"
          style={{padding: 0, marginBottom: 18}}
        />
        <Text allowFontScaling={false} style={{color: theme.textColor, fontSize: 36}}>
          {getLanguageString(language, 'CONFIRM_PIN')}
        </Text>
      </View>
      <Text allowFontScaling={false} style={[styles.title, {color: theme.textColor}]}>
        {getLanguageString(language, 'CONFIRM_PASSCODE')}
      </Text>
      <View style={{flex: 1, width: '100%'}}>
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
            ...{
              backgroundColor: theme.backgroundFocusColor,
              color: theme.textColor,
            },
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
      <Button
        style={{marginHorizontal: 20, marginBottom: 24}}
        title={getLanguageString(language, 'CONFIRM')}
        onPress={handleSubmit}
      />
    </>
  );
};

export default Step2;
