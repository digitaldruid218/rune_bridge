import  Web3  from 'web3';

import BigNumber from "bignumber.js";
import {de} from "vuetify/locale";

export function createWeb3Instance(): any {
  // // @ts-ignore
  // if(process.client && window && window.ethereum && typeof window.ethereum !== 'undefined'){
  //   // @ts-ignore
  //   const web3 = new Web3(window.ethereum);
  //   return web3;
  //
  // }else {
  //   return new Web3();
  // }
}

export function toDecimalNumber(input: number| string| BigNumber, decimal: number, round: number = decimal){
  let temp = new BigNumber(input).dividedBy(10**decimal).toFixed(round);
  return temp.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');

}


export function fromDecimalNumber(input: number| string| BigNumber, decimal: number){
  return new BigNumber(input).multipliedBy(10**decimal).toFixed(0);
}
