/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import Modal from '../../../components/Modal';
import {
  Image,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import TextInput from '../../../components/TextInput';
import {styles} from './style';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {languageAtom} from '../../../atoms/language';
import {getLanguageString} from '../../../utils/lang';
import ScanQRAddressModal from '../ScanQRAddressModal';
import {getKRC20TokenInfo} from '../../../services/krc20';
import {getTokenList, saveTokenList} from '../../../utils/local';
import {krc20ListAtom} from '../../../atoms/krc20';
import Button from '../../../components/Button';
import {DEFAULT_KRC20_TOKENS} from '../../../config';
import {parseDecimals} from '../../../utils/number';
import numeral from 'numeral';
import {ThemeContext} from '../../../ThemeContext';

const NewTokenModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const {theme} = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);
  const [tokenAddress, setTokenAddress] = useState('');
  const [errorAddress, setErrorAddress] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [decimals, setDecimals] = useState(-1);
  const [totalSupply, setTotalSupply] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  const [keyboardShown, setKeyboardShown] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const setKRC20List = useSetRecoilState(krc20ListAtom);

  useEffect(() => {
    (async () => {
      if (tokenAddress.length !== 42 && tokenAddress.length !== 40) {
        return;
      }
      setLoading(true);
      const _tokenAddress =
        tokenAddress.length === 42 ? tokenAddress : `0x${tokenAddress}`;
      const info = await getKRC20TokenInfo(_tokenAddress);
      setName(info.name);
      setSymbol(info.symbol);
      setDecimals(info.decimals);
      setTotalSupply(info.totalSupply);
      setAvatar(info.avatar);
      setLoading(false);
    })();
  }, [tokenAddress]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillShow', _keyboardDidShow);
      Keyboard.addListener('keyboardWillHide', _keyboardDidHide);
    } else {
      Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    }

    // cleanup function
    return () => {
      if (Platform.OS === 'ios') {
        Keyboard.removeListener('keyboardWillShow', _keyboardDidShow);
        Keyboard.removeListener('keyboardWillHide', _keyboardDidHide);
      } else {
        Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
      }
    };
  }, []);

  const clearState = () => {
    setTokenAddress('');
    setErrorAddress('');
    setName('');
    setSymbol('');
    setDecimals(-1);
    setTotalSupply('');
  };

  const showTokenData = () => {
    const rs =
      name !== '' && symbol !== '' && totalSupply !== '' && decimals >= 0;
    return rs;
  };

  const handleImport = async () => {
    if (tokenAddress.length !== 42 && tokenAddress.length !== 40) {
      setErrorAddress(getLanguageString(language, 'INVALID_ADDRESS'));
      return;
    }
    if (name === '' || symbol === '' || totalSupply === '') {
      setErrorAddress(getLanguageString(language, 'ERROR_FETCH_KRC20_DATA'));
      return;
    }
    const _tokenAddress =
      tokenAddress.length === 42 ? tokenAddress : `0x${tokenAddress}`;

    let localTokens = await getTokenList();
    const existed = localTokens.some((i) => i.address === _tokenAddress);
    if (existed) {
      setErrorAddress(getLanguageString(language, 'TOKEN_EXISTS'));
      return;
    }

    const newTokenList: KRC20[] = JSON.parse(JSON.stringify(localTokens));

    newTokenList.push({
      address: _tokenAddress,
      name,
      symbol,
      decimals,
      avatar,
      id: `${Date.now()}`,
    });

    const DEFAULT_ID = DEFAULT_KRC20_TOKENS.map((i) => i.id);

    await saveTokenList(newTokenList.filter((i) => !DEFAULT_ID.includes(i.id)));
    setKRC20List(newTokenList);
    clearState();
    onClose();
  };

  if (showQRModal) {
    return (
      <ScanQRAddressModal
        visible={showQRModal}
        onClose={() => setShowQRModal(false)}
        onScanned={(_address) => {
          setTokenAddress(_address);
          setShowQRModal(false);
        }}
      />
    );
  }

  const _keyboardDidShow = (e: any) => {
    setKeyboardOffset(e.endCoordinates.height);
    setKeyboardShown(true);
  };

  const _keyboardDidHide = () => {
    setKeyboardOffset(0);
    setKeyboardShown(false);
  };

  const getModalStyle = () => {
    if (Platform.OS === 'android') {
      return {
        height: !showTokenData() ? 300 : 400,
        backgroundColor: theme.backgroundFocusColor,
      };
    } else {
      return {
        height: !showTokenData() ? 300 : 400,
        marginBottom: keyboardOffset,
        marginTop: -keyboardOffset,
        backgroundColor: theme.backgroundFocusColor,
      };
    }
  };

  return (
    <Modal
      visible={visible}
      showCloseButton={false}
      onClose={() => {
        clearState();
        onClose();
      }}
      contentStyle={getModalStyle() as any}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={[styles.container]}>
          <View style={{marginBottom: 0}}>
            <View>
              <Text allowFontScaling={false} style={[styles.headline, {color: theme.textColor}]}>
                {getLanguageString(language, 'TOKEN_ADDRESS')}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}>
              <View style={{flex: 3}}>
                <TextInput
                  onChangeText={setTokenAddress}
                  message={errorAddress}
                  value={tokenAddress}
                  inputStyle={{
                    backgroundColor: 'rgba(96, 99, 108, 1)',
                    color: theme.textColor,
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => setShowQRModal(true)}
                style={{
                  // flex: 1,
                  padding: 15,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  height: 44,
                  width: 44,
                  borderWidth: 1.5,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 8,
                }}>
                <Image
                  source={require('../../../assets/icon/scan_qr_dark.png')}
                  style={{width: 18, height: 18}}
                />
              </TouchableOpacity>
            </View>
          </View>
          {showTokenData() && (
            <View style={{marginBottom: 10}}>
              <Text allowFontScaling={false} style={{color: theme.textColor}}>
                Token name: <Text allowFontScaling={false} style={{fontWeight: 'bold'}}>{name}</Text>
              </Text>
            </View>
          )}
          {showTokenData() && (
            <View style={{marginBottom: 10}}>
              <Text allowFontScaling={false} style={{color: theme.textColor}}>
                Token symbol: <Text allowFontScaling={false} style={{fontWeight: 'bold'}}>{symbol}</Text>
              </Text>
            </View>
          )}
          {showTokenData() && (
            <View style={{marginBottom: 10}}>
              <Text allowFontScaling={false} style={{color: theme.textColor}}>
                Token decimals:{' '}
                <Text allowFontScaling={false} style={{fontWeight: 'bold'}}>{decimals}</Text>
              </Text>
            </View>
          )}
          {showTokenData() && (
            <View style={{marginBottom: 10}}>
              <Text allowFontScaling={false} style={{color: theme.textColor}}>
                Token supply:{' '}
                <Text allowFontScaling={false} style={{fontWeight: 'bold', color: theme.textColor}}>
                  {numeral(parseDecimals(Number(totalSupply), decimals)).format(
                    '0,0.00',
                  )}
                </Text>
              </Text>
            </View>
          )}
          <View>
            <Button
              title={getLanguageString(language, 'CANCEL')}
              style={{marginBottom: 8, marginTop: showTokenData() ? 12 : 36}}
              textStyle={{fontWeight: 'bold'}}
              type="outline"
              onPress={onClose}
              disabled={loading}
            />
            <Button
              title={getLanguageString(language, 'ADD_TOKEN')}
              textStyle={{fontWeight: 'bold'}}
              onPress={handleImport}
              loading={loading}
              disabled={loading}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default NewTokenModal;
