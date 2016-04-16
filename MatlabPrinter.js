function printMatlabExpr(AST) {
  switch(AST.type){
    case "constant":
      return printConstant(AST);
    case "binaryOperator":
      return printBinaryOperator(AST);
    case "latin":
      return printLatin(AST);
    case "fraction":
      return printFraction(AST);
    case "relational":
      return printRelational(AST);
    case "unaryOperator":
      return printUnaryOperator(AST);
    case "grouping":
      return printGrouping(AST);
    case "combinator":
      return printCombinator(AST);
    case "trig":
      return printTrig(AST);
    case "greek":
      return printGreek(AST);
    case "function":
      return printFunction(AST);
  }
  return "";
 }

function printBinaryOperator(AST) {
  var symbol = AST.subType
  var isInfix = true
  switch(AST.subType){
    case "intersect":
      isInfix = false
      break
    case "union":
      isInfix = false
      break
    case "nthroot":
      isInfix = false
      break
    case "dot":
      isInfix = false
      break
    case "cross":
      isInfix = false
      break
    case "%":
      isInfix = false
      symbol = "mod"
      break
    case "implicitMultiply":
      isInfix = true
      symbol = ""
      break
  }
  if(isInfix) {
    return (printMatlabExpr(AST.leftOp) + symbol + printMatlabExpr(AST.rightOp))
  }else{
    return (symbol + "(" + printMatlabExpr(AST.leftOp) + "," + printMatlabExpr(AST.rightOp) + ")")
  }
}

function printConstant(AST) {
  return AST.value;
}

function printLatin(AST) {
  return AST.name;
}

function printGreek(AST) {
  return AST.name;
}

function printUnaryOperator(AST) {
  switch (AST.subType){
    case "not":
      return "not(" + printMatlabExpr(AST.operand) + ")" ;
      break;
    case "-":
      return "-(" + printMatlabExpr(AST.operand) + ")" ;
      break;
    case "factorial":
      return "factorial(" + printMatlabExpr(AST.operand) + ")" ;
      break;
    case "sqrt":
      return "sqrt(" + printMatlabExpr(AST.operand) + ")" ;
      break;
  }
}

function printGrouping(AST) {
  if (((AST.openingSymbol === "(") || (AST.openingSymbol === "[") 
    || (AST.openingSymbol === "{")) 
    && ((AST.closingSymbol === ")") || (AST.closingSymbol === "]") 
    || (AST.closingSymbol === "}") )) {
    return "(" + printMatlabExpr(AST.contents) + ")";
  } 
  if ((AST.openingSymbol === "|") && (AST.closingSymbol === "|"))
        return "abs(" + printMatlabExpr(AST.contents) + ")";
  return "(" + printMatlabExpr(AST.contents) + ")";
}

function printTrig(AST) {
  var trigFunction = AST.operator
  if (AST.operator[0] === "a" && AST.operator[1] === "r") {
    trigFunction = AST.operator[0] + AST.operator.substring(3)
  }
  if (AST.operator === "ln")
    trigFunction = log
  if (AST.operator === "log")
    trigFunction = "log10"
  return trigFunction + "(" + printMatlabExpr(argument) + ")";
}

function printFunction(AST) {
  var functionArgs = "";
      if (AST.argument.length > 0) {
        AST.argument.forEach(function(arg){
          functionArgs + printMatlabExpr(arg) + ",";
        });
        // remove extra "," at end of functionArgs
        functionArgs = functionArgs.substring(0,functionArgs.length - 1);
      }
        return AST.name + "(" +  functionArgs  + ")";
}


function printRelational(AST) {
  switch(AST.subType) {
      case "==": 
        return "(" + printMatlabExpr(AST.LHS) + ")==(" + printMatlabExpr(AST.RHS) + ")";
        return "(" + printMatlabExpr(AST.LHS) + ")==(" + printMatlabExpr(AST.RHS) + ")";
        return "(" + printMatlabExpr(AST.LHS) + ")==(" + printMatlabExpr(AST.RHS) + ")";
      case ">":

        return "TildeTilde[" + printMatlabExpr(AST.LHS) + "," + printMatlabExpr(AST.RHS) + "]";
  }
}

function printFraction(AST) {
  return "(" + printMatlabExpr(AST.numerator) + ")/(" + printMatlabExpr(AST.denominator) + ")";

}