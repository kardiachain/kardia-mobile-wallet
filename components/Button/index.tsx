/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ThemeContext} from '../../ThemeContext';
import {styles} from './style';

const gradientColor = {
  dark: [
    'rgba(126, 219, 220, 0.3)',
    'rgba(228, 175, 203, 0.3)',
    'rgba(226, 194, 139, 0.3)',
    'rgba(255, 255, 255, 0.3)',
    'rgba(255, 255, 255, 1)',
  ],
  light: [
    'rgba(126, 219, 220, 0.3)',
    'rgba(228, 175, 203, 0.3)',
    'rgba(226, 194, 139, 0.2)',
    'rgba(5, 5, 15, 0.3)',
  ]
}

const Button = ({
  title,
  style,
  onPress,
  icon,
  iconName,
  textStyle,
  block,
  size = 'medium',
  type = 'primary',
  iconSize = 14,
  iconColor,
  disabled,
  loading = false,
}: ButtonProps & {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) => {
  const {theme} = useContext(ThemeContext);

  const parseSize = () => {
    let sizeStyle = styles.mediumButton;
    if (size === 'small') {
      sizeStyle = styles.smallButton;
    } else if (size === 'large') {
      sizeStyle = styles.largeButton;
    }
    return sizeStyle;
  };

  const parseType = () => {
    let typeStyle = {
      ...styles.primaryButton,
      ...{backgroundColor: theme.primaryColor},
    };
    let textTypeStyle = {
      ...styles.primaryButtonText,
      ...{color: theme.primaryTextColor},
    };
    if (type === 'secondary') {
      typeStyle = styles.secondaryButton;
      textTypeStyle = styles.secondaryButtonText;
    } else if (type === 'outline') {
      typeStyle = {
        ...styles.outlineButton,
        ...{borderColor: theme.outlineBorderColor},
      };
      textTypeStyle = {
        ...styles.outlineButtonText,
        ...{color: theme.outlineTextColor},
      };
    } else if (type === 'ghost') {
      typeStyle = {
        ...styles.ghostButton,
        ...{backgroundColor: theme.ghostColor},
      };
      textTypeStyle = {
        ...styles.ghostButtonText,
        ...{color: theme.ghostTextColor},
      };
    } else if (type === 'link') {
      typeStyle = styles.linkButton;
      textTypeStyle = {
        ...styles.linkButtonText,
        ...{color: theme.linkTextColor},
      };
    }

    return {typeStyle, textTypeStyle};
  };

  const renderIcon = () => {
    if (icon) {
      return icon;
    }
    if (iconName) {
      let _iconColor = theme.name === 'dark' ? '#000000' : '#FFFFFF';
      switch (type) {
        case 'secondary':
          _iconColor = '#AD182A';
          break;
        case 'outline':
          _iconColor = '#000000';
          break;
        case 'ghost':
          _iconColor = '#364766';
          break;
        default:
          break;
      }
      if (textStyle && (textStyle as any).color) {
        _iconColor = (textStyle as any).color;
      }
      if (iconColor) {
        _iconColor = iconColor;
      }
      return (
        <Icon
          style={[
            styles.icon,
            title ? {marginRight: styles.icon.marginRight} : {marginRight: 0},
          ]}
          name={iconName}
          color={_iconColor}
          size={iconSize}
        />
      );
    }
    return null;
  };

  const {typeStyle, textTypeStyle} = parseType();

  if (type === 'primary') {
    return (
      <TouchableOpacity
        onPress={() => {
          !loading && onPress();
        }}
        disabled={disabled}
        style={[
          // styles.button,
          // parseSize(),
          // typeStyle,
          block ? {width: '100%'} : null,
          style,
          {
            borderRadius: style && (style as any).borderRadius ? (style as any).borderRadius : styles.button.borderRadius,
            backgroundColor: theme.name === 'light' ? '#000000' : '#FFFFFF'
          }
        ]}
      >
        <LinearGradient
          start={{x: 0, y: 0}}
          // locations={[0, 0.2, 0.4, 0.6, 0.8]}
          end={{x: 1, y: 1}}
          // style={{flex: 1}}
          style={[
            styles.button,
            parseSize(),
            // typeStyle,
            // style,
            {
              borderRadius: style && (style as any).borderRadius ? (style as any).borderRadius : styles.button.borderRadius,
            }
          ]}
          colors={theme.name === 'light' ? gradientColor.light : gradientColor.dark}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              flexDirection: 'row',
            }}>
            {loading && <ActivityIndicator color={textTypeStyle.color} />}
            {!loading && renderIcon()}
            {!loading && title && (
              <Text allowFontScaling={false} style={[styles.title, textTypeStyle, textStyle]}>
                {title}
              </Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => {
        !loading && onPress();
      }}
      disabled={disabled}
      style={[
        styles.button,
        parseSize(),
        typeStyle,
        type === 'link' ? {padding: 0, minWidth: 0} : null,
        block ? {width: '100%'} : null,
        style,
      ]}>
      {loading && <ActivityIndicator color={textTypeStyle.color} />}
      {!loading && renderIcon()}
      {/* <Icon name={iconName} size={size} color={color} style={{marginRight:8}}/> */}
      {!loading && title && (
        <Text allowFontScaling={false} style={[styles.title, textTypeStyle, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
