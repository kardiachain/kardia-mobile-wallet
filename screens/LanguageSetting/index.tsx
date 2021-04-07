/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Flag from 'react-native-flags';
import Icon from 'react-native-vector-icons/FontAwesome';
import ENIcon from 'react-native-vector-icons/Entypo';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {ThemeContext} from '../../ThemeContext';
import {languageAtom} from '../../atoms/language';
import List from '../../components/List';
import {getLanguageString, getSupportedLanguage} from '../../utils/lang';
import {saveLanguageSetting} from '../../utils/local';
import {styles} from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/core';
import { useFocusEffect } from '@react-navigation/native';
import { showTabBarAtom } from '../../atoms/showTabBar';

const languageList = getSupportedLanguage();

const LanguageSetting = () => {
  const {theme} = useContext(ThemeContext);
  const navigation = useNavigation();

  const [language, setLanguage] = useRecoilState(languageAtom);

  const selectLanguage = async (lang: string) => {
    await saveLanguageSetting(lang);
    setLanguage(lang);
  };

  const setTabBarVisible = useSetRecoilState(showTabBarAtom);

  useFocusEffect(
    useCallback(() => {
      setTabBarVisible(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'flex-start',
        }}>
        <ENIcon.Button
          style={{paddingLeft: 20}}
          name="chevron-left"
          onPress={() => navigation.goBack()}
          backgroundColor="transparent"
        />
      </View>
      <Text allowFontScaling={false} style={{color: theme.textColor, marginHorizontal: 20, marginVertical: 18, fontSize: 36}}>{getLanguageString(language, 'LANGUAGE_SETTING_TITLE')}</Text>
      <List
        items={languageList}
        keyExtractor={(item) => item.flag}
        render={(item: Partial<Language>) => {
          const active = language === item.key;
          return (
            <TouchableOpacity
              style={[styles.languageItem, {backgroundColor: theme.backgroundFocusColor, marginHorizontal: 20, borderRadius: 8, marginVertical: 5}]}
              onPress={() => selectLanguage(item.key || '')}>
              <View style={styles.itemContainer}>
                <Flag code={item.flag} size={48} style={{marginRight: 14}} />
                <Text allowFontScaling={false} style={{color: theme.textColor}}>{item.name}</Text>
              </View>
              <View>
                {active && (
                  <Icon name="check" size={18} color={theme.textColor} />
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default LanguageSetting;
