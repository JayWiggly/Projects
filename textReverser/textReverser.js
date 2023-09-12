function main(){ 
    let userText = document.getElementById('inputText');
    if(userText.value!=""){
        let reversedText = reverseString(userText.value);
        let result = document.getElementById("result");
        result.innerHTML = reversedText;
        userText.value="";
    }
}

function reverseString(textString){
    let reversedString = "";
    for (let i = textString.length - 1; i >= 0; i--) {
        reversedString = reversedString + textString[i];        
    }
    return reversedString;
}

//Listener for Button Click
document.getElementById("runBtn").addEventListener("click", main);