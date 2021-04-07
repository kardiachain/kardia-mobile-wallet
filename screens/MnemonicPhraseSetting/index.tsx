/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { ThemeContext } from '../../ThemeContext';
import List from '../../components/List';
import ENIcon from 'react-native-vector-icons/Entypo';
import Button from '../../components/Button';
import { getMnemonic } from '../../utils/local';
import { styles } from './style';
import { copyToClipboard } from '../../utils/string';
import { getLanguageString } from '../../utils/lang';
import { useRecoilValue } from 'recoil';
import { languageAtom } from '../../atoms/language';
import { selectedWalletAtom, walletsAtom } from '../../atoms/wallets';
import { useNavigation } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthModal from '../common/AuthModal';

const MnemonicPhraseSetting = () => {
  const navigation = useNavigation();
  const {theme} = useContext(ThemeContext);
  const [mnemonic, setMnemonic] = useState('');
  const language = useRecoilValue(languageAtom);
  const wallets = useRecoilValue(walletsAtom);
  const selectedWallet = useRecoilValue(selectedWalletAtom);

  const privateKey = wallets[selectedWallet].privateKey || '';

  useEffect(() => {
    (async () => {
      if (!wallets[selectedWallet] || !wallets[selectedWallet].address) {
        return;
      }
      const mn = await getMnemonic(wallets[selectedWallet].address);
      if (mn !== 'FROM_PK') {
        setMnemonic(mn);
      }
    })();
  }, [selectedWallet, wallets]);

  let mnemonicArr: { label: string; value: string }[] = [];

  if (mnemonic) {
    mnemonicArr = mnemonic.split(' ').map((item) => ({
      label: item,
      value: item,
    }));
  } else {
    mnemonicArr = [
      {
        label: privateKey,
        value: privateKey,
      },
    ];
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View
        style={{
          width: '100%',
          marginBottom: 19,
        }}>
        <ENIcon.Button
          name="chevron-left"
          onPress={() => navigation.goBack()}
          backgroundColor="transparent"
          style={{ padding: 0, marginBottom: 18 }}
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontSize: 24, textAlign: 'center', fontWeight: 'bold', color: theme.textColor }} allowFontScaling={false}>Wallet credentials</Text>
          <Text style={{ color: theme.mutedTextColor, marginTop: 4, textAlign: 'center' }} allowFontScaling={false}>Keep it safe & sound</Text>
          <List
            items={mnemonicArr}
            numColumns={4}
            containerStyle={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingVertical: 20,
            }}
            listStyle={{
              maxHeight: 390,
            }}
            render={(item, index) => {
              return (
                <View
                  key={index}
                  style={[
                    styles.phraseItemContainer,
                    { backgroundColor: theme.backgroundFocusColor },
                  ]}>
                  <Text
                    allowFontScaling={false}
                    style={[styles.phraseItemText, { color: theme.textColor }]}>
                    {item.label}
                  </Text>
                </View>
              );
            }}
          />
        </View>
        <Button
          title={getLanguageString(language, 'COPY_TO_CLIPBOARD')}
          type="primary"
          block
          onPress={() => copyToClipboard(mnemonic ? mnemonic : privateKey)}
        />
      </View>
    </SafeAreaView>
  );
};

export default MnemonicPhraseSetting;
