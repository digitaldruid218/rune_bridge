<template>

  <v-container >
    <div class="flex-col ">
      <div class="text-5xl pt-10 pb-5 font-bold">Lend</div>
<!--      <div class="text-2xl pb-10 font-bold">Offer loans to other users on their BRC-20 tokens.</div>-->
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
      <v-col v-for="item in loanItems2"
             sm="12"
             lg="6"
             xl="4">
<!--        <LoanItem :loan-index="item.loanIndex" :duration-days="item.durationDays"-->
<!--                  :interest-rate="item.interestRate" :debt-amount="item.debtAmount"-->
<!--                  :col-amount="item.colAmount" :col-token="item.colToken"-->
<!--                  :start-date="item.startDate" :end-date="item.endDate" :is-lend="item.isLend"-->
<!--                  :borrower-address="item.borrowerAddress" :lender-address="item.lenderAddress" :is-time-over="item?.isTimeOver"></LoanItem>-->
        <LoanItem :loanIndex="item.loanIndex"
                  :lenderAddr="item.lenderAddr"
                  :debtToken="item.tick1"
                  :debtAmount="item.amount1"
                  :debtDecimal="item.decimal1"
                  :debtRepayAmount="item.repayAmount"

                  :colToken="item.tick2"
                  :colAmount="item.amount2"
                  :colDecimal="item.decimal2"
                  :colInscription="item.inscription"

                  :offExpiryTime="item.offExpiryTime"
                  :contractExpireTime="item.contractExpireTime"

                  :slippage="item.slippage">
        </LoanItem>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoanItem from "~/components/LoanItem.vue";
import type {LoanData, LoanDataV2} from "~/utils";
import {useStore} from "~/store";
import {queryPOST, signMessageAndEnqueueTransaction} from "~/utils";
const router = useRouter();

const tabs = [
  { name: 'newBRC20Loan', label: 'Offer BRC20 Loan', to: '/lend/offer_brc20'},
  { name: 'newOrdiNFTLoan', label: 'Offer Ordinals NFT Loan', to: '/lend/offer_ordi_nft'},
  { name: 'loansGiven', label: 'MY Offered Loans', to: '/lend/loans'},
];
const activeTab = ref(tabs[2].name); // Default to the first tab

const loanItems = ref<LoanData[]>([
  {
    loanIndex: '5',
    borrowerAddress: '0x00...123',
    durationDays: '14',
    interestRate: '10',
    debtAmount: '1',
    colAmount: '100',
    colToken: 'ORDI',
    lenderAddress: '0x00...234',
    startDate: '2024-02-01',
    endDate: '2024-02-14',
    isLend: true,
    isTimeOver: true
  }, {
    loanIndex: '9',
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
  }, {
    loanIndex: '10',
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
  }, {
    loanIndex: '11',
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

const loanItems2 = ref<LoanDataV2[]>([
  {
    loanIndex: '1',
    tick1: 'btc',               // borrowed coin (only BTC)
    amount1: 0.001,
    decimal1: 8,
    tick2: 'ordi',              // BRC20: symbol, inscription: 'inscription'
    amount2: 100000,
    decimal2: 8,
    inscription: '',            // BRC20: '', inscription: hash
    repayAmount: 0.0015,        // amount1 (principal) + interest
    offExpiryTime: new Date(2024, 3, 1),
    contractExpireTime: new Date(2024, 4, 1), // Contract Duration: min(contractExpireTime - offExpiryTime) ~ max(contractExpireTime - CurrentDate_
    // lenderContractAddr: 'tb1p938g8dt7pr5hhty7smf3ykrf5qrd533xa5f7vpdjxf30hlq03aqsv5g2va', // Fixed
    lenderAddr: 'string',
    // lenderSig: string,
    borrowerAddr: '',
    // borrowerSig: string,
    // nonce: number,
    slippage: 0.02,
  },
  {
    loanIndex: '2',
    tick1: 'btc',               // borrowed coin (only BTC)
    amount1: 0.001,
    decimal1: 8,
    tick2: 'ordi',              // BRC20: symbol, inscription: 'inscription'
    amount2: 300000,
    decimal2: 8,
    inscription: '',            // BRC20: '', inscription: hash
    repayAmount: 0.0019,        // amount1 (principal) + interest
    offExpiryTime: new Date(2024, 3, 1),
    contractExpireTime: new Date(2024, 6, 1), // Contract Duration: min(contractExpireTime - offExpiryTime) ~ max(contractExpireTime - CurrentDate_
    // lenderContractAddr: 'tb1p938g8dt7pr5hhty7smf3ykrf5qrd533xa5f7vpdjxf30hlq03aqsv5g2va', // Fixed
    lenderAddr: 'string',
    // lenderSig: string,
    borrowerAddr: '',
    // borrowerSig: string,
    // nonce: number,
    slippage: 0.05,
  },
])

onMounted(async () => {

  const store = useStore();
  const { walletAddress, tokenBalances } = store;
  if(walletAddress?.ordinalsAddress=== '' || walletAddress?.ordinalsAddress=== undefined){
    alert("Please Connect Wallet");
  }
  else {
    const results = await queryPOST(
        {
          "type": "lender",
          "rAddr": walletAddress?.ordinalsAddress
        },
        "/lend_endpoint/lend_list"
    );

    console.log(results)
  }

});

const goToPage = (path:string) => {
  router.push({
    path: path
  })};

</script>

<style scoped>

</style>
