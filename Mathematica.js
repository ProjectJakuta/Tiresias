//Standard form

// Function f[x1,x2,...]
// String " "
// Binary 
// Unary Factorial
// 

//write f'n that prints eqn(takes in an ast)
//  use switch statements to print each different type (very recursive)

function printMathematicaExpr(AST) {
	switch(AST.type) {
    case "combinator":
    	//TODO: Stuff

        printMathematicaExpr();
        break;
    case "function":
    	//TODO: Stuff
    	// return AST.name + "[" + printMathematicaExpr(argument1) + ... + "]" ;
        printMathematicaExpr();
        break;
    case "constant":
    	return AST.value;
        break;
    case "roman":
    	return AST.name;
        break;
    case "greek":
    	return AST.name;
        break;
    case "relational":
    	//TODO: Stuff
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
				return "(" + printMathematicaExpr(leftOp) + ") (" + printMathematicaExpr(rightOp) + ")"; 
				break;
			case "*":
				return "(" + printMathematicaExpr(leftOp) + ")*(" + printMathematicaExpr(rightOp) + ")"; 
				break;
			case "+":
				return "(" + printMathematicaExpr(leftOp) + ")+(" + printMathematicaExpr(rightOp) + ")"; 
				break;
			case "-":
				return "(" + printMathematicaExpr(leftOp) + ")-(" + printMathematicaExpr(rightOp) + ")"; 
				break;
			case "/":
				return "(" + printMathematicaExpr(leftOp) + ")/(" + printMathematicaExpr(rightOp) + ")"; 
				break;
			case "^":
				return "Exponent[" + printMathematicaExpr(leftOp) + "," + printMathematicaExpr(rightOp) + "]"; 
				break;
			case "%":
				return "Mod[" + printMathematicaExpr(leftOp) + "," + printMathematicaExpr(rightOp) + "]"; 
				break;
			case "cross":
				return "Cross[" + printMathematicaExpr(leftOp) + "," + printMathematicaExpr(rightOp) + "]"; 
				break;
			case "dot":
				return "(" + printMathematicaExpr(leftOp) + ").(" + printMathematicaExpr(rightOp) + ")"; 
				break;
			case "+/-":
				return "PlusMinus[" + printMathematicaExpr(leftOp) + "," + printMathematicaExpr(rightOp) + "]"; 
				break;
			case "-/+":
				return "MinusPlus[" + printMathematicaExpr(leftOp) + "," + printMathematicaExpr(rightOp) + "]"; 
				break;
			default:
				// error for unknown subType of binary Operator
		}
		break;
    case "unaryOperator":
    	//TODO: Stuff
    	switch(AST.subType) {
    		case "not":
    			"Not[" + print(AST.operand) + "]";
    			break;
    		case "-":
    			return "Negative[" + print(AST.operand) + "]";
    			break;
    		case "+/-":
    			"PlusMinus[" + print(AST.operand) + "]";
    			break;
    		case "-/+":
    			"MinusPlus[" + print(AST.operand) + "]";
    			break;
    		default:
    			// error for unknown subType of unary operator
    	}
        break;
    case "grouping":
    	//TODO: Stuff
        printMathematicaExpr();
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
