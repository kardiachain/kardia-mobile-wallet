/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useRef} from 'react';
import {
  Animated,
  StyleProp,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ViewStyle,
  Dimensions,
  View,
  Text,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Portal from '@burstware/react-native-portal';
import {styles} from './style';
import IconButton from '../IconButton';
import {ThemeContext} from '../../ThemeContext';

const {height: viewportHeight} = Dimensions.get('window');

const DEFAULT_HEIGHT_MODAL = 0.5;
const DEFAULT_HEIGHT_MODAL_IN_PIXEL = viewportHeight / 2;

const CustomModal = ({
  animationType = 'slide',
  visible,
  onClose,
  children,
  full = false,
  showCloseButton = true,
  contentStyle = {
    flex: DEFAULT_HEIGHT_MODAL,
  } as StyleProp<ViewStyle>,
}: CustomModalProps & {
  contentStyle?: any;
}) => {
  const {theme} = useContext(ThemeContext);
  let endFlex = DEFAULT_HEIGHT_MODAL;
  let endHeight = DEFAULT_HEIGHT_MODAL_IN_PIXEL;
  if (full) {
    endFlex = 0.9;
    endHeight = (11 * viewportHeight) / 12;
  } else if (contentStyle && contentStyle.flex) {
    endFlex = contentStyle.flex;
  } else if (contentStyle && contentStyle.height) {
    endHeight = contentStyle.height;
  }

  const slideAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let endValue = endFlex;
    if (contentStyle && contentStyle.height) {
      endValue = endHeight;
    }
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: endValue,
        duration: 170,
        useNativeDriver: false,
      }).start();
    }
  }, [contentStyle, endFlex, endHeight, slideAnim, visible]);

  const getAnimationStyle = () => {
    if (contentStyle && contentStyle.height) {
      return {height: slideAnim};
    }
    return {flex: slideAnim};
  };

  if (!visible) {
    return null;
  }

  const renderContent = () => {
    if (animationType === 'none') {
      return (
        <View style={[
          styles.modalView,
          // {flex: full ? 0.9 : undefined},
          contentStyle,
        ]}>
          {children}
          {showCloseButton && (
            <IconButton
              onPress={onClose}
              name="close"
              size={24}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
              }}
              color={theme.textColor}
            />
          )}
        </View>
      );
    } else {
      return (
        <Animated.View
          style={[
            styles.modalView,
            // {flex: full ? 0.9 : undefined},
            contentStyle,
            getAnimationStyle(),
          ]}>
          {children}
          {showCloseButton && (
            <IconButton
              onPress={onClose}
              name="close"
              size={24}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
              }}
              color={theme.textColor}
            />
          )}
        </Animated.View>
      );
    }
  }

  return (
    <Portal>
      <BlurView blurType="dark" blurAmount={50} style={styles.absolute}>
        <TouchableOpacity style={styles.container} onPress={onClose}>
          <TouchableWithoutFeedback onPress={() => {}}>
            {renderContent()}
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </BlurView>
    </Portal>
  );
};

export default CustomModal;
