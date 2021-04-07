import React, {useContext} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {HeaderBackButton} from '@react-navigation/stack';
import SettingScreen from './screens/Setting';
import AddressBookSetting from './screens/AddressBookSetting';
import {ThemeContext} from './ThemeContext';
// import IconButton from './components/IconButton';
// import {View} from 'react-native';
import NewAddress from './screens/NewAddress';
// import {useNavigation} from '@react-navigation/native';
import AddressDetail from './screens/AddressDetail';
import LanguageSetting from './screens/LanguageSetting';
import {useRecoilValue} from 'recoil';
import {languageAtom} from './atoms/language';
import {getLanguageString} from './utils/lang';
import MnemonicPhraseSetting from './screens/MnemonicPhraseSetting';
import SettingPasscode from './screens/SettingPasscode';
import Info from './screens/Info';
import NewPasscode from './screens/SettingPasscode/NewPasscode';
import WalletManagement from './screens/WalletManagement';
import ImportWallet from './screens/ImportWallet';
import WalletDetail from './screens/WalletDetail';

const SettingStack = createStackNavigator();

const SettingStackScreen = () => {
  const {theme} = useContext(ThemeContext);
  // const navigation = useNavigation();
  const language = useRecoilValue(languageAtom);
  return (
    <SettingStack.Navigator
      initialRouteName="Setting"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
          shadowColor: 'transparent',
          backgroundColor: theme.backgroundColor,
        },
        headerBackTitleVisible: false,
      }}>
      <SettingStack.Screen
        name="Setting"
        component={SettingScreen}
        options={{headerShown: false}}
      />
      <SettingStack.Screen
        name="AddressBook"
        component={AddressBookSetting}
        options={{
          headerShown: false,
        }}
      />
      <SettingStack.Screen
        name="ImportWallet"
        component={ImportWallet}
        options={{
          headerShown: false,
        }}
      />
      <SettingStack.Screen
        name="WalletManagement"
        component={WalletManagement}
        options={{
          headerShown: false,
        }}
      />
      <SettingStack.Screen
        name="WalletDetail"
        component={WalletDetail}
        options={{
          headerShown: false,
        }}
      />
      <SettingStack.Screen
        name="NewAddress"
        component={NewAddress}
        options={{
          title: 'New address',
          headerTitleStyle: {
            color: theme.textColor,
          },
          headerTintColor: theme.textColor,
        }}
      />
      <SettingStack.Screen
        name="AddressDetail"
        component={AddressDetail}
        options={{
          title: 'Detail',
          headerTitleStyle: {
            color: theme.textColor,
          },
          headerTintColor: theme.textColor,
        }}
      />
      <SettingStack.Screen
        name="LanguageSetting"
        component={LanguageSetting}
        options={{
          headerShown: false,
          title: getLanguageString(language, 'LANGUAGE_SETTING_TITLE'),
          headerTitleStyle: {
            color: theme.textColor,
          },
          headerTintColor: theme.textColor,
        }}
      />
      <SettingStack.Screen
        name="MnemonicPhraseSetting"
        component={MnemonicPhraseSetting}
        options={{
          headerShown: false,
        }}
        // options={({navigation: _navigation, route}) => {
        //   return {
        //     title: getLanguageString(language, 'MNEMONIC_SETTING_TITLE'),
        //     headerTitleStyle: {
        //       color: theme.textColor,
        //     },
        //     headerTintColor: theme.textColor,
        //     headerLeft: () => {
        //       if (route.params && (route.params as any).from === 'Home') {
        //         return (
        //           <HeaderBackButton
        //             tintColor={theme.textColor}
        //             onPress={() => {
        //               _navigation.reset({
        //                 index: 0,
        //                 routes: [{name: 'Home'}],
        //               });
        //             }}
        //           />
        //         );
        //       }
        //       return <HeaderBackButton tintColor={theme.textColor} />;
        //     },
        //   };
        // }}
      />
      <SettingStack.Screen
        name="SettingPasscode"
        component={SettingPasscode}
        options={{
          headerShown: false,
        }}
        // options={{
        //   title: getLanguageString(language, 'PASSCODE_SETTING_TITLE'),
        //   headerTitleStyle: {
        //     color: theme.textColor,
        //   },
        //   headerTintColor: theme.textColor,
        // }}
      />
      <SettingStack.Screen
        name="NewPasscode"
        component={NewPasscode}
        options={{
          headerShown: false,
        }}
        // options={{
        //   title: getLanguageString(language, 'PASSCODE_SETTING_TITLE'),
        //   headerTitleStyle: {
        //     color: theme.textColor,
        //   },
        //   headerTintColor: theme.textColor,
        // }}
      />
      <SettingStack.Screen
        name="Info"
        component={Info}
        options={{
          title: getLanguageString(language, 'INFO_MENU'),
          headerTitleStyle: {
            color: theme.textColor,
          },
          headerTintColor: theme.textColor,
        }}
      />
    </SettingStack.Navigator>
  );
};

export default SettingStackScreen;
