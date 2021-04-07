/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {Text, View} from 'react-native';
import IconButton from '../../components/IconButton';
import {styles} from './style';
import {useNavigation} from '@react-navigation/native';
import {ThemeContext} from '../../ThemeContext';
import {useRecoilValue} from 'recoil';
import {notificationAtom} from '../../atoms/notification';
import {getLanguageString} from '../../utils/lang';
import NewTxModal from '../common/NewTxModal';
import {languageAtom} from '../../atoms/language';

const HomeHeader = () => {
  const navigation = useNavigation();
  const {theme} = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);
  const [showNewTxModal, setShowNewTxModal] = useState(false);

  function navigateNotiScreen() {
    navigation.navigate('Notification');
  }

  const notificationList = useRecoilValue(notificationAtom);
  const newNotiCount = notificationList.filter((item) => item.status === 0)
    .length;

  return (
    <View style={styles.headerContainer}>
      <NewTxModal
        visible={showNewTxModal}
        onClose={() => setShowNewTxModal(false)}
      />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text
          allowFontScaling={false}
          style={{fontSize: 25, fontWeight: 'bold', color: theme.textColor}}>
          {getLanguageString(language, 'WALLET')}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <IconButton
          style={{marginRight: 20}}
          name="bell-o"
          size={18}
          color={theme.textColor}
          badge={newNotiCount}
          onPress={navigateNotiScreen}
        />
        <IconButton
          name="plus"
          size={18}
          color={theme.textColor}
          onPress={() => navigation.navigate('ImportWallet')}
        />
      </View>
    </View>
  );
};

export default HomeHeader;
