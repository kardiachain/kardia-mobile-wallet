/* eslint-disable react-native/no-inline-styles */
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useContext} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {showTabBarAtom} from '../../atoms/showTabBar';
import {ThemeContext} from '../../ThemeContext';
import ENIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {styles} from './style';
import {getLanguageString, parseCardAvatar} from '../../utils/lang';
import {languageAtom} from '../../atoms/language';
import {walletsAtom} from '../../atoms/wallets';
import { SafeAreaView } from 'react-native-safe-area-context';
import List from '../../components/List';
import { truncate } from '../../utils/string';
import Button from '../../components/Button';

export default () => {
  const navigation = useNavigation();
  const language = useRecoilValue(languageAtom);
  const setTabBarVisible = useSetRecoilState(showTabBarAtom);
  const {theme} = useContext(ThemeContext);

  const wallets = useRecoilValue(walletsAtom);

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
          width: '100%',
          marginBottom: 19,
        }}>
        <ENIcon.Button
          name="chevron-left"
          onPress={() => navigation.goBack()}
          backgroundColor="transparent"
          style={{padding: 0, marginBottom: 18}}
        />
        <Text allowFontScaling={false} style={{color: theme.textColor, fontSize: 36}}>
          {getLanguageString(language, 'WALLET_MANAGEMENT')}
        </Text>
      </View>
      <List
        keyExtractor={(item: Wallet) => item.address}
        items={wallets}
        render={(item: Wallet) => {
          return (
            <TouchableOpacity onPress={() => navigation.navigate('WalletDetail', {address: item.address})} style={[styles.walletItemContainer, {backgroundColor: theme.backgroundFocusColor}]}>
              <Image style={styles.cardImage} source={parseCardAvatar(item.cardAvatarID || 0)} />
              <View style={{justifyContent: 'space-between'}}>
                <Text allowFontScaling={false} style={{color: theme.textColor, fontSize: 13, fontWeight: 'bold'}}>{item.name}</Text>
                <Text allowFontScaling={false} style={{fontSize: theme.defaultFontSize, color: 'rgba(252, 252, 252, 0.54)'}}>{truncate(item.address, 10, 10)}</Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />
      <Button
        type="primary"
        icon={<AntIcon name="plus" size={24} />}
        size="small"
        onPress={() => navigation.navigate('ImportWallet')}
        style={styles.floatingButton}
      />
    </SafeAreaView>
  );
};
