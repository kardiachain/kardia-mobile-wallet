/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Image, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {styles} from './style';
import Button from '../../components/Button';
import {generateMnemonic, getWalletFromMnemonic} from '../../utils/blockchain';
import AlertModal from '../../components/AlertModal';
import {useRecoilState, useRecoilValue} from 'recoil';
import {walletsAtom} from '../../atoms/wallets';
import {saveMnemonic, saveWallets} from '../../utils/local';
import {ThemeContext} from '../../ThemeContext';
import List from '../../components/List';
import {getLanguageString} from '../../utils/lang';
import {languageAtom} from '../../atoms/language';
import {useNavigation} from '@react-navigation/core';

const CreateWithMnemonicPhrase = () => {
  const navigation = useNavigation();
  const {theme} = useContext(ThemeContext);
  const [mnemonic, setMnemonic] = useState('');
  const [mnemonicError, setMnemonicError] = useState('');
  const [wallets, setWallets] = useRecoilState(walletsAtom);
  const [loading, setLoading] = useState(false);
  // const [showConfirm, setShowConfirm] = useState(false);

  const language = useRecoilValue(languageAtom);

  useEffect(() => {
    const mn = generateMnemonic();
    setMnemonic(mn);
  }, []);

  const handleAccess = async () => {
    setLoading(true);
    // const interactionPromise = InteractionManager.runAfterInteractions(
    //   async () => {
    //     const newWallet = await getWalletFromMnemonic(mnemonic.trim());
    //     if (!newWallet) {
    //       setMnemonicError('Error happen!');
    //       return;
    //     }
    //     await saveMnemonic(newWallet.address, mnemonic.trim());
    //     const _wallets: Wallet[] = JSON.parse(JSON.stringify(wallets));
    //     _wallets.push(newWallet as Wallet);
    //     await saveWallets(_wallets);
    //     setLoading(false);
    //     setWallets(_wallets);
    //   },
    // );
    // return () => interactionPromise.cancel();
    setTimeout(async () => {
      const newWallet = await getWalletFromMnemonic(mnemonic.trim());
      if (!newWallet) {
        setMnemonicError('Error happen!');
        return;
      }
      await saveMnemonic(newWallet.address, mnemonic.trim());
      const _wallets: Wallet[] = JSON.parse(JSON.stringify(wallets));
      _wallets.push(newWallet as Wallet);
      await saveWallets(_wallets);
      setLoading(false);
      setWallets(_wallets);
    }, 1);
  };

  const mnemonicArr = mnemonic.split(' ').map((item) => ({
    label: item,
    value: item,
  }));

  const renderWarning = () => {
    switch (language) {
      case 'en_US':
        return (
          <Text
            allowFontScaling={false}
            style={[
              styles.description,
              styles.paragraph,
              {color: theme.textColor},
            ]}>
            Please make sure you
            <Text allowFontScaling={false} style={{fontWeight: 'bold'}}> WRITE DOWN</Text> and{' '}
            <Text allowFontScaling={false} style={{fontWeight: 'bold'}}>SAVE</Text> your mnemonic phrase.
            You will need it to access or recover your wallet.
          </Text>
        );
      case 'vi_VI':
        return (
          <Text
            allowFontScaling={false}
            style={[
              styles.description,
              styles.paragraph,
              {color: theme.textColor},
            ]}>
            Hãy đảm bảo bạn đã
            <Text allowFontScaling={false} style={{fontWeight: 'bold'}}> GHI LẠI</Text> 24 từ này. 24 từ
            này không thể thay đổi và sẽ được sử dụng để truy cập và khôi phục
            ví.
          </Text>
        );
      default:
        return (
          <Text
            allowFontScaling={false}
            style={[
              styles.description,
              styles.paragraph,
              {color: theme.textColor},
            ]}>
            Please make sure you
            <Text allowFontScaling={false} style={{fontWeight: 'bold'}}> WRITE DOWN</Text> and{' '}
            <Text allowFontScaling={false} style={{fontWeight: 'bold'}}>SAVE</Text> your mnemonic phrase.
            You will need it to access or recover your wallet.
          </Text>
        );
    }
  };

  if (!mnemonic) {
    return (
      <View
        style={[styles.container, {backgroundColor: theme.backgroundColor, alignItems: 'center', justifyContent: 'center'}]}>
        <ActivityIndicator color={theme.textColor} size={40} />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'flex-start',
          paddingTop: 30,
        }}>
        <Icon.Button
          style={{paddingLeft: 20}}
          name="chevron-left"
          onPress={() => navigation.goBack()}
          backgroundColor="transparent"
        />
      </View>
      <Image
        source={require('../../assets/create_mnemonic_background.png')}
        style={{width: 170, height: 180, resizeMode: 'contain'}}
      />
      <List
        items={mnemonicArr}
        numColumns={4}
        containerStyle={{
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        listStyle={{
          maxHeight: 280,
        }}
        render={(item, index) => {
          return (
            <View
              key={index}
              style={[
                styles.phraseItemContainer,
                {backgroundColor: theme.backgroundFocusColor},
              ]}>
              <Text allowFontScaling={false} style={[styles.phraseItemText, {color: theme.textColor}]}>
                {item.label}
              </Text>
            </View>
          );
        }}
      />
      <Text
        allowFontScaling={false}
        style={[
          styles.description,
          styles.paragraph,
          {color: theme.textColor},
        ]}>
        {getLanguageString(language, 'MNEMONIC_DESCRIPTION')}
      </Text>
      {renderWarning()}
      <Button
        type="primary"
        disabled={loading}
        loading={loading}
        title={getLanguageString(language, 'SUBMIT_CREATE')}
        // onPress={() => setShowConfirm(true)}
        onPress={handleAccess}
        style={{
          // width: '100%',
          marginHorizontal: 20,
          marginBottom: 82,
        }}
      />
      <AlertModal
        type="error"
        visible={mnemonicError !== ''}
        onClose={() => setMnemonicError('')}
        message={mnemonicError}
      />
      {/* <AlertModal
        type="confirm"
        okText={getLanguageString(language, 'SURE')}
        cancelText={getLanguageString(language, 'NOT_SURE')}
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        onOK={handleAccess}
        okLoading={loading}
        okDisabled={loading}
        cancelDisabled={loading}
        messageStyle={{textAlign: 'center'}}
        message={getLanguageString(language, 'CONFIRM_ENTER_SEED_PHRASE')}
      /> */}
    </View>
  );
};

export default CreateWithMnemonicPhrase;
