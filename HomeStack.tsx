import React, {useContext} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import HomeScreen from './screens/Home';
import TokenDetail from './screens/TokenDetail';
import {ThemeContext} from './ThemeContext';
import TokenTxDetail from './screens/TokenTxDetail';
import CreateKRC20TxScreen from './screens/CreateKRC20Transaction';
import ImportWallet from './screens/ImportWallet';
import ImportMnemonic from './screens/ImportMnemonic';
import SelectWallet from './screens/SelectWallet';
import ImportPrivateKey from './screens/ImportPrivateKey';
import KRC20Tokens from './screens/KRC20Tokens';

const HomeStack = createStackNavigator();

const HomeStackScreen = () => {
  const {theme} = useContext(ThemeContext);
  return (
    <HomeStack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
          shadowColor: 'transparent',
          backgroundColor: theme.backgroundColor,
        },
        headerBackTitleVisible: false,
      }}>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="KRC20Tokens"
        component={KRC20Tokens}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="TokenDetail"
        component={TokenDetail}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="TokenTxDetail"
        component={TokenTxDetail}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="NewKRC20Tx"
        component={CreateKRC20TxScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="ImportWallet"
        component={ImportWallet}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="ImportMnemonic"
        component={ImportMnemonic}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="SelectWallet"
        component={SelectWallet}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="ImportPrivateKey"
        component={ImportPrivateKey}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;
