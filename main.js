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
	$("textarea#latexOutput").val(printLaTeXExpr(theAst))
	$("textarea#mathematicaOutput").val(printMathematicaExpr(theAst))
	$("textarea#matlabOutput").val(JSON.stringify(theAst))
	return false;
});




$(document).ready();
