<template>

  <v-container >
    <div class="flex-col">
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
      <v-col>
        <div style="width: 600px; margin: auto;">
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <label for="tick1">Debt Token (send)</label>
<!--            <input type="text" id="tick1" v-model="loanData.tick1" style="text-align: right;">-->
            <span> {{loanData.tick1}}</span>
          </div>

          <div style="display: flex; justify-content: space-between; width: 100%;">
            <label for="amount1">Debt Amount (send):</label>
            <div style="display: flex;">
              <input type="text" id="debtAmt"  :value="formattedValues.debtAmt" @keyup="formatInput($event, 'debtAmt')" style="text-align: right;">
              <span style="padding-left: 5px"> {{loanData.tick1}}</span>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <label for="amount1" style="padding-left: 10%;"> Balance:</label>
            <div style="display: flex;">
              <button class="inputBtn grey" @click="clickMax" style="padding-left: 5px"> {{ BTCBalance }} {{loanData.tick1}}</button>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; width: 100%;">
            <label for="repayAmount">Interest Amount (receive):</label>
            <div style="display: flex;">
              <input type="text" id="repayAmt"  :value="formattedValues.repayAmt" @keyup="formatInput($event, 'repayAmt')" style="text-align: right;">
              <span style="padding-left: 5px"> {{loanData.tick1}}</span>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; width: 100%;">
            <label for="tick2">BRC20 Token(receive):</label>
<!--            <input type="text" id="tick2" v-model="loanData.tick2" style="text-align: right;">-->
            <select ref="comboBox" @change="handleChange">
              <option v-for="(item, index) in BTC20List" :key="index" :value="item">{{ item }}</option>
            </select>
          </div>

          <div style="display: flex; justify-content: space-between; width: 100%;">
            <label for="amount2">BRC20 Amount(receive):</label>
            <div style="display: flex;">
              <input type="text" id="colAmt"  :value="formattedValues.colAmt" @keyup="formatInput($event, 'colAmt')" style="text-align: right;">
              <span style="padding-left: 5px"> {{loanData.tick2}}</span>
            </div>
          </div>

<!--          <div style="display: flex; justify-content: space-between; width: 100%;">-->
<!--            <label for="inscription">Collateral Inscription:</label>-->
<!--            <input type="text" id="inscription" v-model="loanData.inscription">-->
<!--          </div>-->

          <div style="display: flex; justify-content: space-between; width: 100%;">
            <label for="offExpiryTime">Off Expiry Time:</label>
            <input type="datetime-local" class="bg-transparent" v-model="loanData.offExpiryTime" />
          </div>

          <div style="display: flex; justify-content: space-between; width: 100%;">
            <label for="contractExpireTime">Contract Expire Time:</label>
            <input type="datetime-local" class="bg-transparent" v-model="loanData.contractExpireTime" />
          </div>

<!--          <div style="display: flex; justify-content: space-between; width: 100%;">-->
<!--            <label for="lenderContractAddr">Lender Contract Addr:</label>-->
<!--            <input type="text" id="lenderContractAddr" v-model="loanData.lenderContractAddr">-->
<!--          </div>-->
          <!-- 나머지 필드들도 동일한 방식으로 구성 -->
          <div style="display: flex; justify-content: center; margin: auto;">
            <button class="inputBtn green" @click="clickSubmit">Submit</button>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import Datepicker from 'vue3-datepicker';
import LoanItem from "~/components/LoanItem.vue";
import type {LoanData, LoanDataV2} from "~/utils";
import {useStore} from "~/store";
import {signMessageAndEnqueueTransaction, signMessageAndEnqueueTransactionV2} from "~/utils";
const router = useRouter();

const tabs = [
  { name: 'newBRC20Loan', label: 'Offer BRC20 Loan', to: '/lend/offer_brc20'},
  { name: 'newOrdiNFTLoan', label: 'Offer Ordinals NFT Loan', to: '/lend/offer_ordi_nft'},
  { name: 'loansGiven', label: 'MY Offered Loans', to: '/lend/loans'},
];
const activeTab = ref(tabs[0].name); // Default to the first tab

const loanData = ref<LoanDataV2>({
  tick1: 'btc',
  amount1: null,
  tick2: '',
  amount2: null,
  inscription: '',
  repayAmount: null,
  offExpiryTime: null,
  contractExpireTime: null,
  lenderContractAddr: '',
  lenderAddr: '',
  lenderSig: '',
  borrowerAddr: '',
  borrowerSig: '',
  nonce: null,
  slippage: null,
});

const values = ref({ debtAmt: '0', colAmt: '0', repayAmt: '0' }); // 입력된 값들을 저장하는 객체
const formattedValues = ref({ debtAmt: '0', colAmt: '0', repayAmt: '0' }); // 포맷팅된 값들을 저장하는 객체
const BTCBalance = ref(0);
const BTC20List = ref([]);
const comboBox = ref<HTMLSelectElement | null>(null);

onMounted(() => {

  const store = useStore();
  const { walletAddress, tokenBalances } = store;

  BTCBalance.value = tokenBalances['btc'] / 10 ** 8;
  BTC20List.value= Object.keys(tokenBalances).filter(item => item !== 'btc');
  loanData.value['tick2'] = BTC20List.value[0];

});

// 콤보 박스에서 선택한 값이 변경될 때 호출되는 메소드
const handleChange = () => {
  if (comboBox.value) {
    loanData.value['tick2'] =  comboBox.value.value;
  }
};

const formatInput = async (event: any, inputId: string) => {
  let isLog:boolean = false;

  // 입력된 값에서 숫자만 추출하여 천 단위마다 콤마 추가
  const unformattedValue = event.target.value.replace(/[^\d.]/g, '');
  const parts = unformattedValue.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  values.value[inputId] = parts.join('.');
  formattedValues.value[inputId] = values.value[inputId];
  if(inputId === 'debtAmt'){
    loanData.value['amount1'] = parseFloat(values.value[inputId]);
    if(isLog) console.log('\t INPUT) debtAmt: ', loanData.value['amount1'])
  }
  else if(inputId === 'colAmt'){
    loanData.value['amount2'] = parseFloat(values.value[inputId]);
    if(isLog) console.log('\t INPUT) colAmt: ', loanData.value['amount2'])
  }
  else if(inputId === 'repayAmt'){
    loanData.value['repayAmount'] = parseFloat(values.value[inputId]);
    if(isLog) console.log('\t INPUT) repayAmt: ', loanData.value['repayAmount'])
  }
};

const clickSubmit = async () =>{
  const currentTime = new Date();
  const store = useStore();
  const { walletAddress, tokenBalances } = store;
  console.log(walletAddress?.ordinalsAddress, tokenBalances)

  loanData.value['lenderAddr'] = walletAddress?.ordinalsAddress;
  loanData.value['offExpiryTime'] = typeof(loanData.value['offExpiryTime']) !== "object" ? new Date(loanData.value['offExpiryTime']) : loanData.value['offExpiryTime'];
  loanData.value['contractExpireTime'] = typeof(loanData.value['contractExpireTime']) !== "object"? new Date(loanData.value['contractExpireTime']) : loanData.value['contractExpireTime'];

  console.log('Dictionary Data: '
      , loanData.value['tick1']
      , loanData.value['amount1']
      , loanData.value['repayAmount']
      , loanData.value['tick2']
      , loanData.value['amount2']
      , loanData.value['inscription']
      , loanData.value['offExpiryTime']
      , loanData.value['contractExpireTime']
      , loanData.value['lenderContractAddr']
      , loanData.value['lenderAddr']
  )

  if(loanData.value['lenderAddr'] === '' || loanData.value['lenderAddr'] === undefined){
    alert("Error, Wallet Connect Failed");
  }
  else if(loanData.value['tick1'] !== 'btc'){
    alert("Error, Currently only Bitcoin is available as a debt asset.");
  }
  else if(loanData.value['amount1'] == null){
    alert("Error, Please enter \"Debt Amount\"");
    loanData.value['amount1'] = null;
  }
  else if(loanData.value['amount1'] > tokenBalances['btc'] / 10 ** 8){
    alert("Error, Inefficient Balance at \"Debt Amount\"");
    loanData.value['amount1'] = null;
  }
  else if(loanData.value['amount1'] < 0.00000001){
    alert("Error, \"Debt Amount\" must be bigger than 0.00000001");
    loanData.value['amount1'] = null;
  }
  else if(loanData.value['repayAmount'] == null){
    alert("Error, Please enter \"Interest Amount\"");
    loanData.value['repayAmount'] = null;
  }
  else if(loanData.value['repayAmount'] < 0.00000001){
    alert("Error, \"Interest Amount\" must be bigger than 0.00000001");
    loanData.value['repayAmount'] = null;
  }
  // else if(loanData.value['tick2'] !== 'inscription'){
  //   alert("Error, tick2 is not valid. Try again");
  //   loanData.value['tick2'] = 'inscription';
  // }
  // else if(loanData.value['inscription'] == null || loanData.value['inscription'] === ''){
  //   alert("Error, Please enter \"Collateral Inscription\"");
  //   loanData.value['inscription'] = null;
  // }
  else if(loanData.value['amount2'] == null){
    alert("Error, Please enter \"BRC20 Amount\"");
    loanData.value['amount2'] = null;
  }
  // else if(!Number.isInteger(loanData.value['amount2'])){
  //   alert("Error, \"Collateral Inscription Amount\" must be integer.");
  //   loanData.value['amount2'] = null;
  // }
  else if(loanData.value['offExpiryTime'] == null){
    alert("Error, Please enter \"Off Expiry Time\"");
    // loanData.value['offExpiryTime'] = null;
  }
  else if(currentTime >= loanData.value['offExpiryTime']){
    alert("Error, \"Off Expiry Time\" must be a time later than the current time.");
    // loanData.value['offExpiryTime'] = null;
  }
  else if(loanData.value['contractExpireTime'] == null){
    alert("Error, Please enter \"Contract Expire Time\"");
    // loanData.value['contractExpireTime'] = null;
  }
  else if(currentTime >= loanData.value['contractExpireTime']){
    alert("Error, \"Contract Expire Time\" must be a time later than \"Off Expiry Time\".");
    // loanData.value['contractExpireTime'] = null;
  }
  else {
    alert("Success!")
    loanData.value['repayAmount'] += loanData.value['amount1'];
    console.log('Success Dictionary Data: ', loanData.value)

    await signMessageAndEnqueueTransactionV2(
        {
          "method": "lend_swap",
          "tick1": loanData.value['tick1'],
          "amount1": parseInt((loanData.value['amount1'] * 10 ** 8).toString()),
          "repayAmount": parseInt((loanData.value['repayAmount'] * 10 ** 8).toString()),

          "tick2": loanData.value['tick2'],
          "inscription": '',
          "amount2": parseInt((loanData.value['amount2'] * 10 ** 8).toString()),

          "offExpiryTime": loanData.value['offExpiryTime'].toISOString(),
          "contractExpireTime": loanData.value['contractExpireTime'].toISOString(),

          "lenderContractAddr": "tb1p938g8dt7pr5hhty7smf3ykrf5qrd533xa5f7vpdjxf30hlq03aqsv5g2va",
          "lenderAddr": loanData.value['lenderAddr'],
          "lenderSig": "",
          "borrowerAddr": "",
          "borrowerSig": "",
          "slippage": 0.02
        },
        "lenderSig"
    );
  }

}

const clickMax = async () => {
  const inputId = 'debtAmt';
  const unformattedValue = BTCBalance.value.toString().replace(/[^\d.]/g, '');
  const parts = unformattedValue.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  values.value[inputId] = parts.join('.');
  formattedValues.value[inputId] = values.value[inputId];
  loanData.value['amount1'] = parseFloat(values.value[inputId]);
}

const goToPage = (path:string) => {
  router.push({
    path: path
  })};

</script>

<style scoped>
button.inputBtn {

  border: none;
  color: white;
  padding: 2px 4px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: auto;
  cursor: pointer;
  border-radius: 8px;
  transition-duration: 0.4s;
}

button.grey {
  background-color: #ccc; /* 회색 바탕색 */
  color: #000; /* 검은색 글자색 */
}

button.grey:hover {
  background-color: #999;
}

button.green {
  background-color: #4CAF50;
  color: white;
}

button.green:hover {
  background-color: #45a049;
}
</style>
