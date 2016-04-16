


easyAST = {
  
  type: "relational",
  leftOp: {
 
  type: "binaryOperator", 
  leftOp: {
    type: "binaryOperator",
    leftOp: {
      type: "constant",
      value: "3"
    },
    rightOp: {
      type: "constant",
      value: "5"
    },
    subType: "-"
  },
  rightOp: {
    type: "fraction",
    numerator: {
      type: "roman",
      name: "x"
    },
    denominator: {
       type: "constant",
       value: "8"
    }
  },
  subType: "+/-"
},
  rightOp: {
  type: "binaryOperator", 
  leftOp: {
      type: "constant",
      value: "3"
    },
   rightOp: {
     type: "constant",
      value: "9"
   },
   subType: "^"
  },
  subType: "congruent"
}
  



/**
To start with...
1. binary operators, constants, and variables
*/



function printLaTeXExpr(AST) {
  switch(AST.type){
    case "constant":
      return printConstant(AST);
    case "binaryOperator":
      return printBinaryOperator(AST);
    case "roman":
      return printRoman(AST);
    case "fraction":
      return printFraction(AST);
    case "relational":
      return printRelational(AST);
  }
 }


//
//Evaluates left, prints operator, evaluates right
function printBinaryOperator(AST) {
  var symbol = AST.subType
  switch(AST.subType){
    case "*":
    case "cross":
      symbol =  "\\times";
      break;
    case "dot":
      symbol = "\\cdot";
      break;
    case "+/-":
      symbol = "\\pm";
    case "-/+":
      symbol = "\\mp";
      break;
    case "%":
      symbol = "\\mod";
      break;
    case "implicitMultiply":
      printLaTeXExpr(AST.leftOp) + printLaTeXExpr(AST.rightOp);
    case "^":
      return printLaTeXExpr(AST.leftOp) + "^{" + printLaTeXExpr(AST.rightOp) + "}";
  }
  return "(" + printLaTeXExpr(AST.leftOp) + symbol + printLaTeXExpr(AST.rightOp) + ")";
}









//Just gives the value
function printConstant(AST) {
  return AST.value;
}


function printRoman(AST) {
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
      symbol = "\\geq";
      break;
    case "<=":
      symbol = "\\leq";
    case "!=":
      symbol = "\\neq";
    case "proportional":
      symbol = "\\propto";
    case "congruent":
      symbol = "\\equiv";
  }
  return printLaTeXExpr(AST.leftOp) + symbol + printLaTeXExpr(AST.rightOp);
}



//printLaTeXExpr(easyAST);

