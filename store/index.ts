import {defineStore} from 'pinia'
import {fetchBalanceForContract, fetchContracts} from "~/utils";
import {da} from "vuetify/locale";

interface Addresses {
  ordinalsAddress: string,
  ordinalsPublicKey: string,
  payAddress: string,
  payPublicKey: string,
}
interface AppState {
  walletAddress: Addresses | null,
  Balance_Ethereum: string,
  Balance_ZeUSD: string,
  Balance_Escrow: string,
  NETWORK_TYPE: number,
  tokenBalances: Map<string, string>,
  tokenContracts: any[],
  swapContracts: any[],
}
interface NetworkInfo {
  NETWORK: string,
  BISON_API_URL: string,
  CORS_URL: string
}
export const useStore = defineStore('main', {
  state: () : AppState => ({
    walletAddress: null,
    Balance_Ethereum: '',
    Balance_ZeUSD: '',
    Balance_Escrow: '',
    NETWORK_TYPE: 2,
    tokenBalances: new Map<string,string>,
    tokenContracts: [],
    swapContracts: [],
  }),
  getters: {
    NETWORK_INFO: (state): NetworkInfo => {
      switch (state.NETWORK_TYPE) {
        case 1:
          return {
            NETWORK: 'Mainnet',
            BISON_API_URL: 'https://app.bisonlabs.io',
            CORS_URL: '/main_api'
          };
        case 2:
          return {
            NETWORK: 'Testnet',
            BISON_API_URL: 'https://testnet.bisonlabs.io',
            CORS_URL: '/test_api'
          };
        default:
          return {
            NETWORK: 'Mainnet',
            BISON_API_URL: 'https://app.bisonlabs.io',
            CORS_URL: '/main_api'
          };
      }
    },
  },
  actions: {
    async setWalletAddress(walletAddress: Addresses) {
      // console.log('yoman2', walletAddress);
      this.walletAddress = walletAddress;
      // console.log('yoman3', this.walletAddress,this.tokenContracts);

      if(this.walletAddress) {
        if(this.tokenContracts.length != 0) {
          // console.log('yoman4', this.walletAddress,this.tokenContracts);
          await this.updateBalance();
        }else {
          // console.log('yoman5', this.walletAddress,this.tokenContracts);
          await this.setContractAddresses();
          await this.updateBalance();
        }
      }
    },
    async setContractAddresses() {
      const data = await fetchContracts();
      // console.log('setContractAddresses', data);
      this.tokenContracts = data.tokenContracts;
      this.swapContracts = data.swapContractsFiltered;
    },
    async updateBalance() {
      if (typeof window === 'undefined') return;
      for (let contract of this.tokenContracts) {
        // @ts-ignore
        this.tokenBalances[contract.tick] = await fetchBalanceForContract(contract);
      }
      console.log(this.tokenBalances);
    },
  },
})
