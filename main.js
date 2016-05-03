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
