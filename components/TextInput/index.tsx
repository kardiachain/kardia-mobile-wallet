/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {TextInput, View, Text, StyleProp, TextStyle, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ThemeContext} from '../../ThemeContext';
import CustomText from '../Text';
import {styles} from './style';

const CustomTextInput = ({
  onChangeText,
  onBlur,
  onFocus,
  value,
  iconName,
  onIconPress,
  headline,
  multiline = false,
  numberOfLines = 5,
  editable = true,
  placeholder,
  block,
  icons,
  message = '',
  keyboardType = 'default',
  headlineStyle,
  autoCapitalize = 'sentences',
  inputStyle,
  placeholderTextColor,
  inputRef,
  containerStyle,
}: CustomTextInputProps & {
  headlineStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputRef?: React.RefObject<TextInput>;
}) => {
  const theme = useContext(ThemeContext);

  const renderMessage = () => {
    if (!message) {
      return;
    }
    if (typeof message === 'string') {
      return <CustomText style={styles.errorMessage}>{message}</CustomText>;
    }
    return message();
  };

  return (
    <>
      {headline && (
        <CustomText
          style={[styles.headline, {color: theme.textColor}, headlineStyle]}>
          {headline}
        </CustomText>
      )}
      <View
        style={[
          {flexDirection: 'row', alignItems: 'center'},
          block ? {width: '100%'} : null,
          containerStyle,
        ]}>
        <TextInput
          allowFontScaling={false}
          style={[
            styles.input,
            multiline ? styles.multiline : null,
            // block ? {width: '100%'} : null,
            inputStyle,
          ]}
          ref={inputRef}
          keyboardType={keyboardType as any}
          onChangeText={onChangeText}
          value={value}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={editable}
          placeholder={placeholder}
          onBlur={onBlur}
          autoCapitalize={autoCapitalize}
          onFocus={onFocus}
          placeholderTextColor={placeholderTextColor}
        />
        {iconName && (
          <Icon
            onPress={onIconPress}
            name={iconName}
            size={25}
            color={'black'}
            style={styles.textIcon}
          />
        )}
        {icons && icons()}
      </View>
      {renderMessage()}
    </>
  );
};

export default CustomTextInput;
