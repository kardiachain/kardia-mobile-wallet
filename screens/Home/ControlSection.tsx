import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import { useRecoilValue } from 'recoil';
import { languageAtom } from '../../atoms/language';
import CustomText from '../../components/Text';
import { ThemeContext } from '../../ThemeContext';
import { getLanguageString } from '../../utils/lang';
import QRModal from '../common/AddressQRCode';
import NewTxModal from '../common/NewTxModal';
import {styles} from './style'

export default () => {
  const navigation = useNavigation()
  const theme = useContext(ThemeContext)
  const language = useRecoilValue(languageAtom)

  const [showNewTxModal, setShowNewTxModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <View style={{width: '100%', flexDirection: 'row', paddingHorizontal: 60, paddingTop: 30, paddingBottom: 16, justifyContent: 'space-between'}}>
      {
        showNewTxModal && (
          <NewTxModal
            visible={showNewTxModal}
            onClose={() => setShowNewTxModal(false)}
          />
        )
      }
      <QRModal visible={showQRModal} onClose={() => setShowQRModal(false)} />
      <View style={{alignItems: 'center', justifyContent: 'center', width: '33%'}}>
        <TouchableOpacity
          style={[styles.controlButton, {backgroundColor: theme.secondaryColor}]}
          onPress={() => setShowNewTxModal(true)}
        >
          <Image
            source={require('../../assets/icon/send_button.png')}
            style={{
              width: 20,
              height: 20,
            }}
          />
          
        </TouchableOpacity>
        <CustomText
          style={{
            color: theme.textColor,
            fontFamily: Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined,
            fontWeight: '500',
            fontSize: theme.defaultFontSize + 1
          }}
        >
          {getLanguageString(language, 'SEND')}
        </CustomText>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center', width: '33%'}}>
        <TouchableOpacity
          style={[styles.controlButton, {backgroundColor: theme.secondaryColor}]}
          onPress={() => setShowQRModal(true)}
        >
          <Image
            source={require('../../assets/icon/receive_button.png')}
            style={{
              width: 20,
              height: 20
            }}
          />
        </TouchableOpacity>
        <CustomText
          style={{
            color: theme.textColor,
            fontFamily: Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined,
            fontWeight: '500',
            fontSize: theme.defaultFontSize + 1
          }}
        >
          {getLanguageString(language, 'RECEIVE')}
        </CustomText>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center', width: '33%'}}>
        <TouchableOpacity
          style={[styles.controlButton, {backgroundColor: theme.secondaryColor}]}
          onPress={() => navigation.navigate('TransactionList')}
        >
          <Image
            source={require('../../assets/icon/transaction_dark.png')}
            style={{
              width: 20,
              height: 20,
            }}
          />
        </TouchableOpacity>
        <CustomText
          style={{
            color: theme.textColor,
            fontFamily: Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined,
            fontWeight: '500',
            fontSize: theme.defaultFontSize + 1
          }}
        >
          {getLanguageString(language, 'HISTORY')}
        </CustomText>
      </View>
    </View>
  )
}