import React, {useContext} from 'react';
import {Text, View} from 'react-native';
import List from '../../components/List';
import {ThemeContext} from '../../ThemeContext';
import {styles} from './style';

const INFO_DATA = [
  {
    label: 'Version',
    value: '1.2.3',
  },
];

const Info = () => {
  const {theme} = useContext(ThemeContext);
  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <List
        items={INFO_DATA}
        render={(item) => {
          return (
            <View style={styles.settingItem}>
              <Text allowFontScaling={false} style={[styles.settingItemTitle, {color: theme.textColor}]}>
                {item.label}
              </Text>
              <Text allowFontScaling={false} style={[styles.settingItemTitle, {color: theme.textColor}]}>
                {item.value}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Info;
