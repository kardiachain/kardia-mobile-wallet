/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import AddressBookSetting from './screens/AddressBookSetting';
import {ThemeContext} from './ThemeContext';
import NewAddress from './screens/NewAddress';
import AddressDetail from './screens/AddressDetail';

const AddressStack = createStackNavigator();

const AddressStackScreen = () => {
  const {theme} = useContext(ThemeContext);
  return (
    <AddressStack.Navigator
      initialRouteName="AddressBook"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
          shadowColor: 'transparent',
          backgroundColor: theme.backgroundColor,
        },
        headerBackTitleVisible: false,
      }}>
      <AddressStack.Screen
        name="AddressBook"
        component={AddressBookSetting}
        options={{
          headerShown: false
        }}
      />
      <AddressStack.Screen
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
      <AddressStack.Screen
        name="AddressDetail"
        component={AddressDetail}
        options={{
          headerShown: false,
        }}
      />
    </AddressStack.Navigator>
  );
};

export default AddressStackScreen;
