const keywords=["int","string"];

const Operators=["*","-","+","="];

const Numbers=/^\d+$/;
const Letters=/[a-z]/i;


const isKeyword=value=>keywords.includes(value);
const isOperators=value=>Operators.includes(value);

const isLetter=value=>Letters.test(value);
const isNumber=value=>Numbers.test(value);



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

const SplitCode = str => str.split(';').map(s => s.trim()).filter(s => s.length);
  

 export const Scanner=(sourceCode)=>{

    let Tokens=[];
    
    const Lines=SplitCode(sourceCode);  

    let buffer=[];
    let str="";

    Lines.map(line=>{                    
          let peek = 0;
          while(peek<line.length){
              if(isOperators(line.charAt(peek))) {Tokens.push(new Token(line.charAt(peek),"SUM"));peek++;}
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
                  Tokens.push(new Token(str,"id"));  
                  buffer=[];  
              }else{
                peek++;
              }
                              
            
          }
      
    })
    return Tokens;
  } 