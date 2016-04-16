strToParse = '3sin(2x^2 + y) / (x+1)+1'

//Tokenize --> array
//Find balanced parentheses, replace wit AST
//Find functions -- letterish followed by parentheses 
//PEMDAS - exponents, */, +-

function parseSimpleExpr(expression){
 var tokens = tokenize(expression)
  return tokens;
}


function tokenize(expression){
  var tokenArray = [];
  var currentToken = "";
  for (i = 0; i < expression.length; i++){
    var c = expression[i];
    if (c === " "){
      if (currentToken != ""){
        tokenArray.push(currentToken);
      } 
    } else if ((/[a-zA-Z]/.exec(c)) && (/[a-zA-Z]/.exec(currentToken))){ //if they're both letters
            currentToken += c;
          } else if ( (/[0-9.]/.exec(c)) && (/[0-9.]/.exec(currentToken))) {//if they're both numbers
            currentToken += c;
          } else {
            if (currentToken != ""){
        tokenArray.push(currentToken);
      }
            c = currentToken;
          }
    }
  if (currentToken != ""){
        tokenArray.push(currentToken);
      }
    return tokenArray;
  }


parseSimpleExpr(strToParse);

/*
undefined
*/
/*

*/
/*

*/
/*

*/