import AsyncStorage from '@react-native-async-storage/async-storage';
import {DEFAULT_KRC20_TOKENS} from '../config';

export const getWallets = async () => {
  try {
    const value = await AsyncStorage.getItem('@kardia_wallets');
    if (value !== null) {
      // value previously stored
      const wallets = JSON.parse(value);
      if (!Array.isArray(wallets)) {
        console.log('Invalid local data');
        return [];
      }
      return wallets;
    }
    return [];
  } catch (e) {
    console.error(e);
    return [];
    // error reading value
  }
};

export const saveWallets = async (wallets: Wallet[]) => {
  try {
    await AsyncStorage.setItem('@kardia_wallets', JSON.stringify(wallets));
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const saveSelectedWallet = async (selectedWallet: number) => {
  try {
    await AsyncStorage.setItem('@kardia_selected_wallet', `${selectedWallet}`);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getSelectedWallet = async () => {
  try {
    const value = await AsyncStorage.getItem('@kardia_selected_wallet');
    if (value !== null) {
      // value previously stored
      return Number(value);
    }
    return 0;
  } catch (e) {
    console.error(e);
    return 0;
    // error reading value
  }
};

export const clearLocalData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const clearLocalWallets = async () => {
  try {
    await clearLocalData('@kardia_wallets');
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const saveAddressBook = async (addressBook: Address[]) => {
  try {
    await AsyncStorage.setItem(
      '@kardia_address_book',
      JSON.stringify(addressBook),
    );
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getAddressBook = async () => {
  try {
    const value = await AsyncStorage.getItem('@kardia_address_book');
    if (value !== null) {
      // value previously stored
      const addressBook = JSON.parse(value);
      if (!Array.isArray(addressBook)) {
        console.log('Invalid local data');
        return [];
      }
      return addressBook;
    }
    return [];
  } catch (e) {
    console.error(e);
    return [];
    // error reading value
  }
};

export const saveLanguageSetting = async (lang: string) => {
  try {
    await AsyncStorage.setItem('@kardia_language_setting', lang);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getLanguageSetting = async () => {
  try {
    const value = await AsyncStorage.getItem('@kardia_language_setting');
    if (value !== null) {
      return value;
    }
    return '';
  } catch (e) {
    console.error(e);
    return '';
    // error reading value
  }
};

export const saveMnemonic = async (address: string, mnemonic: string) => {
  try {
    await AsyncStorage.setItem(`@kardia_mnemonic_${address}`, mnemonic);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getMnemonic = async (address: string) => {
  try {
    const value = await AsyncStorage.getItem(`@kardia_mnemonic_${address}`);
    if (value !== null) {
      return value;
    }
    return '';
  } catch (e) {
    console.error(e);
    return '';
    // error reading value
  }
};

export const saveAppPasscode = async (passcode: string) => {
  try {
    await AsyncStorage.setItem('@kardia_app_passcode', passcode);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getAppPasscode = async () => {
  try {
    const value = await AsyncStorage.getItem('@kardia_app_passcode');
    if (value !== null) {
      return value;
    }
    return '';
  } catch (e) {
    console.error(e);
    return '';
    // error reading value
  }
};

export const getAppPasscodeSetting = async () => {
  try {
    const value = await AsyncStorage.getItem('@kardia_app_passcode_setting');
    if (value !== null) {
      if (value === 'disabled') {
        return false;
      }
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
    // error reading value
  }
};

export const saveAppPasscodeSetting = async (on: boolean) => {
  try {
    await AsyncStorage.setItem(
      '@kardia_app_passcode_setting',
      on ? 'enabled' : 'disabled',
    );
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getTokenList = async () => {
  try {
    const value = await AsyncStorage.getItem('@kardia_app_token_list');
    if (value !== null) {
      // value previously stored
      const tokenList = JSON.parse(value);
      if (!Array.isArray(tokenList)) {
        console.log('Invalid local data');
        return DEFAULT_KRC20_TOKENS;
      }
      return DEFAULT_KRC20_TOKENS.concat(tokenList);
    }
    return DEFAULT_KRC20_TOKENS;
  } catch (e) {
    console.error(e);
    return DEFAULT_KRC20_TOKENS;
  }
};

export const saveTokenList = async (tokenList: KRC20[]) => {
  try {
    await AsyncStorage.setItem(
      '@kardia_app_token_list',
      JSON.stringify(tokenList),
    );
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getWalkThroughView = async () => {
  try {
    const value = await AsyncStorage.getItem('@kardia_walk_through_view');
    if (value !== null) {
      if (value === 'disabled') {
        return false;
      }
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
    // error reading value
  }
};

export const saveWalkThroughView = async (on: boolean) => {
  try {
    await AsyncStorage.setItem(
      '@kardia_walk_through_view',
      on ? 'enabled' : 'disabled',
    );
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getThemePreference = async () => {
  try {
    const value = await AsyncStorage.getItem(`@kardia_theme`);
    if (value !== null) {
      return value;
    }
    return 'dark';
  } catch (e) {
    console.error(e);
    return '';
    // error reading value
  }
}

export const saveThemePreference = async (theme: string) => {
  try {
    await AsyncStorage.setItem(
      '@kardia_theme',
      theme,
    );
  } catch (e) {
    console.error(e);
    return false;
  }
}
