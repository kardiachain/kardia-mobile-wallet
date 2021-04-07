import { useNavigation } from '@react-navigation/core';
import React, { useContext, useEffect, useState } from 'react';
import { Keyboard, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useRecoilValue } from 'recoil';
import { languageAtom } from '../../../atoms/language';
import Button from '../../../components/Button';
import Divider from '../../../components/Divider';
import Modal from '../../../components/Modal';
import CustomTextInput from '../../../components/TextInput';
import numeral from 'numeral';
import { MIN_DELEGATE } from '../../../config';
import { undelegateAll, undelegateWithAmount } from '../../../services/staking';
import { weiToKAI } from '../../../services/transaction/amount';
import { ThemeContext } from '../../../ThemeContext';
import { getLanguageString } from '../../../utils/lang';
import { getSelectedWallet, getWallets } from '../../../utils/local';
import { format, getDigit, isNumber } from '../../../utils/number';

export default ({visible, onClose, validatorItem, onSuccess}: {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  validatorItem: any;
}) => {
  const navigation = useNavigation();
  const stakedAmountInKAI = weiToKAI(validatorItem.stakedAmount);

  const {theme} = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);
  const [undelegateAmount, setUndelegateAmount] = useState('');
  const [undelegateError, setUndelegateError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [keyboardShown, setKeyboardShown] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

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

  const _keyboardDidShow = (e: any) => {
    setKeyboardOffset(e.endCoordinates.height);
    setKeyboardShown(true);
  };

  const _keyboardDidHide = () => {
    setKeyboardOffset(0);
    setKeyboardShown(false);
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }
    onClose();
  }

  const handleUndelegate = async () => {
    try {
      setSubmitting(true);
      const _undelegateValue = Number(getDigit(undelegateAmount));
      if (Number(stakedAmountInKAI) < _undelegateValue) {
        setUndelegateError(
          getLanguageString(language, 'UNDELEGATE_AMOUNT_TOO_MUCH'),
        );
        setSubmitting(false);
        return;
      }
      if (
        Number(stakedAmountInKAI) - _undelegateValue < MIN_DELEGATE &&
        Number(stakedAmountInKAI) - _undelegateValue > 0
      ) {
        setUndelegateError(
          getLanguageString(language, 'UNDELEGATE_AMOUNT_REMAIN_1000'),
        );
        setSubmitting(false);
        return;
      }

      const localWallets = await getWallets();
      const localSelectedWallet = await getSelectedWallet();
      const _wallet = localWallets[localSelectedWallet];

      let rs

      if (Number(stakedAmountInKAI) - _undelegateValue > MIN_DELEGATE) {
        rs = await undelegateWithAmount(validatorItem.value, _undelegateValue, _wallet);
      } else {
        rs = await undelegateAll(validatorItem.value, _wallet);
      }
      setSubmitting(false);
      setUndelegateAmount('');
      navigation.navigate('Transaction', {
        screen: 'SuccessTx',
        params: {
          type: 'undelegate',
          txHash: rs.transactionHash,
          validatorItem: validatorItem,
          undelegateAmount: _undelegateValue,
        },
      });
      onSuccess();
    } catch (err) {
      setSubmitting(false);
      console.error(err);
      setUndelegateError(getLanguageString(language, 'GENERAL_ERROR'));
    }
  }

  const getModalStyle = () => {
    if (Platform.OS === 'android') {
      return {
        height: 280,
        backgroundColor: theme.backgroundFocusColor,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 0,
      };
    } else {
      return {
        height: 280,
        justifyContent: 'flex-start',
        backgroundColor: theme.backgroundFocusColor,
        alignItems: 'center',
        marginBottom: keyboardOffset,
        marginTop: -keyboardOffset,
        padding: 0,
      };
    }
  };

  return (
    <Modal showCloseButton={false} visible={visible} onClose={handleClose} contentStyle={getModalStyle()}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1, width: '100%', padding: 35}}>
          <View style={{width: '100%'}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
              <Text style={{fontSize: theme.defaultFontSize, color: theme.textColor}} allowFontScaling={false}>
                {getLanguageString(
                  language,
                  'UNDELEGATE_AMOUNT_PLACEHOLDER',
                )}
              </Text>
              <TouchableOpacity onPress={() => setUndelegateAmount(format(Number(stakedAmountInKAI)))}>
                <Text style={{fontSize: theme.defaultFontSize, color: theme.urlColor}} allowFontScaling={false}>{numeral(stakedAmountInKAI).format('0,0.00')} KAI</Text>
              </TouchableOpacity>
            </View>
            <CustomTextInput
              keyboardType="numeric"
              message={undelegateError}
              onChangeText={(newAmount) => {
                const digitOnly = getDigit(newAmount);
                if (Number(digitOnly) > Number(stakedAmountInKAI)) {
                  return;
                }
                if (digitOnly === '') {
                  setUndelegateAmount('0');
                  return;
                }
                isNumber(digitOnly) && setUndelegateAmount(digitOnly);
              }}
              onBlur={() => {
                setUndelegateAmount(format(Number(undelegateAmount)));
              }}
              value={undelegateAmount}
              // headline={getLanguageString(
              //   language,
              //   'UNDELEGATE_AMOUNT_PLACEHOLDER',
              // )}
            />
          </View>
          <Divider style={{width: '100%'}} />
          <Button
            disabled={submitting}
            title={getLanguageString(language, 'CANCEL')}
            onPress={handleClose}
            type="outline"
            style={{width: '100%', marginTop: 14}}
          />
          <Button
            loading={submitting}
            disabled={submitting}
            title={getLanguageString(language, 'UNDELEGATE')}
            onPress={handleUndelegate}
            style={{marginTop: 8}}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};