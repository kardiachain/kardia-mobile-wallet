/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {useRecoilState, useRecoilValue} from 'recoil';
import Icon from 'react-native-vector-icons/FontAwesome';
import {selectedWalletAtom, walletsAtom} from '../../atoms/wallets';
import {truncate} from '../../utils/string';
import {styles} from './style';
import {
  getSelectedWallet,
  getWallets,
  saveSelectedWallet,
  saveWallets,
} from '../../utils/local';
import {tokenInfoAtom} from '../../atoms/token';
import {languageAtom} from '../../atoms/language';
import {getLanguageString, parseCardAvatar} from '../../utils/lang';
import Modal from '../../components/Modal';
import NewTxModal from '../common/NewTxModal';
import numeral from 'numeral';
import {weiToKAI} from '../../services/transaction/amount';
import {ThemeContext} from '../../ThemeContext';
import IconButton from '../../components/IconButton';
import Button from '../../components/Button';

const {width: viewportWidth} = Dimensions.get('window');

const CardSliderSection = ({showQRModal}: {showQRModal: () => void}) => {
  // const navigation = useNavigation();
  const {theme} = useContext(ThemeContext);
  const [showNewTxModal, setShowNewTxModal] = useState(false);
  const carouselRef = useRef<Carousel<Wallet>>(null);
  const [wallets, setWallets] = useRecoilState(walletsAtom);
  const [tokenInfo] = useRecoilState(tokenInfoAtom);
  const [selectedWallet, setSelectedWallet] = useRecoilState(
    selectedWalletAtom,
  );
  const [removeIndex, setRemoveIndex] = useState(-1);
  const language = useRecoilValue(languageAtom);

  // function showCredential() {
  //   navigation.navigate('Setting', {
  //     screen: 'MnemonicPhraseSetting',
  //     initial: false,
  //     params: {
  //       from: 'Home',
  //     },
  //   });
  // }
  const renderWalletItem = ({item: wallet}: any) => {
    return (
      <View style={styles.kaiCardContainer}>
        <View style={styles.kaiCard}>
          <Image
            style={[styles.cardBackground, {width: viewportWidth - 50}]}
            source={parseCardAvatar(wallet.cardAvatarID)}
            // source={require('../../assets/test.jpg')}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text allowFontScaling={false} style={{color: 'rgba(252, 252, 252, 0.54)', fontSize: 10}}>
                {getLanguageString(language, 'BALANCE').toUpperCase()}
              </Text>
              <Text allowFontScaling={false} style={{fontSize: 30, color: 'white'}}>
                $
                {numeral(
                  tokenInfo.price *
                    (Number(weiToKAI(wallet.balance)) + wallet.staked),
                ).format('0,0.00a')}
              </Text>
            </View>
            <IconButton
              onPress={() => setRemoveIndex(selectedWallet)}
              name="trash"
              color={'#FFFFFF'}
              size={20}
            />
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text allowFontScaling={false} style={styles.kaiCardText}>
              {truncate(
                wallet.address,
                viewportWidth >= 432 ? 14 : 10,
                viewportWidth >= 432 ? 14 : 12,
              )}
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Text allowFontScaling={false} style={{fontSize: 10, color: 'rgba(252, 252, 252, 0.54)'}}>
                {getLanguageString(language, 'WALLET_CARD_NAME').toUpperCase()}
              </Text>
              <Text allowFontScaling={false} style={{fontSize: 15, color: 'rgba(252, 252, 252, 0.87)'}}>
                {wallet.name || 'WALLET'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => showQRModal()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon size={20} name="qrcode" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    saveSelectedWallet(selectedWallet);
    if (carouselRef.current) {
      if (removeIndex >= 0) {
        carouselRef.current.triggerRenderingHack();
        setRemoveIndex(-1);
      } else if (carouselRef.current.currentIndex !== selectedWallet) {
        // react-native-snap-carousel issue. TODO: wait for issue resolved and update
        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.snapToItem(selectedWallet);
          }
        }, 300);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWallet]);

  const removeWallet = async () => {
    // setShouldFetchBalance(false);
    const localWallets = await getWallets();
    const localSelectedWallet = await getSelectedWallet();
    const newWallets: Wallet[] = JSON.parse(JSON.stringify(localWallets));
    newWallets.splice(removeIndex, 1);
    await saveWallets(newWallets);
    setWallets(newWallets);
    if (newWallets.length === 0) {
      await saveSelectedWallet(0);
      setSelectedWallet(0);
    } else if (localSelectedWallet > newWallets.length - 1) {
      await saveSelectedWallet(newWallets.length - 1);
      setSelectedWallet(newWallets.length - 1);
    } else {
      await saveSelectedWallet(selectedWallet);
      setRemoveIndex(-1);
    }
  };

  return (
    <View style={styles.kaiCardSlider}>
      <NewTxModal
        visible={showNewTxModal}
        onClose={() => setShowNewTxModal(false)}
      />
      <Carousel
        ref={carouselRef}
        data={wallets}
        enableSnap={true}
        renderItem={renderWalletItem}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth - 50}
        onSnapToItem={setSelectedWallet}
      />
      <Pagination
        dotsLength={wallets.length}
        activeDotIndex={selectedWallet}
        containerStyle={{
          paddingVertical: 0,
          height: 6,
          alignItems: 'center',
          justifyContent: 'center',
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
      <Modal
        visible={removeIndex >= 0}
        showCloseButton={false}
        onClose={() => setRemoveIndex(-1)}
        contentStyle={{
          backgroundColor: theme.backgroundFocusColor,
          height: 450,
          justifyContent: 'center',
        }}>
        <Image
          style={{width: 101, height: 152}}
          source={require('../../assets/trash_dark.png')}
        />
        <Text
          allowFontScaling={false}
          style={{
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 'bold',
            marginVertical: 20,
            color: theme.textColor,
          }}>
          {getLanguageString(language, 'ARE_YOU_SURE')}
        </Text>
        <Button
          block
          title={getLanguageString(language, 'CANCEL')}
          type="outline"
          textStyle={{
            fontWeight: 'bold',
          }}
          onPress={() => setRemoveIndex(-1)}
        />
        <Button
          block
          title={getLanguageString(language, 'CONFIRM')}
          type="ghost"
          style={{
            marginTop: 12,
            backgroundColor: 'rgba(208, 37, 38, 1)',
          }}
          textStyle={{
            color: '#FFFFFF',
            fontWeight: 'bold',
          }}
          onPress={removeWallet}
        />
      </Modal>
    </View>
  );
};

export default CardSliderSection;
