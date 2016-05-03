/*
This file is part of Project Tiresias.

Project Tiresias is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Project Tiresias is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with Project Tiresias.  If not, see <http://www.gnu.org/licenses/>.
*/

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
