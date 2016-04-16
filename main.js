/* Variables conncected with HTML */
var rawText;
var inputLanguage;
var form = document.getElementById("inputForm");



$("#submit").click(function() {
	// Retrieve input and language
	rawText = document.getElementById("input").value;
	inputLanguage = document.getElementById("language").value;

	// Parse into AST
	switch(inputLanguage) {
		case "ast":
			theAst = parseRawAstExpr(rawText)
			break;
		case "latex":
			theAst = parseLaTeXExpr(rawText)
			break;
		case "mathematica":
			theAst = parseMathematica(rawText)
			break;
		case "matlab":
			theAst = parseMatlab(rawText)
			break;
	};

	// Output
	try {$("textarea#latexOutput").val(printLaTeXExpr(theAst))} catch(e){}
	try {$("textarea#mathematicaOutput").val(printMathematicaExpr(theAst))} catch(e){}
	try {$("textarea#matlabOutput").val(JSON.stringify(theAst))} catch(e){}
	return false;
});




$(document).ready();
