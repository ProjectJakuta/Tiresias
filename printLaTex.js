

function printLaTeXExpr(AST) {
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
    case "symbol":
      return printSymbol(AST);
    case "function":
      return printFunction(AST);
  }
  return "";
 }


//
//Evaluates left, prints operator, evaluates right
function printBinaryOperator(AST) {
  var symbol = AST.subType
  switch(AST.subType){
    case "*":
    case "cross":
      symbol =  "\\times ";
      break;
    case "dot":
      symbol = "\\cdot ";
      break;
    case "+/-":
      symbol = "\\pm ";
      break
    case "-/+":
      symbol = "\\mp ";
      break;
    case "%":
      symbol = "\\mod ";
      break;
    case "intersect":
      symbol = "\\cap ";
      break;
    case "union":
      symbol = "\\cup ";
      break;
    case "nthroot":
      return "\\sqrt [" + printLaTeXExpr(AST.leftOp) + "]{" + printLaTeXExpr(AST.rightOp) + "}"; 
    case "implicitMultiply":
      return printLaTeXExpr(AST.leftOp) + printLaTeXExpr(AST.rightOp);
    case "^":
      return printLaTeXExpr(AST.leftOp) + "^{" + printLaTeXExpr(AST.rightOp) + "}";
    case "subscript":
      return printLaTeXExpr(AST.leftOp) + "_{" + printLaTeXExpr(AST.rightOp) + "}";
  }
  return printLaTeXExpr(AST.leftOp) + symbol + printLaTeXExpr(AST.rightOp);
}









//Just gives the value
function printConstant(AST) {
  return AST.value;
}


function printLatin(AST) {
  return AST.name;
}


function printFraction(AST) {
  return "\\frac{" + printLaTeXExpr(AST.numerator) + "}{" + printLaTeXExpr(AST.denominator) + "}";
}

function printRelational(AST){
  var symbol = AST.subType;
  switch(AST.subType){
    case "==":
      symbol = "=";
    case ">=":
      symbol = "\\geq ";
      break;
    case "<=":
      symbol = "\\leq ";
    case "!=":
      symbol = "\\neq ";
    case "proportional":
      symbol = "\\propto ";
    case "congruent":
      symbol = "\\equiv ";
    case "approx":
      symbol = "\\approx ";
  }
  return printLaTeXExpr(AST.leftOp) + symbol + printLaTeXExpr(AST.rightOp);
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
      break
    case "+/-":
       preSymbol = "\\pm ";
       break;
    case "-/+":
       preSymbol = "\\mp ";
       break;
    case "factorial":
      postSymbol = "! ";
      break;
    case "sqrt":
      return "\\sqrt{" + printLaTeXExpr(AST.operand) + "}" ;
  }
  return preSymbol + printLaTeXExpr(AST.operand) + postSymbol;
}


function printGrouping(AST){
  if (AST.openingSymbol === "{"){
    AST.openingSymbol = "\\" + AST.openingSymbol;
    AST.closingSymbol = "\\" + AST.closingSymbol; 
  }
  if (AST.openingSymbol === "("){
    AST.openingSymbol = "\\left(";
    AST.closingSymbol = "\\right)"; 
  }
   if (AST.openingSymbol === "["){
    AST.openingSymbol = "\\left[";
    AST.closingSymbol = "\\right]"; 
  }
  return AST.openingSymbol + printLaTeXExpr(AST.contents) + AST.closingSymbol;  
  }


function printCombinator(AST){
  var symbol;
  var minLimit = "";
  var maxLimit = "";
  var variable = ""
  if (AST.minLimit != null) {
    minLimit = printLaTeXExpr(AST.minLimit);
  }
  if (AST.maxLimit != null) {
    maxLimit = printLaTeXExpr(AST.maxLimit);
  }
  if (AST.variable != null) {
    variable = printLaTeXExpr(AST.variable);
  }
  var contents = printLaTeXExpr(AST.contents);
  switch(AST.subType){
    case "integral":
      symbol = "\\int ";
      contents = contents + " d" + printLaTeXExpr(AST.variable); 
      break;
    case "sum":
      symbol = "\\sum ";
      break;
    case "product":
      symbol = "\\prod ";
      break; 
    case "limsup":
      symbol = "\\limsup ";
      minLimit = printLaTeXExpr(variable) + " \\to " + minLimit;
      break;
    case "lim":
      symbol = "\\lim ";
      minLimit = printLaTeXExpr(variable) + " \\to " + minLimit;
      break;
    case "liminf":
      symbol = "\\liminf ";
      minLimit = printLaTeXExpr(variable) + " \\to " + minLimit;
      break;
    case "union":
      symbol = "\\cup "
      break;
    case "intersect":
      symbol = "\\cap "
      break;
  }
  return symbol + "_{" + minLimit + "}^{" + maxLimit + "}" + contents;
}

//Trig, log, ln
function printTrig(AST) {
  return "\\" + AST.operator + "{" + printLaTeXExpr(AST.argument) + "}";
}

function printGreek(AST) {
  return "\\" + AST.name + " ";
}


function printSymbol(AST){
  switch(AST.character){
    case "infinity":
      return "\\infty ";
    case "rightarrow":
      return "\\rightarrow ";
    case "leftarrow":
      return "\\leftarrow ";
    case "ellipsis":
      return "\\cdots ";
    case "partial":
      return "\\partial";
  }
}



function printFunction(AST) {
  if (AST.argument.length == 0) {
    return AST.name;
  } 
  var returnString = AST.name + "(";
  for (i = 0; i < AST.argument.length-1; i++) {
    returnString += (printLaTeXExpr(AST.argument[i]) + ", ");
  }
  returnString += printLaTeXExpr(AST.argument[AST.argument.length - 1]) + ")";
  return returnString;
}
