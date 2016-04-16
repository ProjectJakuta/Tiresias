parseLaTeXExpr = function(equation) {
	tokenList = tokenizeLaTeX(parseExpr)
	if(!tokenList) return false
	return parseLaTeXTokenList(tokenList)
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

tokenizeLaTeX = function(equation) {
	var tokenList = []
	for(var i = 0; i < equation.length; i++) {
		switch(this.getCatcode(equation[i])) {
			case 0:
				var cmdName = ""
				i++
				for(;i < equation.length && this.getCatcode(equation[i]) == 11; i++) {
					cmdName += equation[i]
					i++
				}
				tokenList.push({type: "command", name: cmdName})
				break
			case 1:
				tokenList.push({type: "beginGroup"})
				break
			case 2:
				tokenList.push({type: "endGroup"})
				break
			case 5:
			case 10:
				break
			case 7:
				tokenList.push({type: "superscript"})
				break
			case 8:
				tokenList.push({type: "subscript"})
				break
			case 9: break
			case 10:
				tokenList.push({type: "letter", value: equation[i]})
			case 11:
				
			case 13:
				tokenList.push({type: "command", name: equation[i]})
				break
			case 14:
				i++
				for(;i < equation.length && this.getCatcode(equation[i]) != 5; i++);
				break
			default:
				return false
		}
	}
	return tokenList
}

parseLaTeXTokenList = function(tokenList) {
	
}
