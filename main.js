/* Variables conncected with HTML */
var rawText;
var inputLanguage;
var theAst;
var form = document.getElementById("inputForm");


$("#submit").click(function() {try{
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
		case "plain":
			theAst = parseSimpleExpr(rawText)
			break;
	};

	// Output
	try {$("textarea#latexOutput").val(printLaTeXExpr(theAst))}catch(e){console.log(e)}
	try {
		$("textarea#mathematicaOutput").val(printMathematicaExpr(theAst))
	}catch(e){console.log(e)}
	try {$("textarea#matlabOutput").val(printMatlabExpr(theAst))}catch(e){console.log(e)}
	return false;
}catch(e){console.log(e);return false}});


$(document).ready();
