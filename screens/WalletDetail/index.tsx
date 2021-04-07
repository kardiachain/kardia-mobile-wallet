import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ImageBackground, Text, View, Dimensions, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import ENIcon from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { showTabBarAtom } from '../../atoms/showTabBar';
import { ThemeContext } from '../../ThemeContext';
import { styles } from './style';
import numeral from 'numeral';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getLanguageString, parseCardAvatar, parseCardAvatarColor } from '../../utils/lang';
import { selectedWalletAtom, walletsAtom } from '../../atoms/wallets';
import { languageAtom } from '../../atoms/language';
import { weiToKAI } from '../../services/transaction/amount';
import { truncate } from '../../utils/string';
import { tokenInfoAtom } from '../../atoms/token';
import QRModal from '../common/AddressQRCode';
import CustomTextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { getSelectedWallet, getWallets, saveSelectedWallet, saveWallets } from '../../utils/local';
import Modal from '../../components/Modal';
import CardTypeModal from '../common/CardTypeModal';
import { ScrollView } from 'react-native-gesture-handler';
import IconButton from '../../components/IconButton';
import AuthModal from '../common/AuthModal';

const { width: viewportWidth } = Dimensions.get('window')

export default () => {
  const navigation = useNavigation();
  const {theme} = useContext(ThemeContext);

  const scrollRef = useRef<ScrollView>(null);

  const setTabBarVisible = useSetRecoilState(showTabBarAtom);
  const [wallets, setWallets] = useRecoilState(walletsAtom);
  const setSelectedWallet = useSetRecoilState(selectedWalletAtom);
  const language = useRecoilValue(languageAtom);
  const tokenInfo = useRecoilValue(tokenInfoAtom);

  const [showQRModal, setShowQRModal] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showCardTypeModal, setShowCardTypeModal] = useState(false);
  const [requestAuth, setRequestAuth] = useState(false);

  const { params } = useRoute();
  const address = params ? (params as any).address : ''
  const wallet = wallets.find((w) => w.address === address);

  if (!wallet) {
    return null;
  }

  const [name, setName] = useState(wallet.name);
  const [cardAvatarID, setCardAvatarID] = useState(wallet.cardAvatarID);

  useFocusEffect(
    useCallback(() => {
      setTabBarVisible(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    if (scrollRef && scrollRef.current) {
      scrollRef!.current!.scrollTo({
        x: 193 * (cardAvatarID || 0),
        y: 0,
        animated: false,
      })
    }
  }, []);

  const getAddressCardAvatar = () => {
    const walletItem = wallets.find((w) => w.address === address)
    if (!walletItem) {
      return parseCardAvatar(0);
    }
    return parseCardAvatar(walletItem.cardAvatarID || 0);
  }

  const removeWallet = async () => {
    const localWallets = await getWallets();
    const localSelectedWallet = await getSelectedWallet();
    let newWallets: Wallet[] = JSON.parse(JSON.stringify(localWallets));
    newWallets = newWallets.filter((w) => w.address !== address)
    await saveWallets(newWallets);
    if (newWallets.length === 0) {
      await saveSelectedWallet(0);
      setSelectedWallet(0);
    } else if (localSelectedWallet > newWallets.length - 1) {
      await saveSelectedWallet(newWallets.length - 1);
      setSelectedWallet(newWallets.length - 1);
    }
    // setWallets(newWallets);
    navigation.goBack();
  };

  const saveWallet = async () => {
    const localWallets = await getWallets();
    let newWallets: Wallet[] = JSON.parse(JSON.stringify(localWallets));

    const index = newWallets.findIndex(w => w.address === address)
    newWallets[index].name = name;
    newWallets[index].cardAvatarID = cardAvatarID;
    await saveWallets(newWallets);
    setWallets(newWallets);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <QRModal visible={showQRModal} onClose={() => setShowQRModal(false)} />
      <CardTypeModal cardAvatarID={cardAvatarID} visible={showCardTypeModal} onClose={() => setShowCardTypeModal(false)} />
      <AuthModal
        visible={requestAuth}
        onClose={() => {
          setRequestAuth(false);
        }}
        onSuccess={() => {
          setRequestAuth(false);
          navigation.navigate('MnemonicPhraseSetting')
        }}
      />
      <View
        style={{
          width: '100%',
          marginBottom: 19,
          paddingHorizontal: 20,
        }}>
        <ENIcon.Button
          name="chevron-left"
          onPress={() => navigation.goBack()}
          backgroundColor="transparent"
          style={{ padding: 0, marginBottom: 18 }}
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'space-between', }}>
        <ScrollView contentContainerStyle={{ justifyContent: 'space-between', height: '100%' }}>
          <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={{ paddingHorizontal: 20 }}>
                <ImageBackground
                  imageStyle={{
                    resizeMode: 'cover',
                    width: viewportWidth - 40,
                    height: 230,
                    borderRadius: 12,
                  }}
                  style={{
                    width: viewportWidth - 40,
                    height: 230,
                    borderRadius: 8,
                    justifyContent: 'space-between',
                    padding: 25,
                  }}
                  source={getAddressCardAvatar()}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View>
                      <Text allowFontScaling={false} style={{ color: 'rgba(252, 252, 252, 0.54)', fontSize: 10 }}>
                        {getLanguageString(language, 'BALANCE').toUpperCase()}
                      </Text>
                      <Text allowFontScaling={false} style={{ fontSize: 30, color: 'white' }}>
                        $
                        {numeral(
                        tokenInfo.price *
                        (Number(weiToKAI(wallet.balance)) + wallet.staked),
                      ).format('0,0.00a')}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <IconButton
                        onPress={() => setRequestAuth(true)}
                        name="lock"
                        color={theme.textColor}
                        size={20}
                        style={{marginRight: 8}}
                      />
                      <IconButton
                        onPress={() => setShowRemoveConfirm(true)}
                        name="trash"
                        color={theme.textColor}
                        size={20}
                      />
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text allowFontScaling={false} style={styles.kaiCardText}>
                      {truncate(
                        wallet.address,
                        viewportWidth >= 432 ? 14 : 10,
                        viewportWidth >= 432 ? 14 : 12,
                      )}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                      <Text allowFontScaling={false} style={{ fontSize: 10, color: 'rgba(252, 252, 252, 0.54)' }}>
                        {getLanguageString(language, 'WALLET_CARD_NAME').toUpperCase()}
                      </Text>
                      <Text allowFontScaling={false} style={{ fontSize: 15, color: 'rgba(252, 252, 252, 0.87)' }}>
                        {wallet.name}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setShowQRModal(true)}
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
                </ImageBackground>
                <Text allowFontScaling={false} style={{ color: theme.textColor, fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>
                  {getLanguageString(language, 'WALLET_DETAILS')}
                </Text>
                <CustomTextInput
                  headline={getLanguageString(language, 'WALLET_CARD_NAME')}
                  value={name}
                  onChangeText={setName}
                  headlineStyle={{ marginTop: 16, fontWeight: 'normal', color: theme.textColor }}
                  inputStyle={{ marginTop: 6, backgroundColor: 'rgba(96, 99, 108, 1)', color: theme.textColor, borderColor: 'rgba(154, 163, 178, 1)', borderWidth: 1.5 }}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <Text allowFontScaling={false} style={{ marginTop: 16, marginBottom: 8, fontWeight: 'normal', color: theme.textColor, paddingHorizontal: 20 }}>{getLanguageString(language, 'WALLET_CARD_TYPE')}</Text>
            </TouchableWithoutFeedback>
            <View style={{ flex: 1 }}>
              <ScrollView horizontal ref={scrollRef}>
                {[0, 1, 2, 3].map((item, index) => {
                  return (
                    <TouchableOpacity key={`card-${index}`} onPress={() => setCardAvatarID(index)}>
                      <ImageBackground
                        imageStyle={{
                          resizeMode: 'contain',
                          width: 187,
                          height: 115,
                          borderRadius: 12,
                        }}
                        style={{
                          marginHorizontal: 12,
                          width: 193,
                          height: 121,
                          borderRadius: 12,
                          justifyContent: 'flex-end',
                          padding: 12,
                          borderColor: index === cardAvatarID ? theme.textColor : 'transparent',
                          borderWidth: 3,
                        }} source={parseCardAvatar(item || 0)}>
                        <Text allowFontScaling={false} style={{ fontSize: 14, color: theme.textColor }}>{parseCardAvatarColor(item || 0)}</Text>
                      </ImageBackground>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
          <View style={{ marginVertical: 52, paddingHorizontal: 20 }}>
            {/* <Button
              title={getLanguageString(language, "REMOVE_WALLET")}
              iconName="trash"
              iconSize={18}
              iconColor={theme.textColor}
              type="outline"
              onPress={() => setShowRemoveConfirm(true)}
            /> */}
            <Button
              title={getLanguageString(language, 'SAVE')}
              onPress={saveWallet}
              style={{ marginTop: 12 }}
            />
          </View>
        </ScrollView>
      </View>
      <Modal
        visible={showRemoveConfirm}
        showCloseButton={false}
        onClose={() => setShowRemoveConfirm(false)}
        contentStyle={{
          backgroundColor: theme.backgroundFocusColor,
          height: 450,
          justifyContent: 'center',
        }}>
        <Image
          style={{ width: 101, height: 152 }}
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
          onPress={() => setShowRemoveConfirm(false)}
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
    </SafeAreaView>
  );
};
