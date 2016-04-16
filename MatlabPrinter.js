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
  }
  if isInfix {
    return (printMatlabExpr(AST.leftOp) + symbol + printMatlabExpr(AST.rightOp))
  }
  else
    return (symbol + "(" + printMatlabExpr(AST.leftOp) + "," + printMatlabExpr(AST.rightOp) + ")")
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
  var preSymbol = "";
  var postSymbol = "";
  switch (AST.subType){
    case "not":
       preSymbol = "\\neg ";
       break;
    case "-":
      preSymbol = "-";
    case "+/-":
       preSymbol = "\\pm ";
       break;
    case "-/+":
       preSymbol = "\\mp ";
       break;
    case "factorial":
      return "fraction(" + printMatlabExpr()
      break;
    case "sqrt":
      return "sqrt(" + printMatlabExpr(AST.operand) + ")" ;
  }
  return preSymbol + printMatlabExpr(AST.operand) + postSymbol;
}
