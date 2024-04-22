import {useStore} from "~/store";
import {signMessage} from "sats-connect";
import type {SignMessageOptions} from "sats-connect";

export interface LoanData {
  loanIndex: string,
  borrowerAddress: string,
  durationDays: string,
  interestRate: string,
  debtAmount: string,
  colAmount: string,
  colToken: string,
  lenderAddress?: string,
  startDate?: string,
  endDate?: string,
  isLend?: boolean
  isTimeOver?: boolean
}

export interface LoanDataV2 {
  tick1: string,
  amount1: number,
  tick2: string,
  amount2: number,
  inscription: string,
  repayAmount: number,
  offExpiryTime: Date,
  contractExpireTime: Date,
  lenderContractAddr: string,
  lenderAddr: string,
  lenderSig: string,
  borrowerAddr: string,
  borrowerSig: string,
  nonce: number,
  slippage: number,
}

export interface LoanRequestData {
  tokenType: string;
  tokenAmount: number;
  loanAmount: number;
  interestRate: number;
  duration: number;
}

export function shortenWallet(input: string){
  return input.slice(0,6) + '...' +input.slice(input.length -4, input.length);
}

// export const getAssetBalance = async (messageObj: any) => {
//   const store = useStore();
//   const { walletAddress, NETWORK_INFO } = store;
//   console.log("Wallet Address: ", walletAddress)
//   console.log("URL: ", `${NETWORK_INFO.BISON_API_URL}/asset_endpoint/balance`)
//
//   // const balanceResponse = await fetch(`${NETWORK_INFO.BISON_API_URL}/asset_endpoint/balance`, {
//   //   method: "POST",
//   //   headers: {
//   //     "Content-Type": "application/json",
//   //   },
//   //   body: JSON.stringify(messageObj),
//   // });
//
//   const balanceResponse = await useFetch(`/test_api/asset_endpoint/balance`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       "address": "tb1pe0jhwxs6yc40u7mu782ccwd0j8u82rc9k98ljvz78c0egpxgnfesaxltdu"
//     }),
//   });
//   console.log(balanceResponse)
//   console.log(balanceResponse.data)
//   console.log(balanceResponse.data.value)
//   console.log(Object.keys(balanceResponse.data.value))
//
//   let resInfo:any = {}
//   // @ts-ignore
//   Object.keys(balanceResponse.data.value).forEach(async (key) => {
//     // @ts-ignore
//     resInfo[key] = balanceResponse.data.value[key];
//   });
//   console.log(resInfo)
//
//   return resInfo
//   // const balanceRaw = await balanceResponse.json();
//   // console.log('Balance Raw: ', balanceRaw)
//
// }

export const queryPOST = async(messageObj: any, url:string) => {
  const store = useStore();
  const { walletAddress, NETWORK_INFO } = store;
  console.log('\t\t\t\t queryPOST Wallet: ', walletAddress, `${NETWORK_INFO.BISON_API_URL}${url}`)
  console.log('\t\t\t\t queryPOST URL: ', `${NETWORK_INFO.BISON_API_URL}${url}`)
  console.log('\t\t\t\t queryPOST Msg: ', messageObj)

  const response = await fetch(`${NETWORK_INFO.BISON_API_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageObj),
  });

  console.log('\t\t\t\t queryPOST Result: ', response)

}

export const signMessageAndEnqueueTransactionV2 = async (messageObj: any, targetSig: string) => {
  const store = useStore();
  const { walletAddress, NETWORK_INFO } = store;

  // 获取 nonce
  const nonceResponse = await fetch(`${NETWORK_INFO.BISON_API_URL}/sequencer_endpoint/nonce/${walletAddress?.ordinalsAddress}`);
  const nonceData = await nonceResponse.json();

  messageObj.nonce = nonceData.nonce + 1;

  const gasResponse = await fetch(`${NETWORK_INFO.BISON_API_URL}/sequencer_endpoint/gas_meter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageObj),
  });
  const gasData = await gasResponse.json();

  // 更新messageObj以包含gas数据
  messageObj.gas_estimated = gasData.gas_estimated;
  messageObj.gas_estimated_hash = gasData.gas_estimated_hash;

  console.log('\t\t\t\t Final: ', messageObj)

  const signMessageOptions = {
    payload: {
      network: {
        type: NETWORK_INFO.NETWORK,
      },
      address: walletAddress?.ordinalsAddress,
      message: JSON.stringify(messageObj),
    },
    onFinish: (response: string) => {
      messageObj[targetSig] = response;
      console.log('\t\t\t\t Final Sig: ', targetSig, response)

      //TODO 이거하면 진짜 나감
      onSendMessageClick(messageObj);
    },
    onCancel: () => alert("Canceled"),
  };

  await signMessage(<SignMessageOptions>signMessageOptions);
}

export const signMessageAndEnqueueTransaction = async (messageObj: any) => {
  const store = useStore();
  const { walletAddress, NETWORK_INFO } = store;


  // console.log(selectedTransferToken)
  // // 从contracts数组中找到与selectedTransferToken匹配的合约
  // const selectedContract = contracts.find(contract => contract.tick === selectedTransferToken);
  // if (!selectedContract) {
  //   console.error('No contract found for the selected token.');
  //   return;
  // }

  // if (NETWORK_INFO.NETWORK != 'Testnet' && walletAddress?.ordinalsAddress.startsWith('bc1p')){
  // }else if (NETWORK_INFO.NETWORK == 'Testnet' && walletAddress?.ordinalsAddress.startsWith('tb1q')){
  // }else{
  //   alert("receipt address must be ordinals address!");
  //   return;
  // }

  // 获取 nonce
  const nonceResponse = await fetch(`${NETWORK_INFO.BISON_API_URL}/sequencer_endpoint/nonce/${walletAddress?.ordinalsAddress}`);
  const nonceData = await nonceResponse.json();

  messageObj.nonce = nonceData.nonce + 1;

  const gasResponse = await fetch(`${NETWORK_INFO.BISON_API_URL}/sequencer_endpoint/gas_meter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageObj),
  });
  const gasData = await gasResponse.json();

  // 更新messageObj以包含gas数据
  messageObj.gas_estimated = gasData.gas_estimated;
  messageObj.gas_estimated_hash = gasData.gas_estimated_hash;

  console.log('\t\t\t\t Final: ', messageObj)

  const signMessageOptions = {
    payload: {
      network: {
        type: NETWORK_INFO.NETWORK,
      },
      address: walletAddress?.ordinalsAddress,
      message: JSON.stringify(messageObj),
    },
    onFinish: (response: string) => {
      messageObj.sig = response;
      //TODO 이거하면 진짜 나감
      // onSendMessageClick(messageObj);
    },
    onCancel: () => alert("Canceled"),
  };

  await signMessage(<SignMessageOptions>signMessageOptions);
}

const onSendMessageClick = async (signedMessage: any) => {
  const store = useStore();
  const { NETWORK_INFO } = store;

  // Make a HTTP POST request to /enqueue_transaction
  await fetch(`${NETWORK_INFO.BISON_API_URL}/sequencer_endpoint/enqueue_transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signedMessage),
  })
    .then(response => response.json())
    .then(data => {
      alert(JSON.stringify(data));
      store.updateBalance();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

export const fetchContracts = async () => {
  const store = useStore();
  const { NETWORK_INFO } = store;

  const response = await fetch(`${NETWORK_INFO.BISON_API_URL}/sequencer_endpoint/contracts_list`);
  const data = await response.json();

  // Filter contracts that are of type "Token"
  // @ts-ignore
  const tokenContracts = data.contracts.filter(contract => contract.contractType === "Token");

  // Filter contracts that are of type "SWAP"
  // @ts-ignore
  const swapContractsFiltered = data.contracts.filter(contract => contract.contractType === "SWAP");
  // Fetch the balance for each token contract

  return {
    tokenContracts, swapContractsFiltered
  }
}


export const fetchBalanceForContract = async (contract: any) => {
  try{

  const store = useStore();
  const { walletAddress } = store;

  if(!walletAddress) return;
  const url = `${contract.contractEndpoint}/balance`;
  console.log(`fetchBalanceForContract, ${url}`)

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address: walletAddress.ordinalsAddress }),
  });
  const responseJson = await response.json();
  // console.log(responseJson);
  // console.log({[contract.tick]: responseJson.balance})
  // setTokenBalances(prevTokenBalances => ({
  //   ...prevTokenBalances,
  //   [contract.tick]: data.balance
  // }));
  return responseJson.balance;
  }catch (e) {
    console.log(e);
    return ''
  }
}
