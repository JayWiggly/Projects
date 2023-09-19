function main(){
    //Everything runs from here once submit is selected
    clearTable('differenceTable');
    clearTable('byteTable');
    document.getElementById('summaryOfChanges').innerHTML = "";
    document.getElementById('changeTable').innerHTML = "";
    document.getElementById('allDataTable').innerHTML = "";
    const dh = document.getElementById('historyDID');
    const dc = document.getElementById('currentDID');

    console.log("History = " + dh.value);
    console.log("Current = " + dc.value);

    if(dh.value!="" && dc.value!=""){
        dh.value = removeSpaces(dh.value);
        dc.value = removeSpaces(dc.value);
        dh.value = removeComma(dh.value);
        dc.value = removeComma(dc.value);

        let { valueOne, valueTwo } = equalizeLength(dh,dc);       


        if (lengthMatchCheck(dh,dc)==true){
            if (evenCharsCheck(dh,dc)==true) {
                const historyList = populateLists(dh);
                printLists(historyList, "History");
                const currentList = populateLists(dc);
                printLists(currentList, "Current");
                const matches = differenceCheck(historyList,currentList);
                printLists(matches, "Matches");            
                const historyLabel = paintDifferences(historyList, matches, "#EC7063", "History");
                const currentLabel = paintDifferences(currentList, matches, "#3498DB", "Current");
                document.getElementById('summaryOfChanges').innerHTML = "Summary";
                document.getElementById('displayHistory').innerHTML = historyLabel;
                document.getElementById('displayCurrent').innerHTML = currentLabel;
                document.getElementById('changeTable').innerHTML = "Byte Differences";
                document.getElementById('allDataTable').innerHTML = "All Bytes";
                document.getElementById("historyDID").value = new String();
                document.getElementById("currentDID").value = new String();
                generateDiffTable(historyList, currentList, matches);
                generateBytesTable(historyList, currentList, matches);
            } 
            else{
                document.getElementById('displayHistory').innerHTML = "Invalid Data - Check Number Of Bytes";
                document.getElementById('displayCurrent').innerHTML = "";
            }
        }
    }
    else{
        document.getElementById('displayHistory').innerHTML = "Enter Valid Data In Both Fields";
        document.getElementById('displayCurrent').innerHTML = "";
    }
}

function lengthMatchCheck(val1, val2){
    //Do both strings have the same number of characters
    var l1 = val1.value.length;
    var l2 = val2.value.length;    
    console.log("lengthMatchCheck" + "val1 Length = " + l1);
    console.log("lengthMatchCheck" + "val2 Length = " + l2);
    var rtnValue = new Boolean(false);
    if (l1==l2)    { 
        console.log("Lengths Match")
        rtnValue=true;
    }
    else    {
        console.log("Lengths Do Not Match");
        rtnValue=false;
    }
    return rtnValue;
}

function equalizeLength(val1, val2){
    //Pad the shorter length with garbage
    var l1 = val1.value.length;
    var l2 = val2.value.length;    
    console.log("equalizeLength" + "val1 Length = " + l1);
    console.log("equalizeLength" + "val2 Length = " + l2);

    if (l1!=l2) { 
        let difference;
        let changeVal1 = false;
        if (l1>l2) {
            difference = l1-l2;
            changeVal1 = false;            
        }
        else if (l2>l1) {
            difference = l2-l1;
            changeVal1 = true;
        }
        
        let buffer = "";
        for (let i = 0; i < difference; i++) {
            buffer = buffer + "X";
        }

        if (changeVal1) {
            val1.value = val1.value  + buffer;
        }   
        else{
            val2.value  = val2.value  + buffer;
        }
    }

    return {val1, val2};
}

function evenCharsCheck(val1, val2){
    //Do both strings have an even number of characters
    var l1 = val1.value.length % 2;
    var l2 = val2.value.length % 2;    
    console.log("lengthMatchCheck" + "val1 Modulo 2 = " + l1);
    console.log("lengthMatchCheck" + "val2 Modulo 2 = " + l2);
    var rtnValue = new Boolean(false);
    if ((l1!=0)&&(l2!=0)) {
        console.log("Failed Modulo 2")
        rtnValue=false;
    }
    else{
        console.log("Passed Modulo 2")
        rtnValue=true;
    }
    return rtnValue;
}

function removeSpaces(input){
    //Remove all whitespaces from the input string
    console.log("removeSpaces");
    console.log("input before = " + input);
    input = input.replace(/\s/g, '');
    console.log("input after = " + input);
    return input;
}

function removeComma(input){
    //Remove all commas from the input string
    console.log("removeCommas");
    console.log("input before = " + input);
    input = input.replace(/,/g,'');
    console.log("input after = " + input);
    return input;
}

function populateLists(val){
    //Create and populate a list of bytes
    let count = val.value.length;
    let list = [count];
    let byteSize = 2;
    let listIndex = 0;

    for (let index = 0; index < count; index++) {             
        if (index%2==0) {
            list[listIndex] = val.value.toString().substr(index,byteSize);
            listIndex++;
        }           
    }
    return list;
}

function printLists(list, name){
    //Prints all the values in a list
    var length = list.length;
    console.log("\nprintLists - name " + name );
    console.log("List length = " + list.length);
    for (let index = 0; index < length; index++) {
        console.log("printLists - List [" + index.toString() + "] = " + list[index]);
    }

}

function differenceCheck(list1, list2) {
    //Create and return a list of index differences between two strings
    let count = list1.length;
    let differnceList = [];
    let matchIndex = 0;
    for (let index = 0; index < count; index++) {
        if (list1[index]!=list2[index]) {
            differnceList[matchIndex] = index;
            matchIndex++;
        }        
    }
    return differnceList;
}

function paintDifferences(list, differences, color, label){
    //return a string to display the differnces in red, matches in black
    let strVal = "";
    let count = list.length;
    let countDiffs = differences.length;
    let black = new Boolean(false);
    let indexMatch = 0;
    let copyableStr = ""

    for (let index = 0; index < count; index++) {  

        if (indexMatch<=differences.length){
            if (differences[indexMatch]==index){
                strVal = strVal + "<strong><font color='" + color + "'>" + list[index] + " " + "</font color></strong>";
                copyableStr = copyableStr + "<strong><font color='" + color + "'>" + list[index] + "</font color></strong>";
                indexMatch++;
            }
            else{
                black = true;
            }
        }
        else{
            black = true;
        }
        if (black==true) {
            strVal = strVal + "<font color='black'>" + list[index] + " " + "</font color>"; 
            copyableStr = copyableStr + "<font color='black'>" + list[index] + "</font color>"; 
            black = false;
        }       
    }

    strVal = copyableStr + " - " + label;
    return strVal;
}

function clearTable(tableID){
    //Need to clear the table for the next comparison
    let table = document.getElementById(tableID);
    if (table.rows.length>=0) {
        for(var i = 1;i<table.rows.length;){
            table.deleteRow(i);
        }
        
    }
    table.deleteTHead();
}

function generateDiffTable(list1, list2, differences) {
    //Generates the table header, rows and data
    let table = document.getElementById('differenceTable');
    let tableHeader = table.createTHead();
    let didRow = tableHeader.insertRow(0);
    let didCell0 = didRow.insertCell(0);
    let didCell1 = didRow.insertCell(1);
    let didCell2 = didRow.insertCell(2);
    let didCell3 = didRow.insertCell(3);
    let didCell4 = didRow.insertCell(4);
    let didCell5 = didRow.insertCell(5);

    didCell0.innerHTML = "Byte Number";
    didCell1.innerHTML = "Byte History";
    didCell2.innerHTML = "Byte Current";
    didCell3.innerHTML = "Binary History";
    didCell4.innerHTML = "Binary Current";
    didCell5.innerHTML = "Bit Differences";

    let count = differences.length;
    let tbleRowCount = 1;

    for (let index = 0; index < count; index++) {
        let didRowData = tableHeader.insertRow(tbleRowCount);
        let didCellData0 = didRowData.insertCell(0);
        let didCellData1 = didRowData.insertCell(1);
        let didCellData2 = didRowData.insertCell(2);
        let didCellData3 = didRowData.insertCell(3);
        let didCellData4 = didRowData.insertCell(4);
        let didCellData5 = didRowData.insertCell(5);
        
        let byteNumber = differences[index]+1;
        didCellData0.innerHTML = "<mark>" + byteNumber + "</mark>";
        didCellData1.innerHTML = "<strong><font color='#EC7063'></strong>" + list1[differences[index]] + "</font color>";
        didCellData2.innerHTML = "<strong><font color='#3498DB'></strong>" + list2[differences[index]] + "</font color>";
        let binaryHistory = byteToBinary(list1[differences[index]]);
        let binaryCurrent = byteToBinary(list2[differences[index]]);   
        let binDiffs = binaryDifferences(binaryHistory, binaryCurrent)
        didCellData3.innerHTML = formatBinary(binaryHistory,binDiffs,"white", "#EC7063");
        didCellData4.innerHTML = formatBinary(binaryCurrent,binDiffs,"white", "#3498DB");
        didCellData5.innerHTML = binaryDifferenceString(binDiffs);

        tbleRowCount++;
    }
  }

  function generateBytesTable(list1, list2, differences) {
    //Generates the table header, rows and data
    let table = document.getElementById('byteTable');
    let tableHeader = table.createTHead();
    let didRow = tableHeader.insertRow(0);
    let didCell0 = didRow.insertCell(0);
    let didCell1 = didRow.insertCell(1);
    let didCell2 = didRow.insertCell(2);
    let didCell3 = didRow.insertCell(3);
    let didCell4 = didRow.insertCell(4);
    let didCell5 = didRow.insertCell(5);

    didCell0.innerHTML = "Byte Number";
    didCell1.innerHTML = "Byte History";
    didCell2.innerHTML = "Byte Current";
    didCell3.innerHTML = "Binary History";
    didCell4.innerHTML = "Binary Current";
    didCell5.innerHTML = "Bit Differences";

    let tbleRowCount = 1;

    for (let index = 0; index < list1.length; index++) {
        let didRowData = tableHeader.insertRow(tbleRowCount);
        let didCellData0 = didRowData.insertCell(0);
        let didCellData1 = didRowData.insertCell(1);
        let didCellData2 = didRowData.insertCell(2);
        let didCellData3 = didRowData.insertCell(3);
        let didCellData4 = didRowData.insertCell(4);
        let didCellData5 = didRowData.insertCell(5);
        
        
        let diff = false;
        for (let indexD = 0; indexD < differences.length; indexD++) {
            if (index==differences[indexD]) {
                let byteNumber = index + 1;
                didCellData0.innerHTML = "<mark>" + byteNumber + "</mark>";
                didCellData1.innerHTML = "<strong><font color='#EC7063'></strong>" + list1[index] + "</font color>";
                didCellData2.innerHTML = "<strong><font color='#3498DB'></strong>" + list2[index] + "</font color>";

                let binaryHistory = byteToBinary(list1[index]);
                let binaryCurrent = byteToBinary(list2[index]);   
                let binDiffs = binaryDifferences(binaryHistory, binaryCurrent)

                didCellData3.innerHTML = formatBinary(binaryHistory,binDiffs,"white", "#EC7063");
                didCellData4.innerHTML = formatBinary(binaryCurrent,binDiffs,"white", "#3498DB");
                didCellData5.innerHTML = binaryDifferenceString(binDiffs);
                diff = true;
                break;
            }
        }
        if (diff==false) {
            didCellData0.innerHTML = index+1;
            didCellData1.innerHTML = list1[index];
            didCellData2.innerHTML = list2[index];
            let binaryHistory = byteToBinary(list1[index]);
            let binaryCurrent = byteToBinary(list2[index]);   
            let binDiffs = "";
            didCellData3.innerHTML = formatBinary(binaryHistory,binDiffs,"black", "white");
            didCellData4.innerHTML = formatBinary(binaryCurrent,binDiffs,"black", "white");
            didCellData5.innerHTML = "";
        }           
        tbleRowCount++;
    }
  }

function byteToBinary(data){
    //Converts a byte into binary
    console.log("Byte = " + data.toString());
    let bin = parseInt(data, 16).toString(2).padStart(8, '0');    
    //console.log("Binary = " + bin);
    return bin;
}

function binaryDifferences(binaryHistory, binaryCurrent){
    //Creates a list of positions where the bit is different
    let length = 8;
    let binDiffs = [];
    let bfIndex = 0;
    for (let index = 0; index < length; index++) {
        if (binaryHistory[index]!=binaryCurrent[index]) {
            binDiffs[bfIndex] = index;
            bfIndex++;
        }        
    }
    return binDiffs;
}


function formatBinary(binary, binDiffs, fontColour, backColour){
    //Formats the bit differences
    let newBinary = "";
    let paint = false;

    length = binary.length;    
    diffLength = binDiffs.length;

    for (let index = 0; index < length; index++) {
        for (let indexDiff = 0; indexDiff < diffLength; indexDiff++) {
            if (index==binDiffs[indexDiff]) {
                paint = true;
                break;
            }
            else{
                paint = false;
            }           
        }
        if (paint == true) {
            newBinary = newBinary + "<font style='background-color:" + backColour + "'><font color='" + fontColour + "'>" + binary[index] + "</font color></font>"; 
        }
        else{
            newBinary = newBinary + binary[index];
        }
    }
    return newBinary;
}

function binaryDifferenceString(binDiffs){
    //Creates a string of bit positions where data is different
    let rtnString = ""
    let temp = 0;
    if (binDiffs.length>0) {   
        let length = binDiffs.length;
        for (let index = 0; index < length; index++) {
            console.log("Binary Differnces [" + index + "] = " + binDiffs[index]);
            temp = 7 - binDiffs[index];  
            if (rtnString == ""){                           
                rtnString = temp;
            }
            else{
                rtnString = rtnString + " " + temp;
            }
        }
    }
    return rtnString;
}

//Listener for Button Click
document.getElementById("submitBtn").addEventListener("click", main);