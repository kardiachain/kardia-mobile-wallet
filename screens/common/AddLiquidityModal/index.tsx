import { useNavigation } from '@react-navigation/core';
import BigNumber from 'bignumber.js';
import React, { useContext, useEffect, useState } from 'react';
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cacheSelector } from '../../../atoms/cache';
import { languageAtom } from '../../../atoms/language';
import { selectedWalletAtom, walletsAtom } from '../../../atoms/wallets';
import Button from '../../../components/Button';
import Divider from '../../../components/Divider';
import CustomModal from '../../../components/Modal';
import Tags from '../../../components/Tags';
import CustomText from '../../../components/Text';
import CustomTextInput from '../../../components/TextInput';
import { addLiquidity, calculateTransactionDeadline, getTokenBalance } from '../../../services/dex';
import { ThemeContext } from '../../../ThemeContext';
import { getPairPriceInBN, parseSymbolWKAI } from '../../../utils/dex';
import { getLanguageString } from '../../../utils/lang';
import { formatNumberString, getDecimalCount, getDigit, getPartial, isNumber, parseDecimals } from '../../../utils/number';
import TxSettingModal from '../../KAIDex/TxSettingModal';

export default ({visible, onClose, pair}: {
	visible: boolean;
	onClose: () => void
	pair?: Pair
}) => {
	const navigation = useNavigation()
	const theme = useContext(ThemeContext)
	const language = useRecoilValue(languageAtom)

	const [token0, setToken0] = useState('')
	const [balance0, setBalance0] = useState('0')
	const [is25Balance0, setIs25Balance0] = useState(false)
	const [is50Balance0, setIs50Balance0] = useState(false)
	const [is75Balance0, setIs75Balance0] = useState(false)
	const [is100Balance0, setIs100Balance0] = useState(false)
	const [token1, setToken1] = useState('')
	const [balance1, setBalance1] = useState('0')
	const [is25Balance1, setIs25Balance1] = useState(false)
	const [is50Balance1, setIs50Balance1] = useState(false)
	const [is75Balance1, setIs75Balance1] = useState(false)
	const [is100Balance1, setIs100Balance1] = useState(false)
	const [errorToken0, setErrorToken0] = useState('')
	const [editting, setEditting] = useState('')
	const [showTxSettingModal, setShowTxSettingModal] = useState(false)

	const [submitting, setSubmitting] = useState(false)

	const wallets = useRecoilValue(walletsAtom)
	const selectedWallet = useRecoilValue(selectedWalletAtom)
	const [txDeadline, setTxDeadline] = useRecoilState(cacheSelector('txDeadline'))
  const [slippageTolerance, setSlippageTolerance] = useRecoilState(cacheSelector('slippageTolerance'))

	if (!pair) {
		return null
	}

	const shouldHighight = (val: string, token: PairToken) => {
    if (!token) return false
    const val14 = parseDecimals(getPartial(val, 0.25, token.decimals), token.decimals)
    const val24 = parseDecimals(getPartial(val, 0.5, token.decimals), token.decimals)
    const val34 = parseDecimals(getPartial(val, 0.75, token.decimals), token.decimals)
    const val44 = parseDecimals(getPartial(val, 1, token.decimals), token.decimals)
    if (val14 === val24 || val14 === val34 || val14 === val44) return false
    if (val24 === val34 || val24 === val44) return false
    if (val34 === val44) return false
    return true
  }

	useEffect(() => {
		(async () => {
			if (!pair) return;

			const _bl0 = await getTokenBalance(pair.t1.hash, wallets[selectedWallet].address)
			setBalance0(_bl0)

			const _bl1 = await getTokenBalance(pair.t2.hash, wallets[selectedWallet].address)
			setBalance1(_bl1)
		})()
	}, [])

	useEffect(() => {
		if (editting === '0') {
			const digitOnly = getDigit(token0);
			const priceBN = getPrice('BN')
			const token0BN = new BigNumber(digitOnly)
			const token1BN = token0BN.multipliedBy(priceBN).toFixed()
			setToken1(formatNumberString(token1BN))
		}
	}, [token0])

	useEffect(() => {
		if (editting === '1') {
			const digitOnly = getDigit(token1);
			const priceBN = getPrice('BN')
			const token1BN = new BigNumber(digitOnly)
			const token0BN = token1BN.dividedBy(priceBN).toFixed()
			setToken0(formatNumberString(token0BN))
		}
	}, [token1])

	const getContentStyle = () => {
		return {
			backgroundColor: theme.backgroundFocusColor,
			height: 550,
			padding: 20,
			paddingTop: 32,
			justifyContent: 'flex-start'
		}
	}

	const getPrice = (returnType = 'string') => {
		const priceBN = getPairPriceInBN(pair.token1_liquidity, pair.token2_liquidity)
		if (returnType === 'number') return priceBN.toNumber()
		if (returnType === 'BN') return priceBN
		return formatNumberString(priceBN.toFixed(), 6)
	}

	const handleAddLP = async () => {
		setSubmitting(true)
		try {
			const params = {
				inputAmount: token0,
        outputAmount: token1,
        tokenA: {
					tokenAddress: pair.t1.hash,
					name: pair.t1.name,
					symbol: pair.t1.symbol,
					decimals: pair.t1.decimals
				},
        tokenB: {
					tokenAddress: pair.t2.hash,
					name: pair.t2.name,
					symbol: pair.t2.symbol,
					decimals: pair.t2.decimals
				},
        walletAddress: wallets[selectedWallet].address,
        slippageTolerance,
        txDeadline: await calculateTransactionDeadline(txDeadline as string),
			}

			const rs = await addLiquidity(params, wallets[selectedWallet])
			setSubmitting(false)
			console.log('rs', rs)

			navigation.navigate('SuccessTx', {
        type: 'addLP',
        txHash: rs,
        lpPair: pair,
				token0,
				token1
      });

			onClose()

		} catch (error) {
			console.log(error)
		}
	}

	if (showTxSettingModal) {
		return (
			<TxSettingModal
				visible={showTxSettingModal}
				slippageTolerance={slippageTolerance as string}
				deadline={txDeadline as string}
				onClose={() => {
					setShowTxSettingModal(false);
				}}
				onSubmit={(newDeadline, newSlippageTolerance) => {
					setTxDeadline(newDeadline);
					setSlippageTolerance(newSlippageTolerance);
					setShowTxSettingModal(false);
				}}
			/>
		)
	}

  return (
		<CustomModal
			visible={visible}
			onClose={onClose}
			showCloseButton={false}
			contentStyle={getContentStyle()}
		>
			<View style={{width: '100%', marginBottom: 12}}>
				<View style={{width: '100%', marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
					<CustomText style={{color: theme.textColor, fontSize: theme.defaultFontSize + 2}}>First token</CustomText>
					<CustomText style={{color: theme.mutedTextColor, fontSize: theme.defaultFontSize + 2}}>
						Balance: 
						<CustomText style={{color: theme.textColor}}>{formatNumberString(parseDecimals(balance0, pair.t1.decimals), 6)}</CustomText>
					</CustomText>
				</View>
				<CustomTextInput
					onChangeText={(newValue) => {
						const digitOnly = getDigit(newValue, pair.t1.decimals === 0 ? false : true);
						if (digitOnly === '') {
							setToken0('0')
						}
						if (getDecimalCount(newValue) > pair.t1.decimals) {
							return;
						}
					
						if (isNumber(digitOnly)) {
							let formatedValue = formatNumberString(digitOnly);
							
							if (pair.t1.decimals == 0) {
								setToken0(formatedValue);
								return
							}

							const [numParts, decimalParts] = digitOnly.split('.')

							if (!decimalParts && decimalParts !== "") {
								setToken0(formatedValue);
								return
							}

							formatedValue = formatNumberString(numParts) + '.' + decimalParts

							// if (newValue[newValue.length - 1] === '.') formatedValue += '.'
							// else if (newValue[newValue.length - 2] === '.' && newValue[newValue.length - 1] === '0') formatedValue += '.0'
							setToken0(formatedValue)
						}
					}}
					onFocus={() => setEditting('0')}
					onBlur={() => setEditting('')}
					message={errorToken0}
					value={token0}
					inputStyle={{
						backgroundColor: 'rgba(96, 99, 108, 1)',
						color: theme.textColor,
						paddingRight: 60
					}}
					// headline={getLanguageString(language, 'CREATE_TX_ADDRESS')}
					icons={() => {
						return (
							<View
								style={{position: 'absolute', right: 10, flexDirection: 'row', alignItems: 'center'}}
							>
								<Image
									source={{uri: pair.t1.logo}}
									style={{
										width: 18,
										height: 18,
										marginRight: 4
									}}
								/>
								<CustomText
									style={{
										color: theme.textColor,
										fontWeight: '500',
										fontFamily: Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined
									}}
								>
									{parseSymbolWKAI(pair.t1.symbol)}
								</CustomText>
							</View>
						)
					}}
				/>
				<View style={{flexDirection: 'row', marginTop: 12}}>
					<Tags 
						content={`25 %`} 
						active={balance0 !== '0' && shouldHighight(balance0, pair.t1) && is25Balance0 } 
						containerStyle={{marginRight: 12}} 
						onPress={() => {
							setEditting('0')

							setIs25Balance0(true)
							setIs50Balance0(false)
							setIs75Balance0(false)
							setIs100Balance0(false)

							setIs25Balance1(false)
							setIs50Balance1(false)
							setIs75Balance1(false)
							setIs100Balance1(false)

							const partialValue = getPartial(balance0, 0.25, pair.t1.decimals)
							setToken0(formatNumberString(parseDecimals(partialValue, pair.t1.decimals), pair.t1.decimals))
						}} 
					/>
					<Tags 
						content={`50 %`} 
						active={balance0 !== '0' && shouldHighight(balance0, pair.t1) && is50Balance0 } 
						containerStyle={{marginRight: 12}} 
						onPress={() => {
							setEditting('0')

							setIs25Balance0(false)
							setIs50Balance0(true)
							setIs75Balance0(false)
							setIs100Balance0(false)

							setIs25Balance1(false)
							setIs50Balance1(false)
							setIs75Balance1(false)
							setIs100Balance1(false)

							const partialValue = getPartial(balance0, 0.5, pair.t1.decimals)
							setToken0(formatNumberString(parseDecimals(partialValue, pair.t1.decimals), pair.t1.decimals))
						}}
					/>
					<Tags 
						content={`75 %`} 
						active={balance0 !== '0' && shouldHighight(balance0, pair.t1) && is75Balance0 } 
						containerStyle={{marginRight: 12}} 
						onPress={() => {
							setEditting('0')

							setIs25Balance0(false)
							setIs50Balance0(false)
							setIs75Balance0(true)
							setIs100Balance0(false)

							setIs25Balance1(false)
							setIs50Balance1(false)
							setIs75Balance1(false)
							setIs100Balance1(false)

							const partialValue = getPartial(balance0, 0.75, pair.t1.decimals)
							setToken0(formatNumberString(parseDecimals(partialValue, pair.t1.decimals), pair.t1.decimals))
						}}
					/>
					<Tags 
						content={`100 %`} 
						active={balance0 !== '0' && shouldHighight(balance0, pair.t1) && is100Balance0 } 
						onPress={() => {
							setEditting('0')

							setIs25Balance0(false)
							setIs50Balance0(false)
							setIs75Balance0(false)
							setIs100Balance0(true)

							setIs25Balance1(false)
							setIs50Balance1(false)
							setIs75Balance1(false)
							setIs100Balance1(false)

							let partialValue = getPartial(balance0, 1, pair.t1.decimals)
							if (parseSymbolWKAI(pair.t1.symbol) === 'KAI') {
								const bnPartialValue = new BigNumber(partialValue)
								const ONE_KAI = new BigNumber(10 ** 18)
								// const bn110KAI = new BigNumber(10 ** (tokenTo.decimals))
								const bn110KAI = new BigNumber(partialValue).multipliedBy(new BigNumber(0.1))
								if (bnPartialValue.isGreaterThan(ONE_KAI)) {
									partialValue = bnPartialValue.minus(new BigNumber(10 ** 16)).toFixed(pair.t1.decimals, 1)
								} else {
									partialValue = bnPartialValue.minus(bn110KAI).toFixed(pair.t1.decimals, 1)
								}
							}
							setToken0(formatNumberString(parseDecimals(partialValue, pair.t1.decimals), pair.t1.decimals))
						}} 
					/>
				</View>
			</View>
			<View style={{width: '100%'}}>
				<View style={{width: '100%', marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
					<CustomText style={{color: theme.textColor, fontSize: theme.defaultFontSize + 2}}>Second token</CustomText>
					<CustomText style={{color: theme.mutedTextColor, fontSize: theme.defaultFontSize + 2}}>
						Balance: 
						<CustomText style={{color: theme.textColor}}>{formatNumberString(parseDecimals(balance1, pair.t2.decimals), 6)}</CustomText>
					</CustomText>
				</View>
				<CustomTextInput
					onChangeText={(newValue) => {
						const digitOnly = getDigit(newValue, pair.t2.decimals === 0 ? false : true);
						if (digitOnly === '') {
							setToken1('0')
						}
						if (getDecimalCount(newValue) > pair.t2.decimals) {
							return;
						}
					
						if (isNumber(digitOnly)) {
							let formatedValue = formatNumberString(digitOnly);
							
							if (pair.t2.decimals == 0) {
								setToken1(formatedValue);
								return
							}

							const [numParts, decimalParts] = digitOnly.split('.')

							if (!decimalParts && decimalParts !== "") {
								setToken1(formatedValue);
								return
							}

							formatedValue = formatNumberString(numParts) + '.' + decimalParts

							// if (newValue[newValue.length - 1] === '.') formatedValue += '.'
							// else if (newValue[newValue.length - 2] === '.' && newValue[newValue.length - 1] === '0') formatedValue += '.0'
							setToken1(formatedValue)
						}
					}}
					onFocus={() => setEditting('1')}
					onBlur={() => setEditting('')}
					message={errorToken0}
					value={token1}
					inputStyle={{
						backgroundColor: 'rgba(96, 99, 108, 1)',
						color: theme.textColor,
						paddingRight: 60
					}}
					// headline={getLanguageString(language, 'CREATE_TX_ADDRESS')}
					icons={() => {
						return (
							<View
								style={{position: 'absolute', right: 10, flexDirection: 'row', alignItems: 'center'}}
							>
								<Image
									source={{uri: pair.t2.logo}}
									style={{
										width: 18,
										height: 18,
										marginRight: 4
									}}
								/>
								<CustomText
									style={{
										color: theme.textColor,
										fontWeight: '500',
										fontFamily: Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined
									}}
								>
									{parseSymbolWKAI(pair.t2.symbol)}
								</CustomText>
							</View>
						)
					}}
				/>
				<View style={{flexDirection: 'row', marginTop: 12}}>
					<Tags 
						content={`25 %`} 
						active={balance1 !== '0' && shouldHighight(balance1, pair.t2) && is25Balance1 } 
						containerStyle={{marginRight: 12}} 
						onPress={() => {
							setEditting('1')

							setIs25Balance1(true)
							setIs50Balance1(false)
							setIs75Balance1(false)
							setIs100Balance1(false)

							setIs25Balance0(false)
							setIs50Balance0(false)
							setIs75Balance0(false)
							setIs100Balance0(false)

							const partialValue = getPartial(balance1, 0.25, pair.t2.decimals)
							setToken1(formatNumberString(parseDecimals(partialValue, pair.t2.decimals), pair.t2.decimals))
						}} 
					/>
					<Tags 
						content={`50 %`} 
						active={balance1 !== '0' && shouldHighight(balance1, pair.t2) && is50Balance1 } 
						containerStyle={{marginRight: 12}} 
						onPress={() => {
							setEditting('1')

							setIs25Balance1(false)
							setIs50Balance1(true)
							setIs75Balance1(false)
							setIs100Balance1(false)

							setIs25Balance0(false)
							setIs50Balance0(false)
							setIs75Balance0(false)
							setIs100Balance0(false)

							const partialValue = getPartial(balance1, 0.5, pair.t2.decimals)
							setToken1(formatNumberString(parseDecimals(partialValue, pair.t2.decimals), pair.t2.decimals))
						}}
					/>
					<Tags 
						content={`75 %`} 
						active={balance1 !== '0' && shouldHighight(balance1, pair.t2) && is75Balance1 } 
						containerStyle={{marginRight: 12}} 
						onPress={() => {
							setEditting('1')

							setIs25Balance1(false)
							setIs50Balance1(false)
							setIs75Balance1(true)
							setIs100Balance1(false)

							setIs25Balance0(false)
							setIs50Balance0(false)
							setIs75Balance0(false)
							setIs100Balance0(false)

							const partialValue = getPartial(balance1, 0.75, pair.t2.decimals)
							setToken1(formatNumberString(parseDecimals(partialValue, pair.t2.decimals), pair.t2.decimals))
						}}
					/>
					<Tags 
						content={`100 %`} 
						active={balance1 !== '0' && shouldHighight(balance1, pair.t2) && is100Balance1 } 
						onPress={() => {
							setEditting('1')

							setIs25Balance1(false)
							setIs50Balance1(false)
							setIs75Balance1(false)
							setIs100Balance1(true)

							setIs25Balance0(false)
							setIs50Balance0(false)
							setIs75Balance0(false)
							setIs100Balance0(false)
							
							let partialValue = getPartial(balance1, 1, pair.t2.decimals)
							console.log('pair.t2.symbol', pair.t2.symbol)
							if (parseSymbolWKAI(pair.t2.symbol) === 'KAI') {
								const bnPartialValue = new BigNumber(partialValue)
								const ONE_KAI = new BigNumber(10 ** 18)
								// const bn110KAI = new BigNumber(10 ** (tokenTo.decimals))
								const bn110KAI = new BigNumber(partialValue).multipliedBy(new BigNumber(0.1))
								if (bnPartialValue.isGreaterThan(ONE_KAI)) {
									partialValue = bnPartialValue.minus(new BigNumber(10 ** 16)).toFixed(pair.t2.decimals, 1)
								} else {
									partialValue = bnPartialValue.minus(bn110KAI).toFixed(pair.t2.decimals, 1)
								}
							}
							setToken1(formatNumberString(parseDecimals(partialValue, pair.t2.decimals), pair.t2.decimals))
						}} 
					/>
				</View>
			</View>
			<View
				style={{
					paddingVertical: 8,
					paddingHorizontal: 16,
					marginVertical: 24,
					backgroundColor: theme.backgroundStrongColor,
					borderRadius: 8
				}}
			>
				<CustomText style={{color: theme.mutedTextColor}}>
					<CustomText style={{color: theme.textColor}}>1</CustomText>{' '}
					{parseSymbolWKAI(pair.t1.symbol)}{' '}
					= <CustomText style={{color: theme.textColor}}>{getPrice()}</CustomText> {parseSymbolWKAI(pair.t2.symbol)}
				</CustomText>
			</View>
			
			<TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%'}} onPress={() => setShowTxSettingModal(true)}>
				<Image style={{width: 16, height: 16, marginRight: 4}} source={require('../../../assets/icon/setting_dark.png')} />
				<CustomText style={{color: theme.textColor}}>{getLanguageString(language, 'TX_SETTING')}</CustomText>
			</TouchableOpacity>
			<Divider height={0.5} style={{width: '100%', backgroundColor: 'rgba(96, 99, 108, 1)', height: 2}} />
			<Button
				title={getLanguageString(language, 'CANCEL')}
				disabled={submitting}
				onPress={onClose}
				type="outline"
				style={{width: '100%', marginBottom: 12}}
				textStyle={{
					fontWeight: '500',
					fontFamily: Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined
				}}
			/>
			<Button
				title={getLanguageString(language, 'SUBMIT')}
				loading={submitting}
				disabled={submitting}
				onPress={handleAddLP}
				textStyle={{
					fontWeight: '500',
					fontFamily: Platform.OS === 'android' ? 'WorkSans-SemiBold' : undefined
				}}
			/>
		</CustomModal>
	)
}