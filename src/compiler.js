import {Scanner}from "./scanner";
import {Parser}from "./parser";

export const runCompiler=(sourceCode)=>{
  const [tokensParser,tokens]=Scanner(sourceCode);  

  
  const [Table, segAlgo,ok]=Parser(tokensParser[0]);
  //const [Table, segAlgo,ok]=Parser(sourceCode);

  
  return {table:Table, algorithm:segAlgo,token:tokens,success:true}
  //return {table:Table, algorithm:segAlgo,token:null,success:true}
} 