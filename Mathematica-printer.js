/*
 * We print Mathematica code in StandardForm
 */
function printMathematicaExpr(AST) {
	switch(AST.type) {
    case "combinator":
    	switch(AST.subType) {
    		case "integral":
    		case "sum":
    		case "product":
    			// TODO: take care of case with no upperLimit and/or lowerLimit
    			var firstChar = AST.subType.substring(0,1);
    			return (firstChar.toUpperCase() + AST.subType.substring(1) + "[" 
    				+ printMathematicaExpr(AST.contents) + ",{" + printMathematicaExpr(variable) 
    				+ "," + printMathematicaExpr(minLimit)+ "," + printMathematicaExpr(maxLimit) 
    				+ "}]");
    			break;
    		case "lim":
    			return ("Limit[(" + printMathematicaExpr(AST.contents) + ")," 
    				+ printMathematicaExpr(AST.variable) + "->" 
    				+ printMathematicaExpr(AST.minLimit) + "]");
    			break;
    		case "union":
    		case "intersect":
    		default:
    			// TODO: error for unknown subType of combinator
    	}

        printMathematicaExpr();
        break;
    case "function":
    	//TODO: Stuff
    	//for each thing in argument list, 
    	var functionArgs = "";
    	if (AST.argument.length > 0) {
	    	AST.argument.foreach(function(arg){
	    		functionArgs + printMathematicaExpr(arg) + ",";
	    	});
	    	// remove extra "," at end of functionArgs
    		functionArgs = functionArgs.substring(0,functionArgs.length - 2);
    	}
        return AST.name + "[" +  functionArgs	 + "]";
        break;
    case "constant":
    	return AST.value;
        break;
    case "latin":
    	return AST.name;
        break;
    case "greek":
    	return AST.name;
        break;
    case "relational":
        switch(AST.subType) {
			case "==": 
				return "(" + printMathematicaExpr(LHS) + ")==(" + printMathematicaExpr(RHS) + ")";
				break;
			case "<":
				return "(" + printMathematicaExpr(LHS) + ")<(" + printMathematicaExpr(RHS) + ")";
				break;
			case ">":
				return "(" + printMathematicaExpr(LHS) + ")>(" + printMathematicaExpr(RHS) + ")";
				break;
			case "<=":
				return "(" + printMathematicaExpr(LHS) + ")<=(" + printMathematicaExpr(RHS) + ")";
				break;
			case ">=":
				return "(" + printMathematicaExpr(LHS) + ")>=(" + printMathematicaExpr(RHS) + ")";
				break;
			case "!=":
				return "(" + printMathematicaExpr(LHS) + ")!=(" + printMathematicaExpr(RHS) + ")";
				break;
			case "~": 
				// not supported in Mathematica
				break;
		}
        break;
    case "binaryOperator":
		switch(AST.subType) {
			case "implicitMultiply":
				return ("(" + printMathematicaExpr(leftOp) + ") (" 
					+ printMathematicaExpr(rightOp) + ")"); 
				break;
			case "*":
				return ("(" + printMathematicaExpr(leftOp) + ")*(" 
					+ printMathematicaExpr(rightOp) + ")"); 
				break;
			case "+":
				return ("(" + printMathematicaExpr(leftOp) + ")+(" 
					+ printMathematicaExpr(rightOp) + ")"); 
				break;
			case "-":
				return ("(" + printMathematicaExpr(leftOp) + ")-(" 
					+ printMathematicaExpr(rightOp) + ")"); 
				break;
			case "/":
				return ("(" + printMathematicaExpr(leftOp) + ")/(" 
					+ printMathematicaExpr(rightOp) + ")"); 
				break;
			case "^":
				return ("Exponent[" + printMathematicaExpr(leftOp) + "," 
					+ printMathematicaExpr(rightOp) + "]"); 
				break;
			case "%":
				return ("Mod[" + printMathematicaExpr(leftOp) + "," 
					+ printMathematicaExpr(rightOp) + "]"); 
				break;
			case "cross":
				return ("Cross[" + printMathematicaExpr(leftOp) + "," 
					+ printMathematicaExpr(rightOp) + "]"); 
				break;
			case "dot":
				return ("(" + printMathematicaExpr(leftOp) + ").(" 
					+ printMathematicaExpr(rightOp) + ")"); 
				break;
			case "+/-":
				return ("PlusMinus[" + printMathematicaExpr(leftOp) + "," 
					+ printMathematicaExpr(rightOp) + "]"); 
				break;
			case "-/+":
				return ("MinusPlus[" + printMathematicaExpr(leftOp) + "," 
					+ printMathematicaExpr(rightOp) + "]"); 
				break;
			case "subscript":
				return ("Subscript[" + printMathematicaExpr(leftOp) + "," 
					+ printMathematicaExpr(rightOp) + "]"); 
				break;
			case "nthroot":
				// rightOp = argument
				// Note: square root is a unary operator
				return ("Surd[" + printMathematicaExpr(rightOp) + "," 
					+ printMathematicaExpr(leftOp) + "]");
			default:
				// TODO: error for unknown subType of binary Operator
		}
		break;
    case "unaryOperator":
    	//TODO: Stuff
    	switch(AST.subType) {
    		case "not":
    			"Not[" + printMathematicaExpr(AST.operand) + "]";
    			break;
    		case "-":
    			return "Negative[" + printMathematicaExpr(AST.operand) + "]";
    			break;
    		case "+/-":
    			"PlusMinus[" + printMathematicaExpr(AST.operand) + "]";
    			break;
    		case "-/+":
    			"MinusPlus[" + printMathematicaExpr(AST.operand) + "]";
    			break;
    		case "factorial":
    			"(" + printMathematicaExpr(AST.operand) + ")!";
    			break;
    		case "sqrt":
    			"Sqrt[" + printMathematicaExpr(AST.operand) + "]";
    			break;
    		default:
    			// TODO: error for unknown subType of unary operator
    	}
        break;
    case "fraction":
    	//TODO: Stuff
    	break;
    case "grouping":
    	// TODO: should we check if contents are empty?
    	return AST.openingSymbol + printMathematicaExpr(AST.contents) + AST.closingSymbol;
        break;
    case "withUnits":
    	//TODO: Stuff
        printMathematicaExpr();
        break;
    case "unit":
    	//TODO: Stuff
        printMathematicaExpr();
        break;
    default:
        //print out an error "Not a AST"
	}
}
