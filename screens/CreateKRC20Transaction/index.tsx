/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {styles} from './style';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import {useNavigation, useRoute} from '@react-navigation/native';
import {truncate} from '../../utils/string';
import {format, getDigit, isNumber} from '../../utils/number';
import {ThemeContext} from '../../App';
import {useRecoilValue} from 'recoil';
// import {selectedWalletAtom, walletsAtom} from '../../atoms/wallets';
import AlertModal from '../../components/AlertModal';
import {getSelectedWallet, getWallets} from '../../utils/local';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from '../../components/Modal';
import List from '../../components/List';
import {addressBookAtom} from '../../atoms/addressBook';
import TextAvatar from '../../components/TextAvatar';
import {getLanguageString, parseError} from '../../utils/lang';
import {languageAtom} from '../../atoms/language';
import {SafeAreaView} from 'react-native-safe-area-context';
// import {weiToKAI} from '../../services/transaction/amount';
import numeral from 'numeral';
import {
  estimateKRC20Gas,
  getBalance,
  transferKRC20,
} from '../../services/krc20';

// const MAX_AMOUNT = 5000000000;

const {height: viewportHeight} = Dimensions.get('window');

const CreateKRC20TxScreen = () => {
  const {params}: any = useRoute();
  const tokenAddress = params ? params.tokenAddress : '';
  const tokenSymbol = params ? params.tokenSymbol : '';
  const tokenDecimals = params ? params.tokenDecimals : 18;

  // const wallets = useRecoilValue(walletsAtom);
  // const selectedWallet = useRecoilValue(selectedWalletAtom);
  const addressBook = useRecoilValue(addressBookAtom);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('0');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showAddressBookModal, setShowAddressBookModal] = useState(false);
  const [gasPrice, setGasPrice] = useState(1);
  const [gasLimit, setGasLimit] = useState(-1);
  const [error, setError] = useState('');
  const [successTxHash, setSuccessHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorAddress, setErrorAddress] = useState('');
  const [errorAmount, setErrorAmount] = useState('');

  const {theme} = useContext(ThemeContext);
  const navigation = useNavigation();
  const language = useRecoilValue(languageAtom);

  useEffect(() => {
    (async () => {
      const _txAmount = Number(amount.replace(/,/g, ''));
      if (_txAmount <= 0) {
        return;
      }
      const estimatedGas = await estimateKRC20Gas(address, _txAmount);
      setGasLimit(estimatedGas);
    })();
  }, [amount, address]);

  async function send() {
    setShowConfirmModal(false);
    setLoading(true);
    const _wallets = await getWallets();
    const _selectedWallet = await getSelectedWallet();
    const wallet: Wallet = _wallets[_selectedWallet];
    const _txAmount = Number(amount.replace(/,/g, ''));
    try {
      const txResult = await transferKRC20(
        tokenAddress,
        wallet.privateKey || '',
        address,
        _txAmount,
      );
      setSuccessHash(txResult.transactionHash);
      setLoading(false);
    } catch (err) {
      console.error(err);
      if (err.message) {
        setError(parseError(err.message, language));
      } else {
        console.error(err);
        setError('Error happen');
      }
      setLoading(false);
    }
  }

  const showQRScanner = () => {
    setShowQRModal(true);
  };

  const showAddressBookSelector = () => {
    setShowAddressBookModal(true);
  };

  const showConfirm = async () => {
    let isValid = true;
    if (address === '') {
      setErrorAddress(getLanguageString(language, 'REQUIRED_FIELD'));
      isValid = false;
    }
    if (amount === '' || amount === '0') {
      setErrorAmount(getLanguageString(language, 'REQUIRED_FIELD'));
      isValid = false;
    }
    const _wallets = await getWallets();
    const _selectedWallet = await getSelectedWallet();
    const wallet: Wallet = _wallets[_selectedWallet];
    const _txAmount = Number(amount.replace(/,/g, ''));
    const currentBalance = await getBalance(tokenAddress, wallet.address);
    if (_txAmount * 10 ** tokenDecimals > currentBalance) {
      setErrorAmount(getLanguageString(language, 'NOT_ENOUGH_KAI_FOR_TX'));
      isValid = false;
    }
    if (!isValid) {
      return;
    }
    setShowConfirmModal(true);
  };

  if (showQRModal) {
    return (
      <>
        <View style={styles.qrScannerHeader}>
          <Text allowFontScaling={false} style={styles.centerText}>Scan address QR code</Text>
        </View>
        <QRCodeScanner
          onRead={(e) => {
            setAddress(e.data);
            setShowQRModal(false);
          }}
          showMarker={true}
        />
        <View style={styles.qrScannerFooter}>
          <Button
            size="large"
            title="Cancel"
            onPress={() => setShowQRModal(false)}
          />
        </View>
      </>
    );
  }

  if (showAddressBookModal) {
    return (
      <Modal full visible={true} onClose={() => setShowAddressBookModal(false)}>
        <Text>Select Address</Text>
        <List
          items={addressBook}
          keyExtractor={(item) => item.address}
          render={(_address: Address) => {
            return (
              <TouchableOpacity
                style={styles.addressContainer}
                onPress={() => {
                  setAddress(_address.address);
                  setShowAddressBookModal(false);
                }}>
                <View style={styles.addressAvatarContainer}>
                  {_address.avatar ? (
                    <Image source={{uri: _address.avatar}} />
                  ) : (
                    <TextAvatar text={_address.name} />
                  )}
                </View>
                <View>
                  <Text allowFontScaling={false} style={[styles.addressName, {color: '#000000'}]}>
                    {_address.name}
                  </Text>
                  <Text allowFontScaling={false} style={[styles.addressHash, {color: '#000000'}]}>
                    {truncate(_address.address, 20, 20)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text allowFontScaling={false} style={[styles.emptyAddressBook, {color: theme.textColor}]}>
              No saved address
            </Text>
          }
        />
      </Modal>
    );
  }

  if (showConfirmModal) {
    return (
      <Modal
        showCloseButton={false}
        visible={true}
        contentStyle={{flex: 0.3, marginTop: viewportHeight / 3}}
        onClose={() => setShowConfirmModal(false)}>
        <Text allowFontScaling={false} style={styles.confirmTitle}>
          {getLanguageString(language, 'CONFIRM_TRANSACTION')}
        </Text>
        <View>
          <View style={styles.confirmGroup}>
            <Text allowFontScaling={false} style={styles.confirmText}>
              {getLanguageString(language, 'CREATE_TX_ADDRESS')}:{' '}
            </Text>
            <Text allowFontScaling={false} style={styles.confirmContent}>
              {truncate(address, 10, 10)}
            </Text>
          </View>
          <View style={styles.confirmGroup}>
            <Text allowFontScaling={false} style={styles.confirmText}>
              {getLanguageString(language, 'CONFIRM_KAI_AMOUNT')}:{' '}
            </Text>
            <Text allowFontScaling={false} style={styles.confirmContent}>
              {amount} {tokenSymbol}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: '100%',
          }}>
          <Button
            title={getLanguageString(language, 'GO_BACK')}
            onPress={() => setShowConfirmModal(false)}
            type="ghost"
          />
          <Button
            title={getLanguageString(language, 'CONFIRM')}
            onPress={send}
            type="primary"
          />
        </View>
      </Modal>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <View style={{marginBottom: 10}}>
          <TextInput
            onChangeText={setAddress}
            message={errorAddress}
            value={truncate(address, 10, 20)}
            headline={getLanguageString(language, 'CREATE_KRC20_TX_ADDRESS')}
            icons={() => {
              return (
                <>
                  <Icon
                    onPress={showQRScanner}
                    name="qrcode"
                    size={25}
                    color={'black'}
                    style={[styles.textIcon, {right: 45}]}
                  />
                  <Icon
                    onPress={showAddressBookSelector}
                    name="address-book"
                    size={25}
                    color={'black'}
                    style={[styles.textIcon, {right: 15}]}
                  />
                </>
              );
            }}
          />
        </View>

        <View style={{marginBottom: 20}}>
          <TextInput
            keyboardType="numeric"
            message={errorAmount}
            onChangeText={(newAmount) => {
              const digitOnly = getDigit(newAmount);
              // if (Number(digitOnly) > MAX_AMOUNT) {
              //   return;
              // }
              if (digitOnly === '') {
                setAmount('0');
                return;
              }
              isNumber(digitOnly) && setAmount(digitOnly);
            }}
            onBlur={() => setAmount(format(Number(amount)))}
            value={amount}
            headline={getLanguageString(language, 'CREATE_TX_KRC20_AMOUNT')}
          />
        </View>

        <Text
          allowFontScaling={false}
          style={[styles.title, {color: theme.textColor, marginBottom: 12}]}>
          {getLanguageString(language, 'TRANSACTION_SPEED')}
        </Text>
        <View style={{marginBottom: 20}}>
          <ListCard gasPrice={gasPrice} selectGasPrice={setGasPrice} />
        </View>

        <View>
          <View style={styles.wrap}>
            <View>
              <Text allowFontScaling={false} style={[{color: theme.textColor}]}>
                {getLanguageString(language, 'GAS_PRICE')}
              </Text>
              <Text allowFontScaling={false} style={[{color: theme.textColor}]}>{gasPrice} Oxy</Text>
            </View>
            <View>
              <Text allowFontScaling={false} style={[{color: theme.textColor}]}>
                {getLanguageString(language, 'GAS_LIMIT')}
              </Text>
              <Text allowFontScaling={false} style={[{color: theme.textColor, textAlign: 'right'}]}>
                {gasLimit > 0 && numeral(gasLimit).format('0,0')}
              </Text>
            </View>
          </View>
        </View>

        <Text
          allowFontScaling={false}
          style={[
            {marginTop: 20, fontStyle: 'italic'},
            {color: theme.textColor},
          ]}>
          {getLanguageString(language, 'SPEED_DESCRIPTION')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            justifyContent: 'space-around',
          }}>
          <Button
            title={getLanguageString(language, 'SEND').toUpperCase()}
            onPress={showConfirm}
            iconName="paper-plane"
            type="primary"
            size="large"
            loading={loading}
            disabled={loading}
          />
          <Button
            title={getLanguageString(language, 'GO_BACK').toUpperCase()}
            onPress={navigation.goBack}
            type="outline"
            size="large"
          />
        </View>
        {error !== '' && (
          <AlertModal
            type="error"
            message={error}
            onClose={() => setError('')}
            visible={true}
          />
        )}
        {successTxHash !== '' && (
          <AlertModal
            type="success"
            // message={`Transaction completed. Hash: ${successTxHash}`}
            onClose={() => {
              setSuccessHash('');
              navigation.goBack();
            }}
            visible={true}>
            <Text>Transaction completed</Text>
            <Text>Tx Hash: {truncate(successTxHash, 10, 20)}</Text>
          </AlertModal>
        )}
        {}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const ListCard = ({
  gasPrice,
  selectGasPrice,
}: {
  gasPrice: number;
  selectGasPrice: (gasPrice: number) => void;
}) => {
  const {theme} = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);

  const data = [
    {
      title: getLanguageString(language, 'SLOW_SPEED'),
      time: `~5 ${getLanguageString(language, 'SECOND')}`,
      gasPrice: 1,
    },
    {
      title: getLanguageString(language, 'AVERAGE_SPEED'),
      time: `~3 ${getLanguageString(language, 'SECOND')}`,
      gasPrice: 2,
    },
    {
      title: getLanguageString(language, 'FAST_SPEED'),
      time: `~1 ${getLanguageString(language, 'SECOND')}`,
      gasPrice: 3,
    },
  ];

  return (
    <View style={styles.listCard}>
      {data.map((item, index) => {
        const active = item.gasPrice === gasPrice;
        return (
          <TouchableOpacity
            key={`tx-speed-${index}`}
            onPress={() => selectGasPrice(item.gasPrice)}
            style={{
              backgroundColor: active ? theme.primaryColor : 'white',
              padding: 20,
              borderRadius: 8,
              width: '30%',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                textAlign: 'center',
                color: active ? theme.primaryTextColor : theme.ghostTextColor,
              }}>
              {item.title}
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                textAlign: 'center',
                color: active ? theme.primaryTextColor : theme.ghostTextColor,
              }}>
              {item.time}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default CreateKRC20TxScreen;
