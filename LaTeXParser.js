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
				for(;i < equation.length && getCatcode(equation[i]) == 11; i++) {
					cmdName += equation[i]
				}
				i--
				tokenList.push({mode: "token", type: "command", name: cmdName})
				break
			case 1:
				subgroup = tokenizeLaTeX(equation, i+1)
				tokenList.push({mode: "ASP", value: parseLaTeXTokenList(subgroup.tl)})
				i = subgroup.end
				break
			case 2:
				if(start == 0) throw "Too many closing curly brackets"
				return {tl:tokenList, end:i}
				break
			case 5:
			case 10:
				break
			case 7:
				tokenList.push({mode: "token", type: "superscript"})
				break
			case 8:
				tokenList.push({mode: "token", type: "subscript"})
				break
			case 9: break
			case 11:
				tokenList.push({mode: "token", type: "letter", value: equation[i]})
				break
			case 12:
				tokenList.push({mode: "token", type: "other", value: equation[i]})
				break
			case 13:
				tokenList.push({mode: "token", type: "command", name: equation[i]})
				break
			case 14:
				i++
				for(;i < equation.length && getCatcode(equation[i]) != 5; i++);
				i--
				break
			default:
				console.log(equation[i], getCatcode(equation[i]), tokenList)
				throw ("Illegal token: " + equation[i] + " (catcode "+getCatcode(equation[i])+")")
		}
	}
	if(start > 0) throw "Too many opening curly brackets"
	return tokenList
}

parseLaTeXTokenList = function(tokenList) {
	for(var i = 0; i < tokenList.length; i++) {
		if(tokenList[i].mode !== "token") continue;
		if(tokenList[i].type === "command") {
			switch(tokenList[i].name) {
				case "frac": case "dfrac": case "tfrac": case "rfrac": case "sfrac":
				case "sqrt":
				case "sin": case "cos": case "tan": case "acos": case "asin": case "atan":
				case "":
			}
		}
	}
}
