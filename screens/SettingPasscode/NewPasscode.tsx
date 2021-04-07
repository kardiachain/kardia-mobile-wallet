import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useContext, useState} from 'react';
import {View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useSetRecoilState} from 'recoil';
import {localAuthAtom, localAuthEnabledAtom} from '../../atoms/localAuth';
import {showTabBarAtom} from '../../atoms/showTabBar';
import {ThemeContext} from '../../ThemeContext';
import {saveAppPasscode, saveAppPasscodeSetting} from '../../utils/local';
import Step1 from './Step1';
import Step2 from './Step2';
import {styles} from './style';

const NewPasscode = () => {
  const {params} = useRoute();
  const {theme} = useContext(ThemeContext);
  const [passcode, setPasscode] = useState('');
  const [step, setStep] = useState(1);
  const navigation = useNavigation();

  const setLocalAuthEnabled = useSetRecoilState(localAuthEnabledAtom);
  const setIsLocalAuthed = useSetRecoilState(localAuthAtom);

  const setTabBarVisible = useSetRecoilState(showTabBarAtom);

  useFocusEffect(
    useCallback(() => {
      setTabBarVisible(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const savePasscode = async () => {
    await saveAppPasscode(passcode);
    await saveAppPasscodeSetting(true);
    setIsLocalAuthed(true);
    setLocalAuthEnabled(true);
    setStep(1);
    // navigation.navigate('Home');
    if (!params || !(params as any).fromHome) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Home',
          },
        ],
      })
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      {step === 1 ? (
        <Step1
          onSubmit={(newPasscode) => {
            setPasscode(newPasscode);
            setStep(2);
          }}
        />
      ) : (
        <Step2 step1Passcode={passcode} onConfirm={savePasscode} />
      )}
    </SafeAreaView>
  );
};

export default NewPasscode;
