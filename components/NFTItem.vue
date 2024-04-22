<script setup lang="ts">

import InfoComponent from "~/components/minimal/InfoComponent.vue";
import {signMessageAndEnqueueTransaction} from "~/utils";
import {useStore} from "~/store";
const store = useStore();
const {walletAddress} = storeToRefs(store);
const props = defineProps({
  loanIndex: {
    type: String,
    required: true,
  },
  borrowerAddress: {
    type: String,
    required: true,
  },
  satOrdinal: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  debtAmount: {
    type: String,
    required: true,
  },
  interestRate: {
    type: String,
    required: true,
  },
  durationDays: {
    type: String,
    required: true,
  },
  lenderAddress: {
    type: String,
    default: '',
  },
  startDate: {
    type: String,
    default: '',
  },
  endDate: {
    type: String,
    default: '',
  },
  isLend: {
    type: Boolean,
    default: false,
  },
  isTimeOver: {
    type: Boolean,
    default: false,
  },
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
    case 'balance':
      await signMessageAndEnqueueTransaction(
          {
            action:'repay',
            user: walletAddress.value.ordinalsAddress,
            loanIndex: props.loanIndex,
          });
  }
}
</script>

<template>
  <v-card color="#fefdf5">
    <div class="flex flex-col p-4 h-[300px] justify-between">
      <div class="flex-col">
        <div class="text-center text-3xl ">Item #{{props.loanIndex}}</div>
        <InfoComponent :info-contents="`${props.borrowerAddress}`" info-title="id"></InfoComponent>
        <InfoComponent :info-contents="`${props.satOrdinal}`" info-title="sat_ordinal"></InfoComponent>
        <InfoComponent :info-contents="`${props.type}`" info-title="mime_type"></InfoComponent>
<!--        <InfoComponent :info-contents="`${props.colAmount} ${props.colToken}`" info-title="BRC20 Amount"></InfoComponent>-->
<!--        <InfoComponent :info-contents="`${props.debtAmount} BTC`" info-title="Borrow Amount"></InfoComponent>-->
<!--        <InfoComponent :info-contents="`${props.interestRate}%`" info-title="Interest Rate"></InfoComponent>-->
<!--        <InfoComponent :info-contents="`${props.durationDays} days`" info-title="Duration"></InfoComponent>-->
<!--        <div v-if="props.lenderAddress!=''">-->
<!--          <InfoComponent :info-contents="`${props.lenderAddress}`" info-title="Lender"></InfoComponent>-->
<!--          <InfoComponent :info-contents="`${props.startDate}`" info-title="Loan Start"></InfoComponent>-->
<!--          <InfoComponent :info-contents="`${props.endDate}`" info-title="Loan End"></InfoComponent>-->
<!--        </div>-->
      </div>
      <div class="flex-col">
        <div v-if="props.lenderAddress!='' && !props.isLend && !props.isTimeOver" class="items-center justify-center flex mt-4 align-self-end">
          <v-btn block @click="clickAction('repay')">Repay this Loan</v-btn>
        </div>
        <div v-if="props.lenderAddress!='' && props.isLend && props.isTimeOver" class="items-center justify-center flex mt-4 align-self-end">
          <v-btn block @click="clickAction('liquidate')">Liquidate Loan</v-btn>
        </div>
        <div v-if="props.lenderAddress=='' &&props.isLend" class="items-center justify-center flex mt-4 align-self-end">
          <v-btn block @click="clickAction('giveLoan')">Offer a Loan</v-btn>
        </div>
        <div v-if="props.lenderAddress=='' && !props.isLend" class="items-center justify-center flex mt-4 align-self-end">
          <v-btn block @click="clickAction('cancel')">Cancel this Loan</v-btn>
        </div>
      </div>
    </div>

  </v-card>
</template>

<style scoped>

</style>
