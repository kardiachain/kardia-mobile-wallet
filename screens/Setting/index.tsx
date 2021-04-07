/* eslint-disable react-native/no-inline-styles */
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useContext} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import ENIcon from 'react-native-vector-icons/Entypo';
import ToggleSwitch from 'toggle-switch-react-native';
import IconButton from '../../components/IconButton';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {ThemeContext} from '../../ThemeContext';
import {languageAtom} from '../../atoms/language';
import {getLanguageName, getLanguageString} from '../../utils/lang';
import {styles} from './style';
import {showTabBarAtom} from '../../atoms/showTabBar';
import {walletsAtom} from '../../atoms/wallets';

const INFO_DATA = {
  version: '2.1.0',
};

const SettingScreen = () => {
  const {theme, setTheme} = useContext(ThemeContext);
  const navigation = useNavigation();

  const language = useRecoilValue(languageAtom);

  const setTabBarVisible = useSetRecoilState(showTabBarAtom);

  const wallets = useRecoilValue(walletsAtom);

  useFocusEffect(
    useCallback(() => {
      setTabBarVisible(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={styles.header}>
        <Text allowFontScaling={false} style={[styles.headline, {color: theme.textColor}]}>
          {getLanguageString(language, 'SETTING_SCREEN_TITLE')}
        </Text>
        <IconButton
          name="bell-o"
          color={theme.textColor}
          size={18}
          onPress={() => navigation.navigate('Notification')}
        />
      </View>
      <ScrollView>
        <View style={{flex: 1}}>
          <Text
            allowFontScaling={false}
            style={{
              color: theme.textColor,
              marginHorizontal: 20,
              fontSize: 12,
            }}>
            {getLanguageString(language, 'GENERAL_GROUP')}
          </Text>
          <View
            style={{
              backgroundColor: theme.backgroundFocusColor,
              marginHorizontal: 20,
              marginVertical: 8,
              padding: 16,
              borderRadius: 8,
            }}>
            <TouchableOpacity
              style={styles.settingItemContainer}
              onPress={() => navigation.navigate('LanguageSetting')}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(105, 94, 181, 1)',
                  borderRadius: 12,
                }}>
                <Image
                  source={require('../../assets/icon/darkmode_dark.png')}
                  style={{width: 20, height: 20, resizeMode: 'contain'}}
                />
              </View>
              <View style={{alignItems: 'flex-start', flex: 1}}>
                <Text allowFontScaling={false} style={[styles.settingTitle, {color: theme.textColor}]}>
                  {getLanguageString(language, 'DARK_MODE_MENU')}
                </Text>
              </View>
              <ToggleSwitch
                isOn={theme.name === 'dark'}
                onColor="#6688FF"
                offColor="#B0B0B0"
                labelStyle={{ color: "black", fontWeight: "900" }}
                size="small"
                onToggle={(isOn: boolean) => {
                  if (isOn) {
                    setTheme('dark')
                  } else {
                    setTheme('light')
                  }
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.settingItemContainer, {marginTop: 28}]}
              onPress={() => navigation.navigate('LanguageSetting')}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#809CFF',
                  borderRadius: 12,
                }}>
                <Image
                  source={require('../../assets/icon/language.png')}
                  style={{width: 20, height: 20, resizeMode: 'contain'}}
                />
              </View>
              <View style={{alignItems: 'flex-start', flex: 1}}>
                <Text allowFontScaling={false} style={[styles.settingTitle, {color: theme.textColor}]}>
                  {getLanguageString(language, 'LANGUAGE_MENU')}
                </Text>
              </View>
              <Text allowFontScaling={false} style={{color: theme.mutedTextColor}}>
                {getLanguageName(language)}
              </Text>
              <ENIcon name="chevron-right" color={theme.textColor} size={20} />
            </TouchableOpacity>
          </View>
          <Text
            allowFontScaling={false}
            style={{
              color: theme.textColor,
              marginHorizontal: 20,
              fontSize: 12,
            }}>
            {getLanguageString(language, 'SECURITY_GROUP')}
          </Text>
          <View
            style={{
              backgroundColor: theme.backgroundFocusColor,
              marginHorizontal: 20,
              marginVertical: 8,
              padding: 16,
              borderRadius: 8,
            }}>
            <TouchableOpacity
              style={styles.settingItemContainer}
              onPress={() => navigation.navigate('SettingPasscode')}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#3360FF',
                  borderRadius: 12,
                }}>
                <Image
                  source={require('../../assets/icon/passcode.png')}
                  style={{width: 20, height: 20, resizeMode: 'contain'}}
                />
              </View>
              <View style={{alignItems: 'flex-start', flex: 1}}>
                <Text allowFontScaling={false} style={[styles.settingTitle, {color: theme.textColor}]}>
                  {getLanguageString(language, 'PASSCODE_MENU')}
                </Text>
              </View>
              <ENIcon name="chevron-right" color={theme.textColor} size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.settingItemContainer, {marginTop: 28}]}
              onPress={() => navigation.navigate('WalletManagement')}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#809CFF',
                  borderRadius: 12,
                }}>
                <Image
                  source={require('../../assets/icon/wallet_management.png')}
                  style={{width: 28, height: 28, resizeMode: 'contain'}}
                />
              </View>
              <View style={{alignItems: 'flex-start', flex: 1}}>
                <Text allowFontScaling={false} style={[styles.settingTitle, {color: theme.textColor}]}>
                  {getLanguageString(language, 'WALLET_MANAGEMENT')}
                </Text>
              </View>
              <Text allowFontScaling={false} style={{color: theme.mutedTextColor}}>
                ({wallets.length})
              </Text>
              <ENIcon name="chevron-right" color={theme.textColor} size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Text
        allowFontScaling={false}
        style={{
          textAlign: 'center',
          color: 'rgba(252, 252, 252, 0.26)',
          fontSize: theme.defaultFontSize,
          marginBottom: 24,
        }}>
        Kardiachain©2020 - Version {INFO_DATA.version}
      </Text>
    </SafeAreaView>
  );
};
export default SettingScreen;
