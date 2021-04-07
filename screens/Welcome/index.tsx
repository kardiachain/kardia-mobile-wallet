/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useContext, useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {languageAtom} from '../../atoms/language';
import Button from '../../components/Button';
import {getLanguageString} from '../../utils/lang';
import {styles} from './style';
import {ThemeContext} from '../../ThemeContext';
import WalkThrough from '../WalkThrough';
import { getWalkThroughView, saveWalkThroughView } from '../../utils/local';

const Welcome = () => {
  const navigation = useNavigation();
  const language = useRecoilValue(languageAtom);
  const {theme} = useContext(ThemeContext);

  const [showWalkThrough, setShowWalkThrough] = useState(true);

  useEffect(() => {
    (async () => {
      // Get local walkthrough view
      const walkThroughViewed = await getWalkThroughView();
      setShowWalkThrough(!walkThroughViewed)
      // setShowWalkThrough(false);
    })()
  }, [])

  const submitWalkThrough = async () => {
    await saveWalkThroughView(true)
    setShowWalkThrough(false);
  }

  if (showWalkThrough) {
    return (
      <WalkThrough onSubmit={submitWalkThrough} />
    )
  }

  return (
    <SafeAreaView
      style={[
        styles.noWalletContainer,
        {backgroundColor: theme.backgroundColor},
      ]}>
      <View style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{width: 188, height: 188, marginBottom: 58}}>
          <Image
            style={styles.noWalletLogo}
            source={require('../../assets/welcome_background.png')}
          />
        </View>
        <View>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 24,
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: 4,
              color: '#B4BDC9',
            }}>
            {getLanguageString(language, 'WELCOME')}
          </Text>
          <Text allowFontScaling={false} style={{fontSize: 14, color: '#B4BDC9', textAlign: 'center'}}>
            {getLanguageString(language, 'GETTING_STARTED_DESCRIPTION')}
          </Text>
        </View>
      </View>
      <View style={{flex: 1, justifyContent: 'space-evenly'}}>
        <Button
          title={getLanguageString(language, 'CREATE_NEW_WALLET')}
          type="outline"
          onPress={() => navigation.navigate('CreateWallet')}
          style={{width: 300}}
        />
        <Button
          title={getLanguageString(language, 'IMPORT_WALLET')}
          type="primary"
          onPress={() => navigation.navigate('ImportWallet')}
        />
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
