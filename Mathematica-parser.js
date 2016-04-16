/* This is not going to work */


parseMathematicaExpr = function(equation) {
	tokenList = tokenizeMathematica(parseExpr)
	if(!tokenList) return false
	return parseMathematicaTokenList(tokenList)
}

getCatcode = function(character) {
	switch(character) {
		//case "\\": return 0;

		// x = latin character
		// apple (string) = latin

		case "{": return 1; // list args
		case "[": return 1; // function TODO
		case "}": return 2;
		case "[": return 2;
		case "$": return 3;
		case "&": return 4;
		//case "\n": return 5; // does nothing
		//case "#": return 6;
		//case "$": return 6;  // MOTHERFUCKER
		//case "^": return 7;
		//case "_": return 8;
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

tokenizeMathematica = function(equation) {
	var tokenList = []
	for(var i = 0; i < equation.length; i++) {
		switch(this.getCatcode(equation[i])) {
			/* Latex specific
			case 0:
				var cmdName = ""
				i++
				for(;i < equation.length && this.getCatcode(equation[i]) == 11; i++) {
					cmdName += equation[i]
				}
				tokenList.push({type: "command", name: cmdName})
				break
				*/
			case 1:
				tokenList.push({type: "beginGroup"})
				break
			case 2:
				tokenList.push({type: "endGroup"})
				break
			//case 5:
			case 10:
				break
			case 7:
				tokenList.push({type: "superscript"})		// OH HELL NO
				break
			case 8:
				tokenList.push({type: "subscript"})			// WTF MATHEMATICA
				break
			case 9: break
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

parseMathematicaTokenList = function(tokenList) {
	
}
