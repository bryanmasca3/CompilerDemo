const keywords=["box","img","text","style","if","then","else","end"];
const Operators=["*","-","+",":",">","="];
const Numbers=/^\d+$/;
const Letters=/[a-z]/i;

const isKeyword=value=>keywords.includes(value);
const isOperators=value=>Operators.includes(value);

const isLetter=value=>Letters.test(value);
const isNumber=value=>Numbers.test(value);

//const getTokens=()=>Tokens.map(token=>console.log(token));

class Token{
    constructor(lexema,type){
      this._lexema=lexema;
      this._type=type;
    }
    get lexema(){
      return this._lexema;
    }
    get type(){
      return this._type;
    }    
  }
  const Parse = str => str.split(';').map(s => s.trim()).filter(s => s.length);
  


 export const runCompiler=(input)=>{

    let Tokens=[];
    const Lines=Parse(input);  

    let buffer=[];
    let str="";

    Lines.map(line=>{                    
          let peek = 0;
          while(peek<line.length){
              if(isOperators(line.charAt(peek))) {Tokens.push(new Token(line.charAt(peek),"operator"));peek++;}
              if(isLetter(line.charAt(peek))){    
                  do {
                      buffer.push(line.charAt(peek));                    
                      peek++;                  
                  } while (isLetter(line.charAt(peek)));      
                            
                  str=buffer.join("");
                  if(isKeyword(str)){
                      Tokens.push(new Token(str,"keyword"));                                      
                  }else{
                      Tokens.push(new Token(str,"identifier"));                   
                  }
                  buffer=[];
              }
              if(isNumber(line.charAt(peek))){    
                  do {
                      buffer.push(line.charAt(peek));                    
                      peek++;                  
                  } while (isNumber(line.charAt(peek)));

                  str=buffer.join("");
                  Tokens.push(new Token(str,"value"));  
                  buffer=[];  
              }else{
                peek++;
              }
                              
            
          }
      
    })
    return Tokens;
  } 