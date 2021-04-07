/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Dimensions, ImageBackground, Text, View, Image} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {useFocusEffect} from '@react-navigation/native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {languageAtom} from '../../atoms/language';
import {selectedWalletAtom, walletsAtom} from '../../atoms/wallets';
import numeral from 'numeral';
import List from '../../components/List';
import {getCurrentStaking, mapValidatorRole} from '../../services/staking';
import {ThemeContext} from '../../ThemeContext';
import {getLanguageString} from '../../utils/lang';
import {styles} from './style';
import StakingItem from './StakingItem';
import AlertModal from '../../components/AlertModal';
import {useNavigation} from '@react-navigation/native';
import {weiToKAI} from '../../services/transaction/amount';
import Button from '../../components/Button';
import {statusBarColorAtom} from '../../atoms/statusBar';
import {getSelectedWallet, getWallets} from '../../utils/local';
import UndelegateModal from './UndelegateModal';
import IconButton from '../../components/IconButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showTabBarAtom } from '../../atoms/showTabBar';

const {width: viewportWidth} = Dimensions.get('window');

const StakingScreen = () => {
  const {theme} = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);
  const selectedWallet = useRecoilValue(selectedWalletAtom);
  const wallets = useRecoilValue(walletsAtom);
  const navigation = useNavigation();

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(true);

  const [currentStaking, setCurrentStaking] = useState<Staking[]>([]);
  const [undelegatingIndex, setUndelegatingIndex] = useState(-1);
  // const [focusingItem, setFocusingItem] = useState(-1);
  const setStatusBarColor = useSetRecoilState(statusBarColorAtom);
  const setTabBarVisible = useSetRecoilState(showTabBarAtom);

  const getStakingData = async () => {
    const localWallets = await getWallets();
    const localSelectedWallet = await getSelectedWallet();
    if (
      !localWallets[localSelectedWallet] ||
      !localWallets[localSelectedWallet].address
    ) {
      return;
    }
    try {
      const _staking = await getCurrentStaking(
        localWallets[localSelectedWallet].address,
      );
      setCurrentStaking(_staking);
      if (loading === true) {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      if (loading === true) {
        setLoading(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      getStakingData();
      setTabBarVisible(true);
      // TODO: Update after designer finish
      setStatusBarColor(theme.backgroundColor);
      return () => {
        setStatusBarColor(theme.backgroundColor);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    if (message !== '' || undelegatingIndex >= 0) {
      setStatusBarColor(theme.backgroundColor);
    } else {
      setStatusBarColor(theme.backgroundColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [undelegatingIndex, message]);

  useEffect(() => {
    getStakingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, selectedWallet, wallets]);

  const parseStakingItemForList = (item: Staking) => {
    return {
      label: item.validatorContractAddr,
      value: item.validatorContractAddr,
      name: item.name,
      stakedAmount: item.stakedAmount,
      claimableRewards: item.claimableRewards,
      withdrawableAmount: item.withdrawableAmount,
      unbondedAmount: item.unbondedAmount,
      role: mapValidatorRole(item.validatorRole),
    };
  };

  const getTotalSaving = () => {
    return currentStaking.reduce((total, item) => {
      return total + Number(weiToKAI(item.claimableRewards));
    }, 0);
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={styles.header}>
        <Text allowFontScaling={false} style={[styles.headline, {color: theme.textColor}]}>
          {getLanguageString(language, 'STAKING_TITLE')}
        </Text>
        <IconButton
          name="bell-o"
          color={theme.textColor}
          size={18}
          onPress={() => navigation.navigate('Notification')}
        />
      </View>
      <ImageBackground
        source={require('../../assets/address_detail_background.jpg')}
        imageStyle={{
          resizeMode: 'cover',
          width: viewportWidth - 40,
          height: 210,
          borderRadius: 12,
        }}
        style={{
          width: viewportWidth - 40,
          height: 210,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingVertical: 32,
        }}>
        <Text
          allowFontScaling={false}
          style={[
            styles.sectionTitle,
            {color: theme.textColor, textAlign: 'center'},
          ]}>
          {getLanguageString(language, 'TOTAL_EARNING')}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text allowFontScaling={false} style={[styles.totalSaving, {color: theme.textColor}]}>
            {numeral(getTotalSaving()).format('0,0.00')}
          </Text>
          <Text allowFontScaling={false} style={{fontSize: 14, color: 'rgba(252, 252, 252, 0.54)'}}>
            KAI
          </Text>
        </View>
        {/* <View style={styles.headerButtonGroup}>
          <Button
            title={getLanguageString(language, 'INVEST')}
            iconName="plus"
            type="primary"
            // textStyle={{color: '#FFFFFF'}}
            onPress={() => navigation.navigate('ValidatorList')}
            style={{width: '30%'}}
          />
        </View> */}
      </ImageBackground>
      {currentStaking.length > 0 && (
        <Text
          allowFontScaling={false}
          style={[
            styles.sectionTitle,
            {
              color: theme.textColor,
              // paddingHorizontal: 14,
              paddingVertical: 20,
            },
          ]}>
          {getLanguageString(language, 'YOUR_INVESTMENTS')}
        </Text>
      )}
      <List
        loading={loading}
        loadingColor={theme.primaryColor}
        items={currentStaking.map(parseStakingItemForList)}
        ListEmptyComponent={
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 40,
            }}>
            <Image
              style={{width: 200, height: 172}}
              source={require('../../assets/icon/no_staking.png')}
            />
            <Text allowFontScaling={false} style={[styles.noStakingText, {color: theme.textColor}]}>
              {getLanguageString(language, 'NO_STAKING_ITEM')}
            </Text>
          </View>
        }
        render={(item, index) => {
          return (
            <StakingItem
              item={item}
              // onFocus={() => setFocusingItem(index)}
              // onUnfocus={() => setFocusingItem(-1)}
              showModal={(
                _message: string,
                _messageType: string,
                cb: () => void,
              ) => {
                setMessage(_message);
                setMessageType(_messageType);
                cb();
              }}
              triggerUndelegate={() => setUndelegatingIndex(index)}
            />
          );
        }}
        ItemSeprator={() => <View style={{height: 6}} />}
      />
      <Button
        type="primary"
        icon={<AntIcon name="plus" size={24} />}
        size="small"
        onPress={() => navigation.navigate('ValidatorList')}
        style={styles.floatingButton}
      />
      {message !== '' && (
        <AlertModal
          type={messageType as any}
          message={message}
          onClose={() => {
            setMessage('');
            if (messageType === 'success') {
              getStakingData();
            }
          }}
          visible={true}
        />
      )}
      <UndelegateModal
        item={
          undelegatingIndex >= 0
            ? currentStaking.map(parseStakingItemForList)[undelegatingIndex]
            : {}
        }
        showModal={(_message: string, _messageType: string) => {
          setUndelegatingIndex(-1);
          setMessage(_message);
          setMessageType(_messageType);
        }}
        visible={undelegatingIndex >= 0}
        onClose={() => setUndelegatingIndex(-1)}
      />
    </SafeAreaView>
  );
};

export default StakingScreen;
