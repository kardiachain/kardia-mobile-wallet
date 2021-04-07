import React, { useContext } from 'react';
import {useRecoilValue} from 'recoil';
import {statusBarColorAtom} from './atoms/statusBar';
import CustomStatusBar from './components/StatusBar';
import { ThemeContext } from './ThemeContext';

const GlobalStatusBar = () => {
  const statusBarColor = useRecoilValue(statusBarColorAtom);
  const {theme} = useContext(ThemeContext)

  return (
    <CustomStatusBar
      barStyle={theme.name === 'dark' ? "light-content" : "dark-content"}
      backgroundColor={theme.backgroundColor}
    />
  );
};

export default GlobalStatusBar;
