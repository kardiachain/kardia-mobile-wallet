interface Transaction {
  from: string;
  to: string;
  hash: string;
  amount: number | string;
  date: Date;
  fee?: number | string;
  blockHash?: string;
  blockNumber?: number;
  status?: number;
  gasPrice?: number;
  gas?: number;
  gasUsed?: number;
  gasLimit?: number;
  toName?: string;
  decodedInputData?: {
    function: string;
    methodID: string;
    methodName: string;
    arguments: Record<string, any>
  }
}

interface KRC20Transaction {
  address: string;
  methodName: string;
  argumentsName: string;
  // arguments: {
  //   from: string;
  //   to: string;
  //   value: string;
  // };
  from: string;
  to: string;
  value: string;
  topics: string[];
  data: string;
  blockHeight: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  logIndex: number;
  removed: boolean;
  time: string;
  logo: string;
  decimals: number;
  tokenName: string;
  tokenType: string;
  tokenSymbol: string;
  totalSupply: string;
  status: number;
  date: Date;
  type: 'IN' | 'OUT';
}
