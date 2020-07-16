//select element(s)
var selectOutput = document.getElementById("output");
var selectAllClear = document.getElementById("allClear");
var selectOperator = document.querySelectorAll(".operator");

//calculation
var firstValue = 0;
var operator = "";
var secondValue = 0;

//if a variable is declared and not initialized, the default value is false for boolean.

//this is used for starting the second value; after the operater is pressed.
var onSecondValue = false;

//stores the result.
var result;

//checks if the operator has been pressed or not.
var operatorPressed = false;

//this counter is to differentiate the difference between a CE click and an AC click.
var clearEntryPressed = 0;

//notes if equal has been pressed so the output can display the second value.
var equalPressed = false;

//counter for how many times the decimal has been pressed.
var decimalPressed = false;

//stores the data-action of the most recent key.
var previousKeyPressed;

//used to calculate the value after the operator has been pressed twice.
var nthValue = 0;

//limits the numbers allowed on the display.
var slice;

//listens for any clicks and executes event (anonymous function).
document.addEventListener("click", event => {
  //if parameter "event" target matches "button" then...
  if (event.target.matches("button")) {
    //returns the element that was clicked on.
    const key = event.target;
    //returns the data-action html attribute
    const action = key.dataset.action;
    //returns textContent of the clicked element.
    const keyContent = key.textContent;
    //returns the textContent of selectOutput
    const displayedNum = selectOutput.textContent;

    console.log(clearEntryPressed);

    //changes allClear button from AC to CE when a button is pressed.
    if (action) {
      selectAllClear.textContent = "CE";
    }


    //if decimal is pressed
    if (action == "decimal") {
      //console.log("---DECIMAL KEY");
      //adding 0.
      if (displayedNum == 0 || displayedNum == undefined 
        || equalPressed && previousKeyPressed == "" 
        || equalPressed && previousKeyPressed == "equal"
        || onSecondValue && previousKeyPressed == "operator") {
        selectOutput.textContent = "0.";
      }
      //if there is no decimal on the output, place a decimal.
      else if (!displayedNum.includes(".")){
        selectOutput.textContent = displayedNum + ".";
      }

      decimalPressed = true;
      previousKeyPressed = action;
    } //decimal
    

    //if number is pressed
    if (action === "number") {
      //console.log("---NUMBER KEY");

      //after equal has been pressed, then a number.
      if (equalPressed) {
        operatorPressed = false;
        selectOutput.textContent = "";
      }
      
      //for the first value.
      if (displayedNum == "0" 
      || displayedNum == "" 
      || previousKeyPressed == "equal") {
          selectOutput.textContent = keyContent;
          equalPressed = false;
      } 
      else if (!operatorPressed){
        selectOutput.textContent = displayedNum + keyContent;
      }

      //displaying numbers after the operator key has been pressed.
      if (operatorPressed) {
        if (previousKeyPressed == "number"
        || previousKeyPressed == "decimal") {
          selectOutput.textContent = displayedNum + keyContent;
        }
        else {
          selectOutput.textContent = keyContent;
        }
      }
      previousKeyPressed = action;
    } //number


    //if CE/AC is pressed
    if (action == "clear") {
      //console.log("---CLEAR KEY");

      //sets output blank
      selectOutput.textContent = "";
      if (previousKeyPressed == "clear") {
        clearEntryPressed++;
      }
      selectAllClear.textContent = "AC";

      //if AC button is pressed, the calculator is reset
      if (clearEntryPressed == 2) {
        result = 0;  
        clear();
      }
      previousKeyPressed = action;
    } //clear


    //function to reset the calculator
    function clear() {
      firstValue = 0;
      operator = "";
      secondValue = 0;
      onSecondValue = false;
      result = 0;

      //counters
      operatorPressed = false;
      decimalPressed = false;
      equalPressed = false;
      previousKeyPressed = "";
      nthValue = 0;
      
      //clears css styles for the operator
      for (a = 0; a < selectOperator.length; a++) {
        selectOperator[a].style.boxShadow = "";
        selectOperator[a].style.background = "none";
        
        //resets clearEntryPressed
        clearEntryPressed = 0;
      }
    } //clear function
    

    //if operator is pressed
    if (action == "operator") {
      //console.log("---OPERATOR KEY");

      if (previousKeyPressed != "operator" || previousKeyPressed != "clear") {
        nthValue++;
      }
      
      //styles the operator button the first time it is pressed.
      if (operator == "") {
        key.style.background = "rgb(202, 202, 202)";
        operator = key.textContent;
      }
      //unstyles all operator buttons and styles the pressed operator button.
      else {
        //clears all css styles from the operator buttons.
        for (a = 0; a < selectOperator.length; a++) {
          selectOperator[a].style.boxShadow = "";
          selectOperator[a].style.background = "";
        }
        //styles the pressed operator key
        key.style.background = "rgb(202, 202, 202)";
        operator = key.textContent;
      }

      operatorPressed = true;
      onSecondValue = true;

      if (nthValue < 2) {
      firstValue = selectOutput.textContent;
      }

      //calculates and ouputs values if there are more than 2 values being calculated.
      if (nthValue >= 2 && previousKeyPressed != "operator") {
        calculate();
        firstValue = result;
      }

      previousKeyPressed = action;
    } //operator


    //if equal button is pressed
    if (action == "equal") {
      //console.log("---EQUAL KEY");
      calculate();

      equalPressed = true;
      
      clear();
      previousKeyPressed = action;
    } //equal

    //slice - limit the number of inputs on the display(AKA output)
    if (selectOutput.textContent.length > 22) {
      slice = selectOutput.innerHTML.slice(0, -1);
      selectOutput.textContent = slice;
    }

    function calculate() {
      secondValue = selectOutput.textContent;
      
      if (operator == "+") {
        result = parseFloat(firstValue) + parseFloat(secondValue);
      }
      else if (operator == "-") {
        result = parseFloat(firstValue) - parseFloat(secondValue);
      }
      else if (operator == "x") {
        result = parseFloat(firstValue) * parseFloat(secondValue);
      }
      else if (operator == "÷") {
        result = parseFloat(firstValue) / parseFloat(secondValue);
      }
      else if (result == undefined || firstValue == 0 && secondValue != 0) {
        result = secondValue;
      }

      /*
      using Math.round method because of adding decimal issue like (.1 + .2)
      https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript#Numbers

      https://stackoverflow.com/questions/10473994/javascript-adding-decimal-numbers-issue
      */
      selectOutput.textContent = Math.round(result  * 1e12) / 1e12;
    }; //calculate
    
    
  } //long if statement
}); //event function

//thanks to freecodecamp to help me in the initial structure of this project //https://www.freecodecamp.org/news/how-to-build-an-html-calculator-app-from-scratch-using-javascript-4454b8714b98/ 