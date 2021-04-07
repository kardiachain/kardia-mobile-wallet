import {useNavigation} from '@react-navigation/native';
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {languageAtom} from '../../atoms/language';
import ENIcon from 'react-native-vector-icons/Entypo';
import List from '../../components/List';
import TextInput from '../../components/TextInput';
import {getAllValidator} from '../../services/staking';
import {ThemeContext} from '../../ThemeContext';
import {getLanguageString} from '../../utils/lang';
import {getDigit, isNumber} from '../../utils/number';
import {styles} from './style';
import TextAvatar from '../../components/TextAvatar';
import NewStakingModal from '../common/NewStakingModal';
import { SafeAreaView } from 'react-native-safe-area-context';

const ValidatorList = () => {
  const {theme} = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);
  // const [filterValidator, setFilterValidator] = useState('');
  const [validatorList, setValidatorList] = useState<Validator[]>([]);
  const [loading, setLoading] = useState(true);

  const [validatorItem, setValidatorItem] = useState<Validator>();

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        const {validators} = await getAllValidator();
        setValidatorList(validators);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, []);

  // const filter = (validator: Validator) => {
  //   if (filterValidator.length < 1) {
  //     return true;
  //   }
  //   if (validator.name.toLowerCase().includes(filterValidator.toLowerCase())) {
  //     return true;
  //   }
  //   if (isNumber(filterValidator)) {
  //     const _minCom = Number(getDigit(filterValidator));
  //     return Number(validator.commissionRate) >= _minCom;
  //   }
  //   return false;
  // };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <NewStakingModal
        validatorItem={validatorItem}
        visible={validatorItem !== undefined && validatorItem.smcAddress !== ''}
        onClose={() => {
          setValidatorItem(undefined);
        }}
      />
      <ENIcon.Button
        style={{paddingHorizontal: 20}}
        name="chevron-left"
        onPress={() => navigation.goBack()}
        backgroundColor="transparent"
      />
      {/* <View style={styles.controlContainer}>
        <TextInput
          block={true}
          placeholder={getLanguageString(
            language,
            'SEARCH_VALIDATOR_PLACEHOLDER',
          )}
          value={filterValidator}
          onChangeText={setFilterValidator}
        />
      </View> */}
      <Text
        allowFontScaling={false}
        style={{color: theme.textColor, paddingHorizontal: 20, fontSize: 36}}>
        {getLanguageString(language, 'CHOOSE_VALIDATOR')}
      </Text>
      <View style={{flex: 1}}>
        <List
          keyExtractor={(item) => item.smcAddress}
          // items={validatorList.filter(filter)}
          items={validatorList}
          loading={loading}
          loadingSize="large"
          loadingColor={theme.textColor}
          render={(item: Validator) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  // navigation.navigate('NewStaking', {
                  //   smcAddress: item.smcAddress,
                  // })
                  setValidatorItem(item)
                }
                style={[
                  styles.validatorItemContainer,
                  {
                    backgroundColor: theme.backgroundFocusColor,
                  },
                ]}>
                <TextAvatar
                  text={item.name}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 12,
                    marginRight: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  textStyle={{fontSize: 16}}
                />
                <View style={{justifyContent: 'space-between'}}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: theme.textColor,
                      fontSize: 13,
                      fontWeight: 'bold',
                    }}>
                    {item.name}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: 'rgba(252, 252, 252, 0.54)',
                      fontSize: theme.defaultFontSize,
                    }}>
                    {item.commissionRate} %
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ValidatorList;
