/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {Keyboard, Text, TouchableWithoutFeedback, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import numeral from 'numeral';
import {selectedWalletAtom, walletsAtom} from '../../atoms/wallets';
import Button from '../../components/Button';
import Picker from '../../components/Picker';
import CustomTextInput from '../../components/TextInput';
import {delegateAction, getAllValidator} from '../../services/staking';
import {ThemeContext} from '../../ThemeContext';
import {getDigit, isNumber, format} from '../../utils/number';
import {styles} from './style';
import {weiToKAI} from '../../services/transaction/amount';
import {getLatestBlock} from '../../services/blockchain';
import {BLOCK_TIME, MIN_DELEGATE} from '../../config';
import AlertModal from '../../components/AlertModal';
import {useNavigation} from '@react-navigation/native';
import {getLanguageString} from '../../utils/lang';
import {languageAtom} from '../../atoms/language';

const parseValidatorItemForList = (item: Validator) => {
  return {
    value: item.smcAddress,
    label: item.name,
  };
};

const NewStaking = () => {
  const theme = useContext(ThemeContext);
  const selectedWallet = useRecoilValue(selectedWalletAtom);
  const wallets = useRecoilValue(walletsAtom);
  const language = useRecoilValue(languageAtom);

  const [validatorList, setValidatorList] = useState<Validator[]>([]);
  const [totalStakedAmount, setTotalStakedAmount] = useState('');
  const [selectedValidatorAddress, setSelectedValidatorAddress] = useState('');
  const [amount, setAmount] = useState('0');
  const [amountError, setAmountError] = useState('');
  const [estimatedProfit, setEstimatedProfit] = useState('');
  const [estimatedAPR, setEstimatedAPR] = useState('');
  const [delegating, setDelegating] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const {totalStaked, validators} = await getAllValidator();
      setTotalStakedAmount(totalStaked);
      setValidatorList(validators);
    })();
  }, []);

  const calculateStakingAPR = async () => {
    const selectedValidator = validatorList.find(
      (e) => e.smcAddress === selectedValidatorAddress,
    );
    if (!selectedValidator) {
      return;
    }
    const newTotalStaked =
      Number(weiToKAI(totalStakedAmount)) + Number(getDigit(amount));
    const validatorNewTotalStaked =
      Number(weiToKAI(selectedValidator.stakedAmount)) +
      Number(getDigit(amount));

    const commission = Number(selectedValidator.commissionRate) / 100;
    const votingPower = validatorNewTotalStaked / newTotalStaked;

    const block = await getLatestBlock();
    const blockReward = Number(weiToKAI(block.rewards));
    const delegatorsReward = blockReward * (1 - commission) * votingPower;

    const yourReward =
      (Number(getDigit(amount)) / validatorNewTotalStaked) * delegatorsReward;

    setEstimatedProfit(`${(yourReward * (30 * 24 * 3600)) / BLOCK_TIME}`);
    setEstimatedAPR(
      `${
        ((yourReward * (365 * 24 * 3600)) /
          BLOCK_TIME /
          Number(getDigit(amount))) *
        100
      }`,
    );
  };

  useEffect(() => {
    if (selectedValidatorAddress && amount) {
      calculateStakingAPR();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValidatorAddress, amount]);

  const getSelectedCommission = () => {
    const selectedValidator = validatorList.find(
      (e) => e.smcAddress === selectedValidatorAddress,
    );
    const formatted = selectedValidator
      ? numeral(selectedValidator.commissionRate).format('0,0.00')
      : '';
    return formatted === 'NaN' ? '0 %' : `${formatted} %`;
  };

  const getSelectedStakedAmount = () => {
    const selectedValidator = validatorList.find(
      (e) => e.smcAddress === selectedValidatorAddress,
    );
    const formatted = selectedValidator
      ? numeral(weiToKAI(selectedValidator.stakedAmount)).format('0,0.00')
      : '';
    return formatted === 'NaN' ? '0 KAI' : `${formatted} KAI`;
  };

  const getSelectedVotingPower = () => {
    const selectedValidator = validatorList.find(
      (e) => e.smcAddress === selectedValidatorAddress,
    );
    const formatted = selectedValidator
      ? numeral(selectedValidator.votingPowerPercentage).format('0,0.00')
      : '';
    return formatted === 'NaN' ? '0 %' : `${formatted} %`;
  };

  const delegateHandler = async () => {
    setAmountError('');
    try {
      if (Number(getDigit(amount)) < MIN_DELEGATE) {
        setAmountError(
          getLanguageString(language, 'AT_LEAST_MIN_DELEGATE').replace(
            '{{MIN_KAI}}',
            MIN_DELEGATE.toString(),
          ),
        );
        return;
      }

      if (
        Number(getDigit(amount)) >
        Number(weiToKAI(wallets[selectedWallet].balance))
      ) {
        setAmountError(
          getLanguageString(language, 'STAKING_AMOUNT_NOT_ENOUGHT'),
        );
        return;
      }
      setDelegating(true);
      await delegateAction(
        selectedValidatorAddress,
        wallets[selectedWallet],
        Number(getDigit(amount)),
      );
      setDelegating(false);
      setMessage('Delegation success');
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setDelegating(false);
      setMessage('Delegation fail');
      setMessageType('error');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        {message !== '' && (
          <AlertModal
            type={messageType as any}
            message={message}
            onClose={() => {
              setMessage('');
              if (messageType === 'success') {
                navigation.goBack();
              }
            }}
            visible={true}
          />
        )}
        <View style={{marginBottom: 10}}>
          <Picker
            headline={getLanguageString(language, 'CHOOSE_VALIDATOR')}
            items={validatorList.map(parseValidatorItemForList)}
            placeholder={{
              label: getLanguageString(language, 'CHOOSE_VALIDATOR'),
              value: '',
            }}
            value={selectedValidatorAddress}
            onChange={(value, _) => {
              if (value) {
                setSelectedValidatorAddress(value);
              } else {
                setSelectedValidatorAddress('');
              }
            }}
          />
        </View>
        <View style={{marginBottom: 30}}>
          <CustomTextInput
            message={amountError}
            headline={getLanguageString(language, 'STAKING_AMOUNT')}
            keyboardType="numeric"
            value={amount}
            onChangeText={(newAmount) => {
              const digitOnly = getDigit(newAmount);
              // if (Number(digitOnly) > wallets[selectedWallet].balance) {
              //   return;
              // }
              if (digitOnly === '') {
                setAmount('0');
                return;
              }
              isNumber(digitOnly) && setAmount(digitOnly);
            }}
            onBlur={() => setAmount(format(Number(amount)))}
          />
        </View>
        {selectedValidatorAddress !== '' && (
          <View style={{marginBottom: 20}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: theme.textColor, fontStyle: 'italic'}}>
                {getLanguageString(language, 'COMMISSION_RATE')}
              </Text>
              <Text style={[{color: theme.textColor}]}>
                {getSelectedCommission()}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: theme.textColor, fontStyle: 'italic'}}>
                {getLanguageString(language, 'TOTAL_STAKED_AMOUNT')}
              </Text>
              <Text style={[{color: theme.textColor}]}>
                {getSelectedStakedAmount()}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: theme.textColor, fontStyle: 'italic'}}>
                {getLanguageString(language, 'VOTING_POWER')}
              </Text>
              <Text style={[{color: theme.textColor}]}>
                {getSelectedVotingPower()}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: theme.textColor, fontStyle: 'italic'}}>
                {getLanguageString(language, 'ESTIMATED_EARNING')}
              </Text>
              <Text style={[{color: theme.textColor}]}>
                {numeral(estimatedProfit).format('0,0.00')}{' '}
                {estimatedProfit ? 'KAI' : ''}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: theme.textColor, fontStyle: 'italic'}}>
                {getLanguageString(language, 'ESTIMATED_APR')}
              </Text>
              <Text style={[{color: theme.textColor}]}>
                {numeral(estimatedAPR).format('0,0.00')}{' '}
                {estimatedProfit ? '%' : ''}
              </Text>
            </View>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            justifyContent: 'space-around',
          }}>
          <Button
            loading={delegating}
            disabled={delegating}
            type="primary"
            title={getLanguageString(language, 'DELEGATE')}
            size="large"
            onPress={delegateHandler}
          />
          <Button
            type="outline"
            title={getLanguageString(language, 'GO_BACK')}
            size="large"
            onPress={() => navigation.goBack()}
            disabled={delegating}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewStaking;