/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import SettingScreen from './screens/Setting';
import AddressBookSetting from './screens/AddressBookSetting';
import {ThemeContext} from './App';
import IconButton from './components/IconButton';
import {View} from 'react-native';
import NewAddress from './screens/NewAddress';
import {useNavigation} from '@react-navigation/native';
import AddressDetail from './screens/AddressDetail';

const SettingStack = createStackNavigator();

const SettingStackScreen = () => {
  const theme = useContext(ThemeContext);
  const navigation = useNavigation();
  return (
    <SettingStack.Navigator
      initialRouteName="TransactionList"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
          title: 'Address Book',
          headerStyle: {
            backgroundColor: theme.backgroundColor,
          },
          headerTitleStyle: {
            color: theme.textColor,
          },
          headerTintColor: theme.textColor,
          headerRight: () => {
            return (
              <View style={{paddingRight: 12}}>
                <IconButton
                  name="plus"
                  size={20}
                  color={theme.textColor}
                  onPress={() => {
                    navigation.navigate('NewAddress');
                  }}
                />
              </View>
            );
          },
        }}
      />
      <SettingStack.Screen
        name="NewAddress"
        component={NewAddress}
        options={{
          title: 'New address',
          headerStyle: {
            backgroundColor: theme.backgroundColor,
          },
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
          headerStyle: {
            backgroundColor: theme.backgroundColor,
          },
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