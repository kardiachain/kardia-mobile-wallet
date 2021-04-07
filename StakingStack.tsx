import React, {useContext} from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import NewStaking from './screens/NewStaking';
import StakingScreen from './screens/Staking';
import ValidatorList from './screens/ValidatorList';
import {getLanguageString} from './utils/lang';
import {useRecoilValue} from 'recoil';
import {languageAtom} from './atoms/language';
import {ThemeContext} from './ThemeContext';

const StakingStack = createStackNavigator();

const StakingStackScreen = () => {
  const {theme} = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);
  return (
    <StakingStack.Navigator
      initialRouteName="StakingList"
      screenOptions={{
        // headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
          shadowColor: 'transparent',
          backgroundColor: theme.backgroundColor,
        },
        headerBackTitleVisible: false,
      }}>
      <StakingStack.Screen
        name="StakingList"
        component={StakingScreen}
        options={{headerShown: false}}
      />
      <StakingStack.Screen
        name="ValidatorList"
        component={ValidatorList}
        options={{headerShown: false}}
        // options={{
        //   title: getLanguageString(language, 'VALIDATOR_LIST_TITLE'),
        //   headerTitleStyle: {
        //     color: theme.textColor,
        //   },
        //   headerTintColor: theme.textColor,
        // }}
      />
      <StakingStack.Screen
        name="NewStaking"
        component={NewStaking}
        options={{
          title: getLanguageString(language, 'NEW_STAKING_TITLE'),
          headerTitleStyle: {
            color: theme.textColor,
          },
          headerTintColor: theme.textColor,
        }}
      />
    </StakingStack.Navigator>
  );
};

export default StakingStackScreen;
