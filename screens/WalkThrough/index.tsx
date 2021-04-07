import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useRecoilValue } from 'recoil';
import { languageAtom } from '../../atoms/language';
import Button from '../../components/Button';
import { ThemeContext } from '../../ThemeContext';
import { getLanguageString } from '../../utils/lang';
import {styles} from './style';

const {width: viewportWidth} = Dimensions.get('window')

export default ({onSubmit}: {onSubmit: () => void}) => {
  const {theme} = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);

  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [])

  const renderSlide = ({item, index}: {item: any, index: number}) => {
    if (index === 0) {
      return (
        <View style={{flex: 1, alignItems: 'center'}}>
          <Image source={require('../../assets/walkthrough_1.png')} style={{width: 209, height: 216, flex: 1, resizeMode: 'contain', marginVertical: 100}} />
          <View style={{alignItems: 'flex-start', width: '100%', paddingHorizontal: 20}}>
            <Text style={{color: theme.textColor, fontSize: 40}}>{getLanguageString(language, 'EASY')}</Text>
            <Text style={{color: 'rgba(252, 252, 252, 0.54)', fontSize: 18, marginTop: 12}}>{getLanguageString(language, 'EASY_DESC')}</Text>
          </View>
        </View>
      );
    }
    if (index === 1) {
      return (
        <View style={{flex: 1, alignItems: 'center'}}>
          <Image source={require('../../assets/walkthrough_2.png')} style={{width: 209, height: 216, flex: 1, resizeMode: 'contain', marginVertical: 100}} />
          <View style={{alignItems: 'flex-start', width: '100%', paddingHorizontal: 20}}>
            <Text style={{color: theme.textColor, fontSize: 40}}>{getLanguageString(language, 'INSTANT')}</Text>
            <Text style={{color: 'rgba(252, 252, 252, 0.54)', fontSize: 18, marginTop: 12}}>{getLanguageString(language, 'INSTANT_DESC')}</Text>
          </View>
        </View>
      );
    }
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Image source={require('../../assets/walkthrough_3.png')} style={{width: 209, height: 216, flex: 1, resizeMode: 'contain', marginVertical: 100}} />
        <View style={{alignItems: 'flex-start', width: '100%', paddingHorizontal: 20}}>
          <Text style={{color: theme.textColor, fontSize: 40}}>{getLanguageString(language, 'SECURE')}</Text>
          <Text style={{color: 'rgba(252, 252, 252, 0.54)', fontSize: 18, marginTop: 12}}>{getLanguageString(language, 'SECURE_DESC')}</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <Carousel
        data={[1, 2, 3]}
        renderItem={renderSlide}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth}
        onSnapToItem={setStep}
        
      />
      <Pagination
        dotsLength={3}
        activeDotIndex={step}
        containerStyle={{
          paddingVertical: 0,
          marginVertical: 44,
          height: 6,
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
        dotStyle={{
          width: 6,
          height: 6,
          borderRadius: 3,
          marginHorizontal: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={1}
      />
      <Button
        onPress={onSubmit}
        title={getLanguageString(language, 'START_NOW')}
        style={{marginHorizontal: 20, marginBottom: 82}}
      />
    </SafeAreaView>
  );
};
