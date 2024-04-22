<template>
  <v-container >
    <div class="flex-col">
      <div class="text-5xl pt-10 pb-5 font-bold">Receive loan</div>
      <div class="text-2xl pb-10 font-bold">Choose the Ordinals token you would like to receive Loan on. </div>
    </div>
    <v-tabs
        v-model="activeTab"
        show-arrows
        class="mb-5"
    >
      <v-tab
          v-for="tabItem in tabs"
          :key="tabItem.name"
          :value="tabItem.name"
          @click="goToPage(tabItem.to)"
          size="large"
      >
        {{tabItem.label}}
      </v-tab >
    </v-tabs>
    <v-row >
      <v-col v-for="item in loanItems"
             sm="12"
             lg="6"
             xl="4">
        <NFTItem :loan-index="item.loanIndex" :duration-days="item.durationDays"
          :interest-rate="item.interestRate" :debt-amount="item.debtAmount"
          :col-amount="item.colAmount" :col-token="item.colToken" :sat-ordinal="item.satOrdinal"
          :start-date="item.startDate" :end-date="item.endDate" :is-lend="item.isLend" :type="item.type"
          :borrower-address="item.borrowerAddress" :lender-address="item.lenderAddress" :is-time-over="item?.isTimeOver"></NFTItem>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import LoanItem from "~/components/LoanItem.vue";
import type {LoanData} from "~/utils";
import axios from "axios";

const store = useStore();

const {walletAddress} = storeToRefs(store);

import {shortenWallet} from "~/utils";
import {useStore} from "~/store";

const router = useRouter();

const tabs = [
  { name: 'newLoan', label: 'Receive a new Loan', to: '/borrow/assets'},
  { name: 'loansGiven', label: 'My Loans', to: '/borrow/loans'},
];
const activeTab = ref(tabs[0].name); // Default to the first tab

const loanItems = ref<any[]>([
  {
    loanIndex: '1',
    borrowerAddress: '0x00...123',
    durationDays: '14',
    interestRate: '10',
    debtAmount: '1',
    colAmount: '100',
    colToken: 'ORDI',
    lenderAddress: '',
    startDate: '',
    endDate: '',
    isLend: false
  },{
    loanIndex: '3',
    borrowerAddress: '0x00...123',
    durationDays: '14',
    interestRate: '10',
    debtAmount: '1',
    colAmount: '100',
    colToken: 'ORDI',
    lenderAddress: '0x00...234',
    startDate: '2024-02-01',
    endDate: '2024-02-14',
    isLend: false
  },{
    loanIndex: '4',
    borrowerAddress: '0x00...123',
    durationDays: '14',
    interestRate: '10',
    debtAmount: '1',
    colAmount: '100',
    colToken: 'ORDI',
    lenderAddress: '0x00...234',
    startDate: '2024-02-01',
    endDate: '2024-02-14',
    isLend: true
  },]);

onMounted(async () => {
  // const web3 = createWeb3Instance();
  // const accounts = await web3.eth.getAccounts();
  // console.log(accounts[0]); // 사용자의 계정 주소 출력
  // web3Manager = new Web3Manager(web3, config);
  // // vaultManager = new VaultManager(web3, config.public.vaultContract, config.public.zusdContract);
  // web3Manager.getCurrentEpoch().then((epoch) => {
  //   currentEpoch.value = epoch;
  // });
  //
  // const zUSDSupply = await web3Manager.zUSDTotalSupply();
  // currentTotalSupply.value = new BigNumber(zUSDSupply).dividedBy(10**ZUSD_DECIMAL).toFixed(3);
  // currentTotalAsset.value = new BigNumber(zUSDSupply).dividedBy(10**ZUSD_DECIMAL).multipliedBy(1.0 + Math.random() * 0.05).toFixed(3);
  // Here you will call the getCurrentEpoch function and assign the result to currentEpoch value
  {
    // hiro api /
    // let config = {
    //   method: 'get',
    //   maxBodyLength: Infinity,
    //   url: `https://api.hiro.so/ordinals/v1/inscriptions?address=bc1pjhkwutq5ugupqn780e98semgthj7887l5p43ex3p7747c87vgvvs4539v8&limit=20`,
    //   headers: {
    //     'Accept': 'application/json'
    //   }
    // };
    // const response = await axios.request(config);
    const response = {
      data: {
        "limit": 20, "offset": 0, "total": 3, "results": [{
          "id": "3b3240b300763dada14127d2e9bad7db4746caff71cd8f59bd4216eb151cfa2ci0",
          "number": 61093263,
          "address": "bc1pjhkwutq5ugupqn780e98semgthj7887l5p43ex3p7747c87vgvvs4539v8",
          "genesis_address": "bc1pjhkwutq5ugupqn780e98semgthj7887l5p43ex3p7747c87vgvvs4539v8",
          "genesis_block_height": 831008,
          "genesis_block_hash": "00000000000000000002f198233e4ca84866fcfbcab10541b57414b4805fc2d3",
          "genesis_tx_id": "3b3240b300763dada14127d2e9bad7db4746caff71cd8f59bd4216eb151cfa2c",
          "genesis_fee": "2896",
          "genesis_timestamp": 1708273066000,
          "tx_id": "3b3240b300763dada14127d2e9bad7db4746caff71cd8f59bd4216eb151cfa2c",
          "location": "3b3240b300763dada14127d2e9bad7db4746caff71cd8f59bd4216eb151cfa2c:0:0",
          "output": "3b3240b300763dada14127d2e9bad7db4746caff71cd8f59bd4216eb151cfa2c:0",
          "value": "546",
          "offset": "0",
          "sat_ordinal": "866681922827017",
          "sat_rarity": "common",
          "sat_coinbase_height": 173336,
          "mime_type": "text/plain",
          "content_type": "text/plain;charset=utf-8",
          "content_length": 51,
          "timestamp": 1708273066000,
          "curse_type": null,
          "recursive": false,
          "recursion_refs": null
        }, {
          "id": "cedd8ef7bc7eb01b7ef46200bf2cf3a70207072b9ac3b1500a16b71bca0d7b0ai0",
          "number": 61087842,
          "address": "bc1pjhkwutq5ugupqn780e98semgthj7887l5p43ex3p7747c87vgvvs4539v8",
          "genesis_address": "bc1pjhkwutq5ugupqn780e98semgthj7887l5p43ex3p7747c87vgvvs4539v8",
          "genesis_block_height": 831003,
          "genesis_block_hash": "00000000000000000002f23559d46afb2bceff111af5e5cc08c738b44187318a",
          "genesis_tx_id": "cedd8ef7bc7eb01b7ef46200bf2cf3a70207072b9ac3b1500a16b71bca0d7b0a",
          "genesis_fee": "3660",
          "genesis_timestamp": 1708268225000,
          "tx_id": "cedd8ef7bc7eb01b7ef46200bf2cf3a70207072b9ac3b1500a16b71bca0d7b0a",
          "location": "cedd8ef7bc7eb01b7ef46200bf2cf3a70207072b9ac3b1500a16b71bca0d7b0a:0:0",
          "output": "cedd8ef7bc7eb01b7ef46200bf2cf3a70207072b9ac3b1500a16b71bca0d7b0a:0",
          "value": "546",
          "offset": "0",
          "sat_ordinal": "866681922832017",
          "sat_rarity": "common",
          "sat_coinbase_height": 173336,
          "mime_type": "text/plain",
          "content_type": "text/plain;charset=utf-8",
          "content_length": 58,
          "timestamp": 1708268225000,
          "curse_type": null,
          "recursive": false,
          "recursion_refs": null
        }, {
          "id": "4d8681364c742af25c82d7adfd8d83f9691b683cf0818b157d0c4a8ede32a789i0",
          "number": 61086361,
          "address": "bc1pjhkwutq5ugupqn780e98semgthj7887l5p43ex3p7747c87vgvvs4539v8",
          "genesis_address": "bc1pjhkwutq5ugupqn780e98semgthj7887l5p43ex3p7747c87vgvvs4539v8",
          "genesis_block_height": 831002,
          "genesis_block_hash": "0000000000000000000204a59e6173eb603cbea3751f692673a5ee10d9abc948",
          "genesis_tx_id": "4d8681364c742af25c82d7adfd8d83f9691b683cf0818b157d0c4a8ede32a789",
          "genesis_fee": "3230",
          "genesis_timestamp": 1708266509000,
          "tx_id": "4d8681364c742af25c82d7adfd8d83f9691b683cf0818b157d0c4a8ede32a789",
          "location": "4d8681364c742af25c82d7adfd8d83f9691b683cf0818b157d0c4a8ede32a789:0:0",
          "output": "4d8681364c742af25c82d7adfd8d83f9691b683cf0818b157d0c4a8ede32a789:0",
          "value": "546",
          "offset": "0",
          "sat_ordinal": "866681922822017",
          "sat_rarity": "common",
          "sat_coinbase_height": 173336,
          "mime_type": "text/plain",
          "content_type": "text/plain;charset=utf-8",
          "content_length": 4,
          "timestamp": 1708266509000,
          "curse_type": null,
          "recursive": false,
          "recursion_refs": null
        }]
      }
    }
    // console.log(JSON.stringify(response.data));
    const myNFTS = response.data.results;
    const tempNFTItems = [];
    for (const myNFT of myNFTS) {
      tempNFTItems.push({
        loanIndex: myNFT.number,
        borrowerAddress: shortenWallet(myNFT.id),
        satOrdinal: myNFT.sat_ordinal,
        type: myNFT.mime_type,
        interestRate: '10',
        debtAmount: '1',
        colAmount: '100',
        colToken: 'ORDI',
        lenderAddress: '0x00...234',
        startDate: '2024-02-01',
        endDate: '2024-02-14',
        isLend: true
      })
    }
    loanItems.value = tempNFTItems;
  }
  {
    const data = await axios.get('/api/collections')
    console.log('get okxdata', data)
  }
  {
    const { body } = await axios.post('/api/bids', {
      // UserAddress: walletAddress.value,
      UserAddress: 'TEST ADDRESS',
      Slug: 'TEST_SLUG',
      InputAmount: 10,
      InputPrice: 10000,
      BlockNumber: 100000000,
      SignHash: 'TEST HASH',
      SignMessage: 'TEST MESSAGE',
      Action: 'BID',
    })
    console.log(body);
  }
  {
    const data = await axios.get('/api/bids')
    console.log('get all bid', data)
  }
  {
    const data = await axios.get('/api/bids/TEST_SLUG')
    console.log('get slug bids', data)
  }
});

const goToPage = (path:string) => {
  router.push({
    path: path
  })};
</script>

<style scoped>

</style>
