const keywords=["box","img","text","style","attibute","for","do"];
const Puntuation=["}","{","(",")"];
const Operators=["+",">",":","=::","=:","-","="];
//const Asignation=["=::","=:","="];
const Letters=/^[A-Z]+[a-z]*[0-9]*$/;
const strrr=/^[a-z0-9]+$/;

let Tokens=[];
let Reserved=[];
const isKeyword=value=>keywords.includes(value);
const isOperators=value=>Operators.includes(value);
const isPuntuation=value=>Puntuation.includes(value);

const isSTR=value=>strrr.test(value);

const returnToken=value=>Tokens.find(element=>element.getlexema()==value);

const isLetter=value=>Letters.test(value);

const addUnique=(element, array)=> {
  if (!isElement(element, array)) {
      array[array.length] = element;
      
      return true;
  }    
  return false;
}

class Token{
    constructor(lexema,type,cat){
      this._lexema=lexema;
      this._type=type;
      this._cat=cat;
    }
    getlexema(){
      return this._lexema;
    }
    gettype(){
      return this._type;
    }  
    getcat(){
      return this._cat;
    }    
  }
  class Error{
    constructor(line,error){
      this._line=line;
      this._error=error;
    }
    get_line(){
      return this._line;
    }
    get_Error(){
      return this._error;
    }    
  }
const isElement=(element, array) =>{
    for (var i in array) {
        if (element == array[i]) {
            return true;
        }
    }
    
    return false;
}
const SplitCode = str => str.split('\n').map(s => s.trim()).filter(s => s.length);
  
const trimElements=(array)=> {
  var result = [];
  
  for (var i in array) {
      result[i] = array[i].trim();
  }
  
  return result;
}

 export const Scanner=(sourceCode)=>{

    
    
    const Lines=SplitCode(sourceCode);  

    let buffer=[];
    let buffers=[];
    let str="";
    let strArrat=[];
    let Error=[];

    Lines.map((line,index)=>{
           
      let peek = 0;
      str="";
      while(peek<line.length){        
        while(line.charAt(peek)!==" " && peek<line.length){

          buffer.push(line.charAt(peek))
          peek++
        }
        if(isKeyword(buffer.join(""))){
          addUnique(buffer.join(""),Reserved)
         // Tokens.push(new Token(buffer,"RESERVED"))
          str+=buffer.join("")+" "
          buffers.push(buffer.join(""))
          buffer=[];
          peek++
          continue
        }
        if(isLetter(buffer.join(""))){
          var element
          if((element=returnToken(buffer.join("")))!==undefined){
            str+=element.getcat()+" "
          }else{        
            addUnique(new Token(buffer.join(""),"ID",Reserved[Reserved.length-1]),Tokens)                    
            str+="ID"+" "
          }
          peek++
          buffers.push(buffer.join(""))
          buffer=[];
          continue
        }
        if(isSTR(buffer.join(""))){
          addUnique(new Token(buffer.join(""),"STR"),Tokens)                    
          str+="STR"+" "
          peek++
          buffers.push(buffer.join(""))
          buffer=[];
          continue
        }
        if(isOperators(buffer.join(""))){
          addUnique(new Token(buffer.join(""),"OPT"),Tokens)
          str+=buffer.join("")+" "
          peek++
          buffers.push(buffer.join(""))
          buffer=[];
          continue
        }
        if(isPuntuation(buffer.join(""))){
          addUnique(new Token(buffer.join(""),"PUNT"),Tokens)
          str+=buffer.join("")+" "
          buffer=[];
          buffers.push(buffer.join(""))
          peek++
          continue
        }
        else{
          str+="ERROR"+" "
          peek++
        }

      }
      strArrat.push(str.trim())
      /*var items=[];
      
      if(line.split(" ").length===2){
        items=line.split(" ")
        if(isKeyword(items[0])){
          Tokens.push(new Token(items[0],"RESERVED"))         
        }else{          
          Error.push(new Error(items[0],"lol"))
        }
        if(isLetter(items[1])){
          Tokens.push(new Token(items[1],"ID",items[0]))
        }else{
          Error.push(new Error(items[0],"lol"))
        }     

      }
      if(line.split("=").length===2){
        items=line.split("=")
        if(isElement(items[0],["img","txt"])  && isLetter(items[1])){
          Tokens.push(new Token(items[0],"RESERVED"))
          Tokens.push(new Token(items[1],items[0]))
        }else{
          Error.push(new Error(items[0],"lol"))
        }
      }
      if(line.split("=:").length===2){
        items=line.split("=:")
        if(isKeyword(items[0])  && items[1].charAt(0)==="[" && items[1].charAt(items[1].length-1)==="]"){
     
          var newElements =items[1].substring(1,items[1].length-1)
          if(newElements.length===0){

          }else{
            var oherElement=newElements.split(",")
            for(var i=0;i<oherElement.length;i++){
              var el=Tokens.find(E => E.getlexema()=== oherElement[i]);
              
            }
          }
        }else{
          Error.push(new Error(items[0],"lol"))
        }
      }
      if(line.split("=::").length-1){
        items=line.split(" ")
      }*/
    
            //  console.log(line.charAt(peek))
            //  peek++;
              /*while(isOperators(line.charAt(peek))) {Tokens.push(new Token(line.charAt(peek),Operators.find(ele => ele ===line.charAt(peek))));peek++;}
              if(isLetter(line.charAt(peek))){    
                  do {
                      buffer.push(line.charAt(peek));                    
                      peek++;                  
                  } while (isLetter(line.charAt(peek)));      
                            
                  str=buffer.join("");
                  if(isKeyword(str)){
                      Tokens.push(new Token(str,"KEYWORD"));                                      
                  }else{
                      Tokens.push(new Token(str,"ID"));                   
                  }
                  buffer=[];
              }
              if(isNumber(line.charAt(peek))){    
                  do {
                      buffer.push(line.charAt(peek));                    
                      peek++;                  
                  } while (isNumber(line.charAt(peek)));

                  str=buffer.join("");
                  Tokens.push(new Token(str,"num"));  
                  buffer=[];  
              }else{
                peek++;
              }           */                               
          
      
    })
    //console.log(strArrat)
    return [strArrat,Tokens];
  } 