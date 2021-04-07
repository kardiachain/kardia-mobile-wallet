/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import numeral from 'numeral';
import {Text, TouchableOpacity, View} from 'react-native';
import {ThemeContext} from '../../ThemeContext';
import {styles} from './style';
import {weiToKAI} from '../../services/transaction/amount';
import Button from '../../components/Button';
import {
  getValidatorCommissionRate,
  withdrawDelegatedAmount,
  withdrawReward,
} from '../../services/staking';
import {useRecoilValue} from 'recoil';
import {selectedWalletAtom, walletsAtom} from '../../atoms/wallets';
import {getLanguageString} from '../../utils/lang';
import {languageAtom} from '../../atoms/language';
import TextAvatar from '../../components/TextAvatar';
import DelegateDetailModal from '../common/DelegateDetailModal';

const StakingItem = ({
  item,
  showModal,
  triggerUndelegate,
}: {
  item: any;
  showModal: (
    message: string,
    messageType: string,
    callback: () => void,
  ) => void;
  triggerUndelegate: (contractAddress: string) => void;
}) => {
  const [showFull, setShowFull] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [withDrawing, setWithDrawing] = useState(false);
  const [commissionRate, setCommissionRate] = useState(0);
  const {theme} = useContext(ThemeContext);

  const claimableInKAI = weiToKAI(item.claimableRewards);
  const withDrawbleInKAI = weiToKAI(item.withdrawableAmount);
  const unbondedInKAI = weiToKAI(item.unbondedAmount);
  const stakedAmountInKAI = weiToKAI(item.stakedAmount);

  const language = useRecoilValue(languageAtom);
  const wallets = useRecoilValue(walletsAtom);
  const selectedWallet = useRecoilValue(selectedWalletAtom);

  useEffect(() => {
    (async () => {
      const rate = await getValidatorCommissionRate(item.value);
      setCommissionRate(Number(rate) * 100);
    })();
  }, [item.value]);

  const claimHandler = async () => {
    try {
      setClaiming(true);
      await withdrawReward(item.value, wallets[selectedWallet]);
      showModal(
        getLanguageString(language, 'CLAIM_SUCCESS').replace(
          '{{KAI_AMOUNT}}',
          numeral(claimableInKAI).format('0,0.00'),
        ),
        'success',
        () => {
          setClaiming(false);
        },
      );
    } catch (err) {
      console.error(err);
      showModal(getLanguageString(language, 'GENERAL_ERROR'), 'error', () => {
        setClaiming(false);
      });
    }
  };

  const undelegateHandler = () => {
    try {
      triggerUndelegate(item.value);
    } catch (error) {}
  };

  const withdrawHandler = async () => {
    try {
      setWithDrawing(true);
      await withdrawDelegatedAmount(item.value, wallets[selectedWallet]);
      showModal(
        getLanguageString(language, 'WITHDRAW_SUCCESS').replace(
          '{{KAI_AMOUNT}}',
          numeral(withDrawbleInKAI).format('0,0.00'),
        ),
        'success',
        () => {
          setWithDrawing(false);
        },
      );
    } catch (err) {
      console.error(err);
      showModal(getLanguageString(language, 'GENERAL_ERROR'), 'error', () => {
        setWithDrawing(false);
      });
    }
  };

  const renderActionGroup = () => {
    return (
      <View style={styles.actionContainer}>
        {numeral(claimableInKAI).format('0,0.00') !== '0.00' && (
          <Button
            style={{marginRight: 12, paddingVertical: 8}}
            loading={claiming}
            disabled={claiming || withDrawing}
            title={getLanguageString(language, 'CLAIM_REWARD')}
            type="primary"
            size="small"
            onPress={claimHandler}
          />
        )}
        {numeral(stakedAmountInKAI).format('0,0.00') !== '0.00' && (
          <Button
            style={{
              paddingVertical: 8,
              marginRight:
                numeral(withDrawbleInKAI).format('0,0.00') !== '0.00' ? 12 : 0,
            }}
            title={getLanguageString(language, 'UNDELEGATE')}
            type="ghost"
            size="small"
            onPress={undelegateHandler}
          />
        )}
        {numeral(withDrawbleInKAI).format('0,0.00') !== '0.00' && (
          <Button
            style={{paddingVertical: 8}}
            title={getLanguageString(language, 'WITHDRAW')}
            loading={withDrawing}
            disabled={claiming || withDrawing}
            type="ghost"
            size="small"
            onPress={withdrawHandler}
          />
        )}
      </View>
    );
  };

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginVertical: 2,
        backgroundColor: theme.backgroundFocusColor,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <DelegateDetailModal
        validatorItem={{...item, ...{commissionRate}}}
        visible={showFull}
        onClose={() => setShowFull(false)}
      />
      <TouchableOpacity
        onPress={() => setShowFull(!showFull)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TextAvatar
            text={item.name}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              marginRight: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            textStyle={{fontSize: 16}}
          />
          <View>
            <Text allowFontScaling={false} style={[styles.validatorName, {color: theme.textColor}]}>
              {item.name}
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: theme.defaultFontSize,
                color: 'rgba(252, 252, 252, 0.54)',
              }}>
              Rate: {commissionRate} %
            </Text>
          </View>
          {/* {showFull && (
            <Text allowFontScaling={false} style={{color: '#929394'}}>
              {getLanguageString(language, 'STAKED')}:{' '}
              <Text allowFontScaling={false} style={{fontWeight: 'bold', color: theme.textColor}}>
                {numeral(stakedAmountInKAI).format('0,0.00')}
              </Text>
            </Text>
          )}
          {showFull && (
            <Text allowFontScaling={false} style={{color: '#929394'}}>
              {getLanguageString(language, 'CLAIMABLE')}:{' '}
              <Text allowFontScaling={false} style={{fontWeight: 'bold', color: theme.textColor}}>
                {numeral(claimableInKAI).format('0,0.00')}
              </Text>
            </Text>
          )}
          {showFull && (
            <Text allowFontScaling={false} style={{color: '#929394'}}>
              {getLanguageString(language, 'UNBONDED')}:{' '}
              <Text allowFontScaling={false} style={{fontWeight: 'bold', color: theme.textColor}}>
                {numeral(unbondedInKAI).format('0,0.00')}
              </Text>
            </Text>
          )}
          {showFull && (
            <Text allowFontScaling={false} style={{color: '#929394'}}>
              {getLanguageString(language, 'WITHDRAWABLE')}:{' '}
              <Text allowFontScaling={false} style={{fontWeight: 'bold', color: theme.textColor}}>
                {numeral(withDrawbleInKAI).format('0,0.00')}
              </Text>
            </Text>
          )} */}
        </View>
        <View style={{alignItems: 'flex-end', justifyContent: 'space-between'}}>
          <View style={{justifyContent: 'center'}}>
            <Text
              allowFontScaling={false}
              style={{
                fontWeight: 'bold',
                color: theme.textColor,
                fontSize: theme.defaultFontSize + 1,
              }}>
              {numeral(claimableInKAI).format('0,0.00')} KAI
            </Text>
          </View>
          <View style={{justifyContent: 'center'}}>
            <Text
              allowFontScaling={false}
              style={{
                color: 'rgba(252, 252, 252, 0.54)',
                fontSize: theme.defaultFontSize,
              }}>
              {numeral(stakedAmountInKAI).format('0,0.00')} KAI
            </Text>
          </View>
          {/* <Icon
            name={showFull ? 'chevron-up' : 'chevron-down'}
            size={22}
            color="#929394"
            style={{
              marginLeft: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setShowFull(!showFull)}
          /> */}
        </View>
      </TouchableOpacity>
      {/* {showFull && renderActionGroup()} */}
    </View>
  );
};

export default StakingItem;
