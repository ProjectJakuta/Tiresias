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

parseLaTeXExpr = function(equation) {
	return parseLaTeXTokenList(tokenizeLaTeX(equation,0))
}

getCatcode = function(character) {
	switch(character) {
		case "\\": return 0;
		case "{": return 1;
		case "}": return 2;
		case "$": return 3;
		case "&": return 4;
		case "\n": return 5;
		case "#": return 6;
		case "^": return 7;
		case "_": return 8;
		case "\0": return 9;
		case " ":
		case "\t": return 10;
		case "~": return 13;
		case "%": return 14;
		default:
			if(/[a-zA-Z]/.exec(character)) return 11;
			return 12;
	}
}

tokenizeLaTeX = function(equation, start) {
	var tokenList = []
	for(var i = start; i < equation.length; i++) {
		switch(getCatcode(equation[i])) {
			case 0:
				var cmdName = ""
				i++
				do {
					cmdName += equation[i]
					i++
				} while(i < equation.length && getCatcode(equation[i]) == 11)
				i--
				tokenList.push({mode: "token", type: "command", text: cmdName})
				break
			case 1:
				subgroup = tokenizeLaTeX(equation, i+1)
				tokenList.push(parseLaTeXTokenList(subgroup.tl))
				i = subgroup.end
				break
			case 2:
				if(start == 0) throw "Too many closing curly brackets"
				return {tl:tokenList, end:i}
				break
			case 5:
			case 10:
				tokenList.push({mode: "token", type: "space", text: equation[i]})
				break
			case 7:
				tokenList.push({mode: "token", type: "superscript"})
				break
			case 8:
				tokenList.push({mode: "token", type: "subscript"})
				break
			case 9: break
			case 11:
				tokenList.push({mode: "token", type: "letter", text: equation[i]})
				break
			case 12:
				if(/[0-9.]/.exec(equation[i])) {
					var num = ''
					for(; /[0-9.]/.exec(equation[i]); i++) {
						num += equation[i]
					}
					tokenList.push({mode: "token", type: "number", text: num})
					i--
				} else {
					tokenList.push({mode: "token", type: "other", text: equation[i]})
				}
				break
			case 13:
				tokenList.push({mode: "token", type: "command", text: equation[i]})
				break
			case 14:
				i++
				for(;i < equation.length && getCatcode(equation[i]) != 5; i++);
				i--
				break
			default:
				throw ("Illegal token: " + equation[i] + " (catcode "+getCatcode(equation[i])+")")
		}
	}
	if(start > 0) throw "Too many opening curly brackets"
	return tokenList
}

ensureLaTeXParsed = function(token) {
	if(token.mode === "token") return parseLaTeXTokenList([token]);
	return token;
}

parseLaTeXTokenList = function(tokenList) {
	for(var i = 0; i < tokenList.length; i++) {
		if(tokenList[i].mode !== "token") continue;
		if(tokenList[i].type === "command") {
			switch(tokenList[i].text) {
				case "frac": case "dfrac": case "tfrac": case "rfrac": case "sfrac":
					tokenList[i] = {
						mode: "AST",
						type: "fraction",
						numerator: ensureLaTeXParsed(tokenList[i+1]),
						denominator: ensureLaTeXParsed(tokenList[i+2])
					}
					tokenList.splice(i+1,2)
					break
				case "sqrt":
					if(tokenList[i+1].mode === "token" &&
							tokenList[i+1].type === "other" &&
							tokenList[i+1].text === "[") {
						var endIndex = null
						for(var j = i+2; j < tokenList.length; j++) {
							if(tokenList[j].mode === "token" &&
									tokenList[j].type === "other" &&
									tokenList[j].text === "]") {
								endIndex = j
								break
							}
						}
						if(endIndex === null) {
							tokenList[i] = {
								mode: "AST",
								type: "unaryOperator",
								subType: "sqrt",
								operand: ensureLaTeXParsed(tokenList[i+1])
							}
							tokenList.splice(i+1,1)
						} else {
							tokenList[i] = {
								mode: "AST",
								type: "binaryOperator",
								subType: "nthroot",
								rightOp: ensureLaTeXParsed(tokenList[j+1]),
								leftOp: parseLaTeXTokenList(tokenList.slice(i+2,j))
							}
							tokenList.splice(i+1,j-i)
						}
					} else {
						tokenList[i] = {
							mode: "AST",
							type: "unaryOperator",
							subType: "sqrt",
							operand: ensureLaTeXParsed(tokenList[i+1])
						}
						tokenList.splice(i+1,1)
					}
					break
				case "left":
					var endIndex = null
					var depth = 1
					for(var j = i+2; j < tokenList.length; j++) {
						if(tokenList[j].mode === "token" && tokenList[j].type === "command") {
							if(tokenList[j].text === "left") depth++;
							if(tokenList[j].text === "right") {
								depth--;
								if(depth == 0) {
									endIndex = j;
									break;
								}
							}
						}
					}
					if(endIndex === null) {
						throw "Too many `\\left`s"
					}
					tokenList[i] = {
						mode: "AST",
						type: "grouping",
						openingSymbol: tokenList[i+1].text,
						closingSymbol: tokenList[j+1].text,
						contents: parseLaTeXTokenList(tokenList.slice(i+2,j))
					}
					tokenList.splice(i+1,j-i+1)
					break
				case "right":
					throw "Too many `\\right`s"
			}
		}
	}
	var startIndices = []
	for(var i = 0; i < tokenList.length; i++) {
		if(tokenList[i].mode !== "token") continue;
		if("text" in tokenList[i] && $.inArray(tokenList[i].text,
				['{','[','(','|'])>=0) {
			if(!(tokenList[i].text === '|' &&
					startIndices.length > 0 &&
					startIndices[startIndices.length - 1].isAbs)) {
				startIndices.push({index: i, isAbs: tokenList[i].text === '|'});
				continue
			}
		}
		if("text" in tokenList[i] && $.inArray(tokenList[i].text,
				['}',']',')','|'])>=0) {
			if(tokenList[i].text !== '|' || (
					startIndices.length > 0 &&
					startIndices[startIndices.length - 1].isAbs)) {
				var start = startIndices.pop().index;
				tokenList[start] = {
					mode: "AST",
					type: "grouping",
					openingSymbol: tokenList[start].text,
					closingSymbol: tokenList[i].text,
					contents: parseLaTeXTokenList(tokenList.slice(start+1,i))
				}
				tokenList.splice(start+1,i-start)
				i = start
				continue
			}
		}
	}
	for(var i = 0; i < tokenList.length-1; i++) {
		if(tokenList[i].mode !== "token") continue;
		if(tokenList[i].type === "command" && $.inArray(tokenList[i].text,
				['sin','cos','tan','sec','csc','cot','sinh','cosh','tanh',
				 'sech','csch','coth','asin','acos','atan','asec','acsc','acot',
				 'asinh','acosh','atanh','asech','acsch','acoth','arcsin','arccos',
				 'arctan','arcsec','arccsc','arccot','arcsinh','arccosh','arctanh',
				 'arcsech','arccsch','arccoth','log','ln','exp'])>=0) {
			if(tokenList[i+1].type === "space") tokenList.splice(i+1,1)
			tokenList[i] = {
				mode: "AST",
				type: "trig",
				operator: tokenList[i].text,
				argument: ensureLaTeXParsed(tokenList[i+1])
			}
			tokenList.splice(i+1,1)
			i--
			continue
		}
		if(tokenList[i+1].mode === "AST" && tokenList[i+1].type === "grouping" &&
				tokenList[i+1].openingSymbol === "(" && tokenList[i].type === "letter") {
			tokenList[i] = {
				mode: "AST",
				type: "function",
				name: tokenList[i].text,
				argument: [].concat(tokenList[i+1].contents)
			}
			tokenList.splice(i+1,1)
		}
	}
	for(var i = 0; i < tokenList.length; i++) {
		if(tokenList[i].mode !== "token") continue;
		if(tokenList[i].type === "number") {
			tokenList[i] = {
				mode: "AST",
				type: "constant",
				value: tokenList[i].text
			}
		}
		if(tokenList[i].type === "letter") {
			tokenList[i] = {
				mode: "AST",
				type: "latin",
				name: tokenList[i].text
			}
		}
		if(tokenList[i].type === "command") {
			if($.inArray(tokenList[i].text.toLowerCase(), [
					'alpha','beta','gamma','delta','epsilon','zeta','eta','theta',
					'iota','kappa','lambda','mu','nu','xi','omicron','pi','rho',
					'sigma','tau','upsilon','phi','varphi','chi','psi','omega',
					'digamma','varepsilon','varkappa','varsigma','vartheta','varpi',
					'varpsi','varomega','vardelta','vargamma','varxi']) >= 0) {
				tokenList[i] = {
					mode: "AST",
					type: "greek",
					name: tokenList[i].text.replace(/^var/,'')
				}
			}
		}
		if(tokenList[i].type === "space") {
			tokenList.splice(i,1)
			i--
		}
	}
	for(var i = 1; i < tokenList.length-1; i++) {
		if(tokenList[i].type === "subscript") {
			tokenList[i-1] = {
				mode: "AST",
				type: "binaryOperator",
				subType: "subscript",
				leftOp: tokenList[i-1],
				rightOp: tokenList[i+1]
			}
			tokenList.splice(i,2)
			i--
		}
	}
	for(var i = 1; i < tokenList.length-1; i++) {
		if(tokenList[i].type === "superscript") {
			tokenList[i-1] = {
				mode: "AST",
				type: "binaryOperator",
				subType: "^",
				leftOp: tokenList[i-1],
				rightOp: tokenList[i+1]
			}
			tokenList.splice(i,2)
			i--
		}
	}
	for(var i = 1; i < tokenList.length-1; i++) {
		if((tokenList[i].type === "other" && tokenList[i].text === "*") ||
				(tokenList[i].type === "command" && tokenList[i].text === "times")) {
			tokenList[i-1] = {
				mode: "AST",
				type: "binaryOperator",
				subType: "*",
				leftOp: tokenList[i-1],
				rightOp: tokenList[i+1]
			}
			tokenList.splice(i,2)
			i--
		}
		if(tokenList[i].type === "other" && tokenList[i].text === "/") {
			tokenList[i-1] = {
				mode: "AST",
				type: "binaryOperator",
				subType: "/",
				leftOp: tokenList[i-1],
				rightOp: tokenList[i+1]
			}
			tokenList.splice(i,2)
			i--
		}
	}
	for(var i = 0; i < tokenList.length-1; i++) {
		if(tokenList[i].mode === "AST" && tokenList[i+1].mode === "AST") {
			tokenList[i] = {
				mode: "AST",
				type: "binaryOperator",
				subType: "implicitMultiply",
				leftOp: tokenList[i],
				rightOp: tokenList[i+1]
			}
			tokenList.splice(i+1,1)
			i--
		}
	}
	for(var i = 0; i < tokenList.length-1; i++) {
		if(tokenList[i].type === "other" && tokenList[i].text === "+" &&
				(i === 0 || tokenList[i-1].mode !== "AST")) {
			tokenList[i] = {
				mode: "AST",
				type: "unaryOperator",
				subType: "+",
				operand: tokenList[i+1]
			}
			tokenList.splice(i+1,1)
		}
		if(tokenList[i].type === "other" && tokenList[i].text === "-" &&
				(i === 0 || tokenList[i-1].mode !== "AST")) {
			tokenList[i] = {
				mode: "AST",
				type: "unaryOperator",
				subType: "-",
				operand: tokenList[i+1]
			}
			tokenList.splice(i+1,1)
		}
		if(tokenList[i].type === "command" && tokenList[i].text === "mp" &&
				(i === 0 || tokenList[i-1].mode !== "AST")) {
			tokenList[i] = {
				mode: "AST",
				type: "unaryOperator",
				subType: "-/+",
				operand: tokenList[i+1]
			}
			tokenList.splice(i+1,1)
		}
		if(tokenList[i].type === "command" && tokenList[i].text === "pm" &&
				(i === 0 || tokenList[i-1].mode !== "AST")) {
			tokenList[i] = {
				mode: "AST",
				type: "unaryOperator",
				subType: "+/-",
				operand: tokenList[i+1]
			}
			tokenList.splice(i+1,1)
		}
	}
	for(var i = 1; i < tokenList.length-1; i++) {
		if(tokenList[i].type === "other" && tokenList[i].text === "+") {
			tokenList[i-1] = {
				mode: "AST",
				type: "binaryOperator",
				subType: "+",
				leftOp: tokenList[i-1],
				rightOp: tokenList[i+1]
			}
			tokenList.splice(i,2)
			i--
		}
		if(tokenList[i].type === "other" && tokenList[i].text === "-") {
			tokenList[i-1] = {
				mode: "AST",
				type: "binaryOperator",
				subType: "-",
				leftOp: tokenList[i-1],
				rightOp: tokenList[i+1]
			}
			tokenList.splice(i,2)
			i--
		}
		if(tokenList[i].type === "command" && tokenList[i].text === "pm") {
			tokenList[i-1] = {
				mode: "AST",
				type: "binaryOperator",
				subType: "+/-",
				leftOp: tokenList[i-1],
				rightOp: tokenList[i+1]
			}
			tokenList.splice(i,2)
			i--
		}
		if(tokenList[i].type === "command" && tokenList[i].text === "mp") {
			tokenList[i-1] = {
				mode: "AST",
				type: "binaryOperator",
				subType: "-/+",
				leftOp: tokenList[i-1],
				rightOp: tokenList[i+1]
			}
			tokenList.splice(i,2)
			i--
		}
	}
	if(tokenList.length !== 1) {
		// It's probably multiple ASTs seperated by commas...
		for(var i = 0; i < tokenList.length; i++) {
			if(tokenList[i].mode !== "AST") {
				tokenList.splice(i,1)
				i--
			}
		}
		return tokenList
	}
	return tokenList[0]
}
