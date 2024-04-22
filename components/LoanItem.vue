<script setup lang="ts">

import InfoComponent from "~/components/minimal/InfoComponent.vue";
import {signMessageAndEnqueueTransaction, queryPOST} from "~/utils";
import {useStore} from "~/store";
const store = useStore();
const {walletAddress} = storeToRefs(store);
const props = defineProps({
  loanIndex: {
    type: String,
    required: true,
  },
  lenderAddr: {
    type: String,
    required: true,
  },

  debtToken: {
    type: String,
    required: true,
  },
  debtAmount: {
    type: Number,
    required: true,
  },
  debtRepayAmount: {
    type: Number,
    required: true,
  },
  debtDecimal: {
    type: Number,
    required: true,
  },

  colToken: {
    type: String,
    required: true,
  },
  colAmount: {
    type: Number,
    required: true,
  },
  colDecimal: {
    type: Number,
    required: true,
  },
  colInscription: {
    type: String,
    required: true,
  },

  offExpiryTime: {
    type: Date,
    required: true,
  },
  contractExpireTime: {
    type: Date,
    required: true,
  },

  slippage: {
    type: Number,
    required: true,
  }
})
const clickAction = async (action: string) =>{
  switch (action){
    case 'repay':
      await signMessageAndEnqueueTransaction(
          {
            action:'repay',
            user: walletAddress.value.ordinalsAddress,
            loanIndex: props.loanIndex,
          });
      return;
    case 'liquidate':
      await signMessageAndEnqueueTransaction(
          {
            action:'liquidate',
            user: walletAddress.value.ordinalsAddress,
            loanIndex: props.loanIndex,
          });
      return;
    case 'giveLoan':
      await signMessageAndEnqueueTransaction(
          {
            action:'giveLoan',
            user: walletAddress.value.ordinalsAddress,
            loanIndex: props.loanIndex,
          });
      return;
    case 'cancel':
      await signMessageAndEnqueueTransaction(
          {
            action:'cancel',
            user: walletAddress.value.ordinalsAddress,
            loanIndex: props.loanIndex,
          });
      return;
    case 'loan_list_post': {
      await queryPOST({
            "type": "lender",
            "rAddr": "tb1pe0jhwxs6yc40u7mu782ccwd0j8u82rc9k98ljvz78c0egpxgnfesaxltdu" //walletAddress.value.ordinalsAddress
        },
      `/lend_endpoint/lend_list`
      )
      return;
    }
    case 'lend_swap':{
      console.log('lend_swap: ', props)
      const currentTime: Date = new Date();
      const offExpiryTime: Date = new Date(currentTime);
      offExpiryTime.setFullYear(2025);    // 연도 변경
      offExpiryTime.setMonth(5);        // 월 변경 (0부터 시작하므로 5는 6월을 나타냄)
      offExpiryTime.setDate(15);               // 일 변경
      offExpiryTime.setHours(18);        // 시간 변경
      offExpiryTime.setMinutes(30);       // 분 변경
      offExpiryTime.setSeconds(0);        // 초 변경

      const contractExpireTime: Date = new Date(currentTime);
      contractExpireTime.setFullYear(2025);    // 연도 변경
      contractExpireTime.setMonth(5);        // 월 변경 (0부터 시작하므로 5는 6월을 나타냄)
      contractExpireTime.setDate(15);               // 일 변경
      contractExpireTime.setHours(18);        // 시간 변경
      contractExpireTime.setMinutes(30);       // 분 변경
      contractExpireTime.setSeconds(0);        // 초 변경
      console.log(`\t\t CurrentTime: ${currentTime}, offExpiryTime: ${offExpiryTime}, contractExpireTime: ${contractExpireTime}`)

      await signMessageAndEnqueueTransaction(
          {
            "method": "lend_swap",
            "tick1": 'btc',
            "amount1": parseInt(props.debtAmount),
            "tick2": props.colToken,
            "amount2": parseInt(props.colAmount),
            "repayAmount": 15000,
            "offExpiryTime": offExpiryTime.toISOString(),
            "contractExpireTime": contractExpireTime.toISOString(),
            "lenderContractAddr": "tb1p938g8dt7pr5hhty7smf3ykrf5qrd533xa5f7vpdjxf30hlq03aqsv5g2va",
            "lenderAddr": "tb1pe0jhwxs6yc40u7mu782ccwd0j8u82rc9k98ljvz78c0egpxgnfesaxltdu",
            "lenderSig": "",
            "borrowerAddr": "",
            "borrowerSig": "",
            "slippage": 0.02
          });
      return;
    }

    // case 'balance':
    //   await getBTCBalance(
    //       {
    //         address: walletAddress.value.ordinalsAddress,
    //       });
    //   return;
  }
}
</script>

<template>
  <v-card color="#fefdf5">
    <div class="flex flex-col p-4 h-[700px] justify-between">
      <div class="flex-col">
        <div class="text-center text-3xl ">Loan #{{props.loanIndex}}</div>

        <InfoComponent :info-contents="`${props.lenderAddr}`" info-title="Lender"></InfoComponent>

        <div v-if="props.colInscription==''">
          <InfoComponent :info-contents="`${props.colToken}`" info-title="BRC20 Token"></InfoComponent>
          <InfoComponent :info-contents="`${props.colAmount} ${props.colToken}`" info-title="BRC20 Amount"></InfoComponent>
        </div>
        <div v-else>
          <InfoComponent :info-contents="`${props.colInscription}`" info-title="Inscription Token"></InfoComponent>
          <InfoComponent :info-contents="`${props.colAmount}`" info-title="Inscription Amount"></InfoComponent>
        </div>
        <InfoComponent :info-contents="`${props.debtAmount} BTC`" info-title="Borrow Amount"></InfoComponent>
        <InfoComponent :info-contents="`${props.debtRepayAmount} BTC`" info-title="Repay Amount"></InfoComponent>
        <InfoComponent :info-contents="`${props.offExpiryTime}`" info-title="Expire Date"></InfoComponent>
        <InfoComponent :info-contents="`${props.contractExpireTime}`" info-title="Contract End Date"></InfoComponent>
        <InfoComponent :info-contents="`${props.slippage} %`" info-title="Slippage"></InfoComponent>

        <!--        <InfoComponent :info-contents="`${props.borrowerAddress}`" info-title="Borrower"></InfoComponent>-->

<!--        <div v-if="props.lenderAddress!=''">-->
<!--          <InfoComponent :info-contents="`${props.lenderAddress}`" info-title="Lender"></InfoComponent>-->
<!--          <InfoComponent :info-contents="`${props.startDate}`" info-title="Loan Start"></InfoComponent>-->
<!--          <InfoComponent :info-contents="`${props.endDate}`" info-title="Loan End"></InfoComponent>-->
<!--        </div>-->
      </div>
<!--      <div class="flex-col">-->
<!--        <div v-if="props.lenderAddress!='' && !props.isLend && !props.isTimeOver" class="items-center justify-center flex mt-4 align-self-end">-->
<!--          <v-btn block @click="clickAction('repay')">Repay this Loan</v-btn>-->
<!--        </div>-->
<!--        <div v-if="props.lenderAddress!='' && props.isLend && props.isTimeOver" class="items-center justify-center flex mt-4 align-self-end">-->
<!--          <v-btn block @click="clickAction('liquidate')">Liquidate Loan</v-btn>-->
<!--        </div>-->
<!--        <div v-if="props.lenderAddress=='' &&props.isLend" class="items-center justify-center flex mt-4 align-self-end">-->
<!--          <v-btn block @click="clickAction('giveLoan')">Offer a Loan</v-btn>-->
<!--        </div>-->
<!--        <div v-if="props.lenderAddress=='' && !props.isLend" class="items-center justify-center flex mt-4 align-self-end">-->
<!--          <v-btn block @click="clickAction('cancel')">Cancel this Loan</v-btn>-->
<!--        </div>-->
<!--      </div>-->

      <div class="flex-col">
        <v-btn block @click="clickAction('lend_swap')">lend_swap</v-btn>
        <v-btn block @click="clickAction('loan_list_post')">loan_list_post</v-btn>
        <v-btn block @click="clickAction('repay')">Repay this Loan</v-btn>
        <v-btn block @click="clickAction('liquidate')">Liquidate Loan</v-btn>
        <v-btn block @click="clickAction('giveLoan')">Offer a Loan</v-btn>
        <v-btn block @click="clickAction('cancel')">Cancel this Loan</v-btn>
      </div>
    </div>

  </v-card>
</template>

<style scoped>

</style>
