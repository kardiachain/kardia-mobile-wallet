import KaidexClient from 'kaidex-sdk';
import KardiaClient from 'kardia-js-sdk';
import SWAPABI from './swapABI.json'
import { BLOCK_TIME, KAI_TOKEN_NAME, KAI_TOKEN_SYMBOL } from '../../config';
import { DEX_ENDPOINT, RPC_ENDPOINT } from '../config';
import KRC20ABI from '../krc20/KRC20ABI.json';
// import { cellValueWithDecimals } from '../../utils/number';
import { requestWithTimeOut } from '../util';
import BigNumber from 'bignumber.js';
import { getDeltaTimestamps } from '../../utils/date';
import { apolloKaiBlockClient, apolloKaiDexClient } from './apolloClient';
import { GET_BLOCKS_BY_TIMESTAMPS, PAIR_LIST_BY_BLOCK_NUMBER } from './queries';

let SWAP_ROUTER_SMC = ''
let FACTORY_SMC = ''
let WKAI_SMC = ''
let LIMIT_ORDER_SMC = ''

let reserve: Record<string, any> = {}

export const initDexConfig = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  const response: any = await requestWithTimeOut(
    fetch(
      `${DEX_ENDPOINT}cfg/info`,
      requestOptions,
    ),
    50 * 1000,
  );
  
  const responseJSON = await response.json();

  SWAP_ROUTER_SMC = responseJSON.data.router_smc
  FACTORY_SMC = responseJSON.data.factory_smc
  WKAI_SMC = responseJSON.data.wkai_smc
  LIMIT_ORDER_SMC = responseJSON.data.settlement_smc
}

export const calculateDexExchangeRate = async (
  tokenFrom: PairToken,
  tokenTo: PairToken,
) => {
  try {
    const client = new KaidexClient({
      rpcEndpoint: RPC_ENDPOINT,
      smcAddresses: {
        router: SWAP_ROUTER_SMC,
        factory: FACTORY_SMC,
        // kaiSwapper?: string;
        limitOrder: LIMIT_ORDER_SMC,
        wkai: WKAI_SMC
      }
    })
  
    const rate = await client.calculateExchangeRate({
      tokenAddress: tokenFrom.hash,
      decimals: tokenFrom.decimals,
      name: tokenFrom.name,
      symbol: tokenFrom.symbol
    }, {
      tokenAddress: tokenTo.hash,
      decimals: tokenTo.decimals,
      name: tokenTo.name,
      symbol: tokenTo.symbol
    })
    return rate 
  } catch (error) {
    console.log(error)
    return {
      rateAB: 1,
      rateBA: 1
    }
  }
}

const getReserve = async (tokenInAddress: string, tokenOutAddress: string) => {
  const key = `${tokenInAddress}-${tokenOutAddress}`
  const reverseKey = `${tokenOutAddress}-${tokenInAddress}`

  if (reserve[key] && (reserve[key].lastUpdated > Date.now() - BLOCK_TIME * 1000)) {
    return reserve[key].reserve
  }

  const client = new KaidexClient({
    rpcEndpoint: RPC_ENDPOINT,
    smcAddresses: {
      router: SWAP_ROUTER_SMC,
      factory: FACTORY_SMC,
      // kaiSwapper?: string;
      limitOrder: LIMIT_ORDER_SMC,
      wkai: WKAI_SMC
    }
  })

  const {reserveA: reserveIn, reserveB: reserveOut} = await client.getReserves(tokenInAddress, tokenOutAddress)
  reserve[key] = {
    lastUpdated: Date.now(),
    reserve: {
      reserveIn,
      reserveOut
    }
  }
  reserve[reverseKey] = {
    lastUpdated: Date.now(),
    reserve: {
      reserveIn: reserveOut,
      reserveOut: reserveIn
    }
  }

  return {
    reserveIn,
    reserveOut
  }
};

export const calculateDexAmountOut = async (
  amount: number | string,
  tradeInputType: 'AMOUNT' | 'TOTAL',
  tokenFrom: PairToken,
  tokenTo: PairToken
) => {
  try {
    const client = new KaidexClient({
      rpcEndpoint: RPC_ENDPOINT,
      smcAddresses: {
        router: SWAP_ROUTER_SMC,
        factory: FACTORY_SMC,
        // kaiSwapper?: string;
        limitOrder: LIMIT_ORDER_SMC,
        wkai: WKAI_SMC
      }
    })

    const {reserveIn, reserveOut} = await getReserve(tokenFrom.hash, tokenTo.hash)
  
    const rs = client.calculateOutputAmount({
      amount: amount,
      inputType: tradeInputType === "AMOUNT" ? 0 : 1,
      inputToken: {
        tokenAddress: tokenFrom.hash,
        decimals: tokenFrom.decimals,
        name: tokenFrom.name,
        symbol: tokenFrom.symbol
      },
      reserveIn,
      outputToken: {
        tokenAddress: tokenTo.hash,
        decimals: tokenTo.decimals,
        name: tokenTo.name,
        symbol: tokenTo.symbol
      },
      reserveOut
    })

    return rs
  } catch (error) {
    console.log(error)
    if (error.message === 'invalid opcode: opcode 0xfe not defined') {
      return '-1'
    }
    return '1'
  }
}

export const formatDexToken = (token: PairToken, wallet: Wallet) => {
  const client = new KaidexClient({
    rpcEndpoint: RPC_ENDPOINT,
    smcAddresses: {
      router: SWAP_ROUTER_SMC,
      factory: FACTORY_SMC,
      // kaiSwapper?: string;
      limitOrder: LIMIT_ORDER_SMC,
      wkai: WKAI_SMC
    }
  })

    return client.isKAI(token.hash) ? {
    ...token,
    tokenAddress: WKAI_SMC,
    name: KAI_TOKEN_NAME,
    symbol: KAI_TOKEN_SYMBOL,
    logo: token.logo,
    wKAI: true,
    decimals: 18
  } : token
}

export const getApproveState = async (token: PairToken, amount: string | number, wallet: Wallet) => {
  if (amount === '0' || amount === 0) {
    return false
  }
  const client = new KaidexClient({
    rpcEndpoint: RPC_ENDPOINT,
    smcAddresses: {
      router: SWAP_ROUTER_SMC,
      factory: FACTORY_SMC,
      // kaiSwapper?: string;
      limitOrder: LIMIT_ORDER_SMC,
      wkai: WKAI_SMC
    }
  })

  const approveState = await client.getApprovalState({
    tokenAddr: token.hash,
    decimals: token.decimals,
    walletAddress: wallet.address,
    spenderAddress: SWAP_ROUTER_SMC,
    amountToCheck: amount
  })

  return approveState
}

export const approveToken = async (token: PairToken, amount: string | number, wallet: Wallet) => {

  const sdkClient = new KardiaClient({endpoint: RPC_ENDPOINT});
  const smcInstance = sdkClient.contract
 
  smcInstance.updateAbi(KRC20ABI)

  // const cellValue = cellValueWithDecimals(amount, token.decimals)

  const totalSupply = await smcInstance.invokeContract('totalSupply', []).call(token.hash);
  const bnTotalSypply = new BigNumber(totalSupply);

  // const invocation = smcInstance.invokeContract('approve', [SWAP_ROUTER_SMC, `${cellValue}00`]);
  const invocation = smcInstance.invokeContract('approve', [SWAP_ROUTER_SMC, bnTotalSypply.toFixed()]);
  const rs = invocation.send(wallet.privateKey!, token.hash, {}, true)
  
  return rs;
}

const queryBlockNumbers = (timestamp: number[]) => apolloKaiBlockClient.query({query: GET_BLOCKS_BY_TIMESTAMPS(timestamp)})

const getBlock = async (timeStamp: number[]) => {
  const { data: fetchedData } = await queryBlockNumbers(timeStamp)
  const blocks: any[] = []
  try {
      if (fetchedData) {
          for (const t in fetchedData) {
              const item = (fetchedData as any)[t]
              if (item.length > 0) {
                  blocks.push({
                      timestamp: t.split('t')[1],
                      number: item[0]['number'],
                  })
              }
          }
      }
  } catch (error) { }
  return blocks
}

const queryPairsByBlockNumber = (blocks: any[]) => apolloKaiDexClient.query({ query: PAIR_LIST_BY_BLOCK_NUMBER(blocks) })

export const getTotalVolume = async (volumeUSD: string, pairID: string) => {
  const [t24] = getDeltaTimestamps()

  const _24h_blocks = await getBlock([t24])
  const { data: pairsByBlock1 } = await queryPairsByBlockNumber(_24h_blocks)
  const onedayPairs = pairsByBlock1[`t${_24h_blocks[0].timestamp}`]
  const _oneDayPair = onedayPairs && Array.isArray(onedayPairs) ? onedayPairs.filter(item => item.id === pairID)[0] : null

  let volume24hr = _oneDayPair && _oneDayPair.volumeUSD ? parseFloat(volumeUSD) - parseFloat(_oneDayPair.volumeUSD) : parseFloat(volumeUSD)

  return volume24hr
}

export const swapTokens = async (params: Record<string, any>, wallet: Wallet) => {
  const client = new KaidexClient({
    rpcEndpoint: RPC_ENDPOINT,
    smcAddresses: {
      router: SWAP_ROUTER_SMC,
      factory: FACTORY_SMC,
      // kaiSwapper?: string;
      limitOrder: LIMIT_ORDER_SMC,
      wkai: WKAI_SMC
    }
  })
  const parsedParam = client.marketSwapCallParameters(params as any);
  const sdkClient = new KardiaClient({endpoint: RPC_ENDPOINT});
  const smcInstance = sdkClient.contract
  smcInstance.updateAbi(SWAPABI)
  const invocation = smcInstance.invokeContract(parsedParam.methodName, parsedParam.args);
  
  const rs = await invocation.send(wallet.privateKey!, SWAP_ROUTER_SMC, {
    amount: parsedParam.amount || 0
  })

  return rs
};

export const calculateTransactionDeadline = async (txDeadlineInMinute: string): Promise<number> => {
  const sdkClient = new KardiaClient({endpoint: RPC_ENDPOINT});
  const latestBlock = await sdkClient.kaiChain.getBlockHeaderByHash('latest')
  return (new Date(latestBlock.time)).getTime() + Number(txDeadlineInMinute) * 60 * 1000;
} 

export const calculatePriceImpact = async (tokenFrom: PairToken, tokenTo: PairToken, amountIn: string, amountOut: string) => {
  const client = new KaidexClient({
    rpcEndpoint: RPC_ENDPOINT,
    smcAddresses: {
      router: SWAP_ROUTER_SMC,
      factory: FACTORY_SMC,
      // kaiSwapper?: string;
      limitOrder: LIMIT_ORDER_SMC,
      wkai: WKAI_SMC
    }
  })

  const priceImpact = await client.calculatePriceImpact({
    inputToken: {
      tokenAddress: tokenFrom.hash,
      name: tokenFrom.name,
      symbol: tokenFrom.symbol,
      decimals: tokenFrom.decimals
    },
    outputToken: {
      tokenAddress: tokenTo.hash,
      name: tokenTo.name,
      symbol: tokenTo.symbol,
      decimals: tokenTo.decimals
    },
    amountIn,
    amountOut
  })

  return priceImpact
}