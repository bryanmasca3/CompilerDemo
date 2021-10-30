export const EPSILON = 'ε';

/*const gramm=`E -> T E'
    E' -> + T E'
    E' -> ε
    T -> F T'
    T' -> * F T'
    T' -> ε
    F -> ( E )
    F -> num`;*/
const gramm=`W -> B VARSB'
            W -> S VARSS'
            W -> I VARSI'
            W -> T VARST'
            W -> for ( EXP ) do ASIG
            EXP-> B : B
            ASIG->{ B B' }
            ARTS -> [ ARS' ]
            ARTB -> [ ARB' ]
            ARTI -> [ ARI' ]
            ARTT -> [ ART' ]
            ARS' -> ε
            ARS' -> ELS
            ARB' -> ε
            ARB' -> ELB
            ART' -> ε
            ART' -> ELT
            ARI' -> ε
            ARI' -> ELI
            ELS -> A ELS'
            ELB -> B ELB'
            ELI -> I ELI'
            ELT -> T ELT'
            ELS' -> , ELS
            ELS' -> ε
            ELB' -> , ELB
            ELB' -> ε
            ELI' -> , ELI
            ELI' -> ε
            ELT' -> , ELT
            ELT' -> ε
            B' -> > Y'
            B' -> + S
            L' -> + S
            Y' -> B B'
            Y -> I
            Y -> T
            VARSB' -> =: ARTB
            VARSB' -> =:: B B'
            VARSB' -> ID
            VARSS' -> = A
            VARSS' -> =: ARTS
            VARSS' -> ID
            VARSI' -> = STR
            VARSI' -> =: ARTI
            VARSI' -> =:: I L'
            VARSI' -> ID
            VARST' -> = STR
            VARST' -> =: ARTT
            VARST' -> =:: T L'
            VARST' -> ID
            L -> Y
            B -> box
            I -> img
            T -> text
            S -> style
            A -> attribute
            attribute -> < STR >`;

var alphabet;
var nonterminals;
var terminals;
var rules;
var firsts;
var follows;
var ruleTable;
var TablePrint;

const makeTableForPrint=()=>{
    TablePrint=[];
    var subtable=[];
    subtable.push("");
    for (var i in terminals) {
        subtable.push(terminals[i])        
    }
    subtable.push("$");
    TablePrint.push(subtable) 
    for (var i in nonterminals) {
        var nonterminal = nonterminals[i];
        subtable=[]
        subtable.push(nonterminal);
        for (var j in terminals) {
            var dat=ruleTable[nonterminal][terminals[j]];
            subtable.push(dat===undefined?"":dat)  
        }
            var dat=ruleTable[nonterminal]['$']
            subtable.push(dat===undefined?"":dat)
        
            TablePrint.push(subtable)        
                
    }
    //console.log(TablePrint)
    return TablePrint;
}
const makeRuleTable=() =>{/*CREA LA TABLA MAS EL FISRT +*/
    ruleTable = new Object();
    
    for (var i in rules) {
        var rule = rules[i].trim().split('->');
        
        if (rule.length < 2) {
            continue;
        }
        
        var nonterminal = rule[0].trim();
        var development = trimElements(rule[1].trim().split(' '));
        
        var developmentFirsts = collectFirsts3(development);/*RETORNO LOS TERMINALES PARA EL HEAD*/
        
        for (var j in developmentFirsts) {
            var symbol = developmentFirsts[j];
            
            if (symbol != EPSILON) {/*BUSCO LA COINCIDENCIA EN (EL NO TERMINAL Y EL TERMINAL)TABLA PARA PODER AGREGAR LA PRODUCCION*/
                if (ruleTable[nonterminal] == undefined) {
                    ruleTable[nonterminal] = new Object();
                }
                
                var oldTableRule = ruleTable[nonterminal][symbol];
                
                if (oldTableRule == undefined) {
                    ruleTable[nonterminal][symbol] = rules[i].trim();
                } else {
                    ruleTable[nonterminal][symbol] = oldTableRule + "<br>" + rules[i].trim();/*SI ESQUE INGRESA ESTARIA MAL POR QUE JHABRIA COLICION EN LA TABLA*/
                }
            } else { /*CUANDO ENCUENTRO UN VACIO*/
                for (var j in follows[nonterminal]) {
                    var symbol2 = follows[nonterminal][j];
                    
                    if (ruleTable[nonterminal] == undefined) {
                        ruleTable[nonterminal] = new Object();
                    }
                    
                    var oldTableRule = ruleTable[nonterminal][symbol2];
                    
                    if (oldTableRule == undefined) {
                        ruleTable[nonterminal][symbol2] = rules[i].trim();
                    } else {
                        ruleTable[nonterminal][symbol2] = oldTableRule + "<br>" + rules[i].trim();
                    }
                }
            }
        }
    }
}

const collectFirsts=() =>{
    firsts = new Object();
    
    var notDone;
    
    do {
        notDone = false;
        
        for (var i in rules) {
            var rule = rules[i].split('->');
            
            if (rule.length < 2) {
                continue;
            }
            
            var head = rule[0].trim();
            var body = trimElements(rule[1].trim().split(' '));
            var nonterminalFirsts = firsts[head];
            
            if (nonterminalFirsts == undefined) {/*INGRESA LA PRIMERA VEZ QUE SE VISITA UN NO TERMINAL*/
                nonterminalFirsts = [];
            }
            
            if (body.length == 1 && body[0] == EPSILON) {/*SOLO VA INGRESAR SI VA USER SOLO UN ELEMENTO QUE SEA EL VACIO t->''*/
                notDone |= addUnique(EPSILON, nonterminalFirsts);
            } else {
                notDone |= collectFirsts4(body, nonterminalFirsts);
            }
            
            firsts[head] = nonterminalFirsts;
        }
    } while (notDone);/*MIENTRAS HAYA ALGUNA AGREGACION SEGUIRA*/
}


const collectFirsts4=(development, nonterminalFirsts)=> {
    var result = false;
    var epsilonInSymbolFirsts = true;
    
    for (var j in development) {
        var symbol = development[j];
        epsilonInSymbolFirsts = false;

        if (isElement(symbol, terminals)) {/*VERIFICO SI EL ELEMENTO ESTA EN LOS TERMINALES ...EL CONJUNTO DE LOS PRIMEROS SOLO SE COMPONE DE PRIMEROS*/
            result |= addUnique(symbol, nonterminalFirsts); 
                
            break;	/*SOLO SE MIRA EL PRIMER ELEMENTO E' -> + T E', YA QUE NO TENDRIA SENTIDO VER LAS SIGUIENTES*/
        }
        
        for (var k in firsts[symbol]) {/*RECORRERO EL ARRAY DE ELEMENTOS PARA EL SIMBOLO NO TERMINAL DEL HEAD E' -> T E.*/
            var first = firsts[symbol][k];
            
            epsilonInSymbolFirsts |= first == EPSILON;
            
            result |= addUnique(first, nonterminalFirsts);
        }
        
        if (!epsilonInSymbolFirsts) {
            break;
        }
    }
    
    if (epsilonInSymbolFirsts) {
        result |= addUnique(EPSILON, nonterminalFirsts);
    }
    
    return result;
}

const collectFirsts3=(sequence) =>{
    var result = [];
    var epsilonInSymbolFirsts = true;
    
    for (var j in sequence) {/*RECORRO EL BODY DE CADA PRODUCCION*/
        var symbol = sequence[j];
        epsilonInSymbolFirsts = false;
        
        if (isElement(symbol, terminals)) {
            addUnique(symbol, result); 
            
            break;
        }
        
        for (var k in firsts[symbol]) {/*RECORRO EL CONJUNTO DE LOS PRIMERO S DE CADA BODY*/
            var first = firsts[symbol][k];
            
            epsilonInSymbolFirsts |= first == EPSILON;
            
            addUnique(first, result);
        }
        
        epsilonInSymbolFirsts |= firsts[symbol] == undefined || firsts[symbol].length == 0;
        
        if (!epsilonInSymbolFirsts) {
            break;
        }
    }
    
    if (epsilonInSymbolFirsts) {
        addUnique(EPSILON, result);
    }
    
    return result;
}

const collectFollows=() =>{
    follows = new Object();
    
    var notDone;
    
    do {
        notDone = false;
        
        for (var i in rules) {
            var rule = rules[i].split('->');
            
            if (rule.length < 2) {
                continue;
            }
            
            var nonterminal = rule[0].trim();
            var development = trimElements(rule[1].trim().split(' '));
            
            if (i == 0) {
                var nonterminalFollows = follows[nonterminal];
                
                if (nonterminalFollows == undefined) {
                    nonterminalFollows = [];
                }
                
                notDone |= addUnique('$', nonterminalFollows);
                
                follows[nonterminal] = nonterminalFollows;
            }
            
            for (var j in development) { /*RECORRE EL BODY DE LA PRODUCCION*/
                var symbol = development[j];
                
                if (isElement(symbol, nonterminals)) {
                    var symbolFollows = follows[symbol];
                    
                    if (symbolFollows == undefined) {
                        symbolFollows = [];
                    }
                    
                    var afterSymbolFirsts = collectFirsts3(development.slice(parseInt(j) + 1));
                    
                    for (var k in afterSymbolFirsts) {
                        var first = afterSymbolFirsts[k];
                        
                        if (first == EPSILON) {
                            var nonterminalFollows = follows[nonterminal];
                            
                            for (var l in nonterminalFollows) {
                                notDone |= addUnique(nonterminalFollows[l], symbolFollows);
                            }
                        } else {
                            notDone |= addUnique(first, symbolFollows);
                        }
                    }
            
                    follows[symbol] = symbolFollows;
                }
            }
        }
    } while (notDone);
}

const GetNonterminalsAndTerminals=()=> {
    for (var i in rules) {
        var rule = rules[i].split('->');
        if (rule.length != 2) {
            continue;
        }
        
        var head = rule[0].trim();
        var body = trimElements(rule[1].trim().split(' '));
        
        addUnique(head, alphabet);
        addUnique(head, nonterminals);
        
        for (var j in body) { 
            var symbol = body[j];
            
            if (symbol != EPSILON) {
                addUnique(symbol, alphabet);
            }
        }
    }    
    subtract(alphabet, nonterminals, terminals);
}

const subtract=(array1, array2, result) =>{

    for (var i in array1) {
        var element = array1[i];
        
        if (!isElement(element, array2)) {
            result[result.length] = element;
        }
    }
    
    return result;
}

const trimElements=(array)=> {
    var result = [];
    
    for (var i in array) {
        result[i] = array[i].trim();
    }
    
    return result;
}

export const isElement=(element, array) =>{
    for (var i in array) {
        if (element == array[i]) {
            return true;
        }
    }
    
    return false;
}

const addUnique=(element, array)=> {
    if (!isElement(element, array)) {
        array[array.length] = element;
        
        return true;
    }    
    return false;
}

export const Grammar=()=>{
    
    rules = gramm.split('\n');
	console.log(rules)
    alphabet = [];
    nonterminals = [];
    terminals = [];
    
    GetNonterminalsAndTerminals();
    collectFirsts();
    collectFollows();
    makeRuleTable();	
    makeTableForPrint();	

    return true
} 

export const getTable=()=>{
    return ruleTable;
}
export const getTablePrint=()=>{
    return TablePrint;
}
export const getTerminals=()=>{
    return terminals;
}
export const GetNoTerminals=()=>{
    return nonterminals;
}
