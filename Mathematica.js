//Standard form

// Function f[x1,x2,...]
// String " "
// Binary 
// Unary Factorial
// 

//write f'n that prints eqn(takes in an ast)
//  use switch statements to print each different type (very recursive)

function printExpr(AST) {
	switch(AST.type) {
    case "combinator":
    	//TODO: Stuff

        printExpr();
        break;
    case "function":
    	//TODO: Stuff
    	// return AST.name + "[" + printExpr(argument1) + ... + "]" ;
        printExpr();
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
        swith(AST.subType) {
			case "==": 
				return "(" + printExpr(LHS) + ")==(" + printExpr(RHS) + ")";
				break;
			case "<":
				return "(" + printExpr(LHS) + ")<(" + printExpr(RHS) + ")";
				break;
			case ">":
				return "(" + printExpr(LHS) + ")>(" + printExpr(RHS) + ")";
				break;
			case "<=":
				return "(" + printExpr(LHS) + ")<=(" + printExpr(RHS) + ")";
				break;
			case ">=":
				return "(" + printExpr(LHS) + ")>=(" + printExpr(RHS) + ")";
				break;
			case "!=":
				return "(" + printExpr(LHS) + ")!=(" + printExpr(RHS) + ")";
				break;
			case "~": 
				// not supported in Mathematica
				break;
		}
        break;
    case "binaryOperator":
		switch(AST.subType) {
			case "implicitMultiply":
				return "(" + printExpr(leftOp) + ") (" + printExpr(rightOp) + ")"; 
				break;
			case "*":
				return "(" + printExpr(leftOp) + ")*(" + printExpr(rightOp) + ")"; 
				break;
			case "+":
				return "(" + printExpr(leftOp) + ")+(" + printExpr(rightOp) + ")"; 
				break;
			case "-":
				return "(" + printExpr(leftOp) + ")-(" + printExpr(rightOp) + ")"; 
				break;
			case "/":
				return "(" + printExpr(leftOp) + ")/(" + printExpr(rightOp) + ")"; 
				break;
			case "^":
				return "Exponent[" + printExpr(leftOp) + "," + printExpr(rightOp) + "]"; 
				break;
			case "%":
				return "Mod[" + printExpr(leftOp) + "," + printExpr(rightOp) + "]"; 
				break;
			case "cross":
				return "Cross[" + printExpr(leftOp) + "," + printExpr(rightOp) + "]"; 
				break;
			case "dot":
				return "(" + printExpr(leftOp) + ").(" + printExpr(rightOp) + ")"; 
				break;
			case "+/-":
				return "PlusMinus[" + printExpr(leftOp) + "," + printExpr(rightOp) + "]"; 
				break;
			case "-/+":
				return "MinusPlus[" + printExpr(leftOp) + "," + printExpr(rightOp) + "]"; 
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
        printExpr();
        break;
    case "withUnits":
    	//TODO: Stuff
        printExpr();
        break;
    case "unit":
    	//TODO: Stuff
        printExpr();
        break;
    default:
        //print out an error "Not a AST"
}
