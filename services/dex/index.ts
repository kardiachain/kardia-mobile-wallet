import KaidexClient from 'kaidex-sdk';
import KardiaClient from 'kardia-js-sdk';
import SWAPABI from './swapABI.json'
import { FACTORY_SMC, LIMIT_ORDER_SMC, SWAP_ROUTER_SMC, WKAI_SMC } from '../../config';
import { RPC_ENDPOINT } from '../config';
import KRC20ABI from '../krc20/KRC20ABI.json';
import { cellValueWithDecimals } from '../../utils/number';

export const calculateDexExchangeRate = async (
  tokenFrom: PairToken,
  tokenTo: PairToken,
  wallet: Wallet
) => {
  try {
    const client = new KaidexClient({
      rpcEndpoint: RPC_ENDPOINT,
      account: {
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
      },
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
      decimals: tokenFrom.decimals
    }, {
      tokenAddress: tokenTo.hash,
      decimals: tokenTo.decimals
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

export const calculateDexAmountOut = async (
  amount: number | string,
  tradeInputType: 'AMOUNT' | 'TOTAL',
  tokenFrom: PairToken,
  tokenTo: PairToken,
  wallet: Wallet
) => {
  try {
    const client = new KaidexClient({
      rpcEndpoint: RPC_ENDPOINT,
      account: {
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
      },
      smcAddresses: {
        router: SWAP_ROUTER_SMC,
        factory: FACTORY_SMC,
        // kaiSwapper?: string;
        limitOrder: LIMIT_ORDER_SMC,
        wkai: WKAI_SMC
      }
    })
  
    const rs = await client.calculateOutputAmount({
      amount: amount,
      inputType: tradeInputType === "AMOUNT" ? 0 : 1,
      tokenIn: {
        tokenAddress: tokenFrom.hash,
        decimals: tokenFrom.decimals
      },
      tokenOut: {
        tokenAddress: tokenTo.hash,
        decimals: tokenTo.decimals
      }
    })
  
    return rs
  } catch (error) {
    console.log(error)
    return '1'
  }
}

export const formatDexToken = (token: PairToken, wallet: Wallet) => {
  const client = new KaidexClient({
    rpcEndpoint: RPC_ENDPOINT,
    account: {
      publicKey: wallet.address,
      privateKey: wallet.privateKey,
    },
    smcAddresses: {
      router: SWAP_ROUTER_SMC,
      factory: FACTORY_SMC,
      // kaiSwapper?: string;
      limitOrder: LIMIT_ORDER_SMC,
      wkai: WKAI_SMC
    }
  })

  return client.prepareTokenFormat({
    ...token,
    tokenAddress: token.hash
  })
}

export const approveToken = async (token: PairToken, amount: string | number, wallet: Wallet) => {

  const sdkClient = new KardiaClient({endpoint: RPC_ENDPOINT});
  const smcInstance = sdkClient.contract

  smcInstance.updateAbi(KRC20ABI)

  const cellValue = cellValueWithDecimals(amount, token.decimals)

  const invocation = smcInstance.invokeContract('approve', [wallet.address, cellValue]);
  const rs = invocation.send(wallet.privateKey!, token.hash)
  
  return rs;
}

export const swapTokens = async (params: Record<string, any>, wallet: Wallet) => {
  const client = new KaidexClient({
    rpcEndpoint: RPC_ENDPOINT,
    account: {
      publicKey: wallet.address,
      privateKey: wallet.privateKey,
    },
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