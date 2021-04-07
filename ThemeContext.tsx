import React from 'react';
import themes from './theme/index';

const DEFAULT_THEME: KardiaTheme = themes.dark;
export const ThemeContext = React.createContext({theme: DEFAULT_THEME, setTheme: (newTheme: string) => {}});
