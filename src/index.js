function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(string) {
    // write your solution here
    // remake my first course work in university 
    // i had the same task on delphi 
    // i called her poland calulator 
    // https://www.codewars.com/kata/reviews/52a78825cdfc2cfc87000008/groups/5dfd41668c89df0001a51f3b codewars!
    const MathSymbols = new Set("+").add("-").add("*").add("/").add("(").add(")").add("!");

    const Arithmetic = {
      "+": 1,
      "-": 1,
      "*": 2,
      "/": 2,
      "!": 3,//negative number
      "(": 0
    }

    let numbers = [];
    let opers = [];

    function negativeNumber(str) {
      if (str[0] == '-') str = '0' + str;
      str = str.split('');
      for (let i = 0; i < str.length; i++) {
 if ((str[i] == '(') && (str[i + 1] == '-')) {// (-a) = (0-a)
          str.splice(i + 1, 0, '0');
        } else if( str[i] == '-' && str[i+1] == "-"){// a -- b = a + b
          console.log("-- == +")
          str.splice(i , 2, '+');
    //    }else if (MathSymbols.has(str[i]) && str[i + 1] == "-" && MathSymbols.has(str[i + 2])) {
        }else if (str[i] != ")" &&MathSymbols.has(str[i]) && str[i + 1] == "-" && str[i+2] == "(") { //  (a)-(b) = (a) - b
          console.log(str[i], str[i + 1], str[i + 2]);
          str.splice(i + 1, 1, '!');
        } 
        else if (str[i] != ")" && MathSymbols.has(str[i]) && str[i + 1] == "-") {// a * - b + c = a * (0 - b + c)
            str.splice(i + 1, 0, '(0');
            i += 3;
            while (Number.isInteger(+str[i])) {
              ++i;
            }
            str.splice(i + 1, 0, ')');
          }
      };
      return str.join('');
    };

    function createRpn(str) {
      let split = false;
      let rpn = '';
      for (let i = 0; i < str.length; i++) {

        if (!MathSymbols.has(str[i])) {// if it is number, not Math symbol!
          if (split && (rpn.length != 0)) rpn += ' '; //  add space, creates a number from digits   
          rpn += str[i]; // add digits to string
          split = false; // end enter of number

        } else {
          split = true; // split on numbers

          if (str[i] == "(") { // delete parentheses 
            opers.push(str[i]); // add new operand 
          } else if (str[i] == ")") {

            while (opers[opers.length - 1] != '(') {
            if( opers.indexOf('(') == -1) throw new Error("ExpressionError: Brackets must be paired")  
              if (rpn.length == 0) {
                rpn += opers.pop(); // add all operands in stack
              } else {
                rpn += ' ' + opers.pop();
              }
            }// end while
            opers.pop();// drop "("
            //end parentheses 
          } else if (MathSymbols.has(str[i])) {// comparing priorities

            if (!opers.length) {// opers is empty 
              opers.push(str[i]);
            } else if (Arithmetic[[str[i]]] > Arithmetic[opers[opers.length - 1]]) {
              // if currient priority higher than
              // priority symblol on the top of the stack         
              opers.push(str[i]);
            } else {
              rpn += " " + opers.pop();
              while (Arithmetic[opers[opers.length - 1]] >= Arithmetic[[str[i]]]) {
                rpn += " " + opers.pop();
                //while symbols on the top of the stack higher than
                //currient symbol str[i]
                //add in rpn string
              }
              opers.push(str[i]);// add new symbol on the top of the stack
            }

          }// end comparing priorities
        }
      };
      while (opers.length) {
        let pop = opers.pop();
        if(pop == '(') throw new Error("ExpressionError: Brackets must be paired");
        rpn += ' ' + pop;
    };
      //console.log(rpn);

      return rpn;
    }
    function operation(x) {
      let r2 = numbers.pop();
      let r1 = numbers.pop();
      // console.log(`${r1} ${x} ${r2}`)
      let res;
      switch (x) {
        case '!': //create negative number
          res = r2 * (-1);
          numbers.push(r1);
          break;
        case '+':
          res = r1 + r2;
          break;
        case '-':
          res = r1 - r2;
          break;
        case '*':
          res = r1 * r2;
          break
        case '/':
          if (r2 == 0) {
            throw new Error('TypeError: Division by zero.');
          }
          res = r1 / r2;
          break;
      }
      numbers.push(res);
    }
    function calculate(str) {
      let arr = str.split(' ');// create array from RPZ string 
      for (let i = 0; i < arr.length; i++) {
        if (isNaN(arr[i])) {
          operation(arr[i]);// do arithmetic operation
        } else {
          numbers.push(+arr[i]);// add number to stack
        }
      }
      return numbers.pop();// last number in stack is resualt
    };

    string = string.replace(/\s/g, '');
    string = negativeNumber(string);
    string = createRpn(string);
    return calculate(string);
}

module.exports = {
    expressionCalculator
}