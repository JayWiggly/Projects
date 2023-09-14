function main(){

    let userAnswer = document.getElementById('qAnswer');
    if(userAnswer.value!=""){
        let operatorLabel = document.getElementById('qOperator');
        let firstNumberLabel = document.getElementById('qFirstNumber');
        let secondNumerLabel = document.getElementById('qSecondNumber');
        let result = document.getElementById('result');
        
        let firstNumber = parseInt(firstNumberLabel.innerText);
        let secondNumber = parseInt(secondNumerLabel.innerText);
        let operator = operatorLabel.innerText;
        let userAnswerValue = parseInt(userAnswer.value);

        let calculatedAnswer;
        if (operator==="+") {
            calculatedAnswer = firstNumber + secondNumber;
        }
        else {
            calculatedAnswer = firstNumber - secondNumber;
        }
        
        if (userAnswerValue===calculatedAnswer) {
            result.innerHTML = "You did it, well done.(" + firstNumberLabel.innerText + operatorLabel.innerText + secondNumerLabel.innerText + "=" + userAnswerValue +")";
        }
        else{
            result.innerHTML = "Try again (" + firstNumberLabel.innerText + operatorLabel.innerText + secondNumerLabel.innerText + "=" + calculatedAnswer + " NOT " + userAnswerValue + ")";
        }        
    }
    userAnswer.value = "";
    populateSum();
}

function initialisePage(){    
    let location = window.location.pathname;
    let directoryPath = location.substring(0, location.lastIndexOf("/")+1);       

    let numberLineImage = document.getElementById('NumberLineImage');
    numberLineImage.src = directoryPath + "NumberLineImage.jpg";

    populateSum();
}

function populateSum(){
    let operatorLabel = document.getElementById('qOperator');
    let firstNumberLabel = document.getElementById('qFirstNumber');
    let secondNumerLabel = document.getElementById('qSecondNumber');

    let fnum = randonInteger();
    let snum = randonInteger();

    //The operator is generated by getting the modulo of a random number
    //if an odd number SUBTRACT and if even then ADD.  

    let operator = isEven(randonInteger());
    if (operator===true) {
        operatorLabel.innerHTML = "+"
    }
    else{
        operatorLabel.innerHTML = "-"
        if(fnum<snum){
            let temp = snum;
            snum = fnum;
            fnum = temp;
        }
    }
    firstNumberLabel.innerHTML = fnum;
    secondNumerLabel.innerHTML = snum;
}

function randonInteger(){
    //Create a random integer less than 10.
    return Math.floor(Math.random() * (11 - 1 + 1)) + 1;
}

function isEven(number) {
    let even = Boolean(false);
    if(number % 2 === 0){
        even = true;
    }
    return even;
}

//Listener for Button Click
document.getElementById("runBtn").addEventListener("click", main);