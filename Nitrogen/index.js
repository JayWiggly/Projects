class FlashAction {
    constructor(description, id, parser, revision, targetNode, assemblyList){
    this.description = description;
    this.id = id;
    this.parser = parser;
    this.revision = revision;
    this.targetNode = targetNode;
    this.assemblyList = assemblyList;
    }
}

class FlashActionList {
    constructor(){
        this.flashActions = []
    }
    
    addFlashActionLToList(description, id, parser, revision, targetNode, assemblyList){
        let flashActionItem = new FlashAction(description, id, parser, revision, targetNode, assemblyList)
        this.flashActions.push(flashActionItem)
        return this.flashActionListItem
    }

    get getFAL(){
        return this.flashActions
    }

    get getFALLength(){
        return this.flashActions.length;
    }
}

class AssemblyItem {
    constructor(directivesFileDownloadId, assemblyDID, available, current, haRevision, haNumber, nodeAddress, softwareAndConfig){
        this.directivesFileDownloadId = directivesFileDownloadId;
        this.assemblyDID = assemblyDID;
        this.available = available;
        this.current = current;
        this.haRevision = haRevision;
        this.haNumber = haNumber;
        this.nodeAddress = nodeAddress;
        this.softwareAndConfig = softwareAndConfig;
    }
}

class AssemblyList {
    constructor(){
        this.assemblyList = []
    }
    
    addToAssemblyList(directivesFileDownloadId, assemblyDID, available, current, haRevision, haNumber, nodeAddress, softwareAndConfig){
        let assemblyItem = new AssemblyItem(directivesFileDownloadId, assemblyDID, available, current, haRevision, haNumber, nodeAddress, softwareAndConfig)
        this.assemblyList.push(assemblyItem)
        return this.assemblyItem
    }

    get getAssemblies(){
        return this.assemblyList
    }

    get lengthAssemblies(){
        return this.assemblyList.length;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////    

class Warning {
    constructor(nodeAddress, code, source, details){
        this.nodeAddress = nodeAddress;
        this.code = code;
        this.source = source;
        this.details = details;
    }
}

class Warnings {
    constructor(){
        this.warnings = []
    }
    
    addWarning(nodeAddress, code, source, details){
        let warning = new Warning(nodeAddress, code, source, details)
        this.warnings.push(warning)
        return this.warning
    }

    get getWarnings(){
        return this.warnings
    }

    get lengthWarnings(){
        return this.warnings.length;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////    

class NodeInfo {
    constructor(commsProtocol, address, acronym, stateUpdateRole, stateUpdateRoleSource, stateUpdateRoleEvent, stateUpdateRoleDesc, stateUpdateRoleID, stateChangeDate, currentOrHistory, derivedAssembly){
        this.commsProtocol = commsProtocol;
        this.address = address;
        this.acronym = acronym;
        this.stateUpdateRole = stateUpdateRole;
        this.stateUpdateRoleSource = stateUpdateRoleSource;
        this.stateUpdateRoleEvent = stateUpdateRoleEvent;
        this.stateUpdateRoleDesc = stateUpdateRoleDesc;
        this.stateUpdateRoleID = stateUpdateRoleID;
        this.stateChangeDate = stateChangeDate;
        this.currentOrHistory = currentOrHistory;    
        this.derivedAssembly = derivedAssembly;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////    
            
class Parameter {
    constructor(didType, didValue, response, isConfig){
        this.didType = didType;
        this.didValue = didValue;
        this.response = response;
        this.isConfig = isConfig;
    }
}

class Parameters {
    constructor(){
        this.dids = []
    }
    
    addDid(didType, didValue, response, isConfig){
        let did = new Parameter(didType, didValue, response, isConfig)
        this.dids.push(did)
        return this.did
    }

    get getDids(){
        return this.dids
    }

    get numberOfDids(){
        return this.dids.length;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////    

class NodeData {
    constructor(nodeInfo, dids){
        this.nodeInfo = nodeInfo;
        this.dids = dids;
    }
}

class Nodes{
    constructor(){
        this.nodes = []
    }

    addNode(nodeInfo, dids){
        let node = new NodeData(nodeInfo, dids)
        this.nodes.push(node)
        return this.nodes
    } 

    get getNodes(){
        return this.nodes;
    }

    get getNumberOfNodes(){
        return this.nodes.length;
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////

let vin = "";
let nodeList = new Nodes(); // NodeInfo, DIDS
let HistoryPresent = false;
let EngineerDealer = "";
let vehicleProgram = ""
let modelYear = "";


function main(){ //Run Pressed
    let flashActionList = new FlashActionList(); // Flash Action List
    //RESET Everything
    let warningImage = document.getElementById('WarningImage');
    warningImage.setAttribute("hidden", "hidden");
    let warningText = document.getElementById('WarningText');
    warningText.setAttribute("hidden", "hidden");
  
    let falImage = document.getElementById('FALImage');
    falImage.setAttribute("hidden", "hidden");
    let falText = document.getElementById('FALText');
    falText.setAttribute("hidden", "hidden");

    vin = "";
    nodeList = null;
    nodeList = new Nodes();
    HistoryPresent = false;
    clearTable("NodeTable");
    clearTable("FALTable");
    let falLabel = document.getElementById('FALTableText');
    falLabel.setAttribute("hidden", "hidden");
    document.getElementById('FDSPMode').innerHTML = "";
    document.getElementById('DisplayVIN').innerHTML = "";
    document.getElementById('DisplayNode').innerHTML = "";

    let flashActionListChildren;
    let warningsArray = new Warnings();
    const fdsp = document.getElementById('xmlInput');
    if(fdsp.value!=""){
        const vehicleModel = new DOMParser().parseFromString(fdsp.value, "text/xml");        
        let vehicleModelElement = vehicleModel.documentElement;
        let vehicleModelChildren = vehicleModelElement.children;
        //constructor(commsProtocol, address, acronym, stateUpdateRole, stateUpdateRoleSource, stateUpdateRoleEvent, stateUpdateRoleDesc, stateUpdateRoleID, stateChangeDate, currentOrHistory)
        let nodeInfo = new NodeInfo();
        let derivedAssembly = new Parameter();
        let DID = new Parameter();
        let partNumbersAndDids = new Parameters();
        let stateAndDerivedAssembly = null;
        let warning = new Warning();
       
        ////////////////////////Harvest the Vehicle Model catagories////////////////////////////////
        let vehicleModuleInfoRequestChildren;
        let vehicleChildren;
        let warningChildren;
        let vehicleModelYearChildren;

        for(var i =0; i< vehicleModelChildren.length; i++) {

            if (vehicleModelChildren[i].nodeName == 'ns2:VehicleModuleInfoRequest'){
                vehicleModuleInfoRequestChildren = vehicleModelChildren[i].children; 
            }

            if (vehicleModelChildren[i].nodeName == 'ns2:Vehicle'){
                vehicleChildren = vehicleModelChildren[i].children;
            }

            if (vehicleModelChildren[i].nodeName == 'ns2:FlashActionList'){
                flashActionListChildren = vehicleModelChildren[i].children;
            }

            if (vehicleModelChildren[i].nodeName == 'ns2:Warning'){
                warningChildren = vehicleModelChildren[i].children;

                let x = vehicleModelChildren[i].getAttribute("nodeAddress");
                console.log();
                 //Populate Warning Array - Need to do it here due to the way it is nested in the root XML.
                 warning = new Warning();
                 warning.nodeAddress = vehicleModelChildren[i].getAttribute("nodeAddress");
                 warning.code = vehicleModelChildren[i].children[0].textContent;
                 warning.source = vehicleModelChildren[i].children[1].textContent;
                 warning.details = vehicleModelChildren[i].children[2].textContent;
                 warningsArray.addWarning(warning.nodeAddress, warning.code, warning.source, warning.details);
                 warning = null;    
            }

            if (vehicleModelChildren[i].nodeName == 'ns2:VehicleModelYear'){
                vehicleModelYearChildren = vehicleModelChildren[i].children;
            }

        }

        //////////////////////// Catagories harvested.  Now harvest the FDSP VIN and Role ////////////////////////////////        

        for (let j = 0; j < vehicleModuleInfoRequestChildren.length; j++) {
            if (vehicleModuleInfoRequestChildren[j].tagName ==='ns2:VIN') {                        
                vin = vehicleModuleInfoRequestChildren[j].textContent;                        
            }
            if (vehicleModuleInfoRequestChildren[j].tagName ==='ns2:RequestRole') {
                for (let k = 0; k < vehicleModuleInfoRequestChildren[j].children.length; k++) {
                    
                    if (vehicleModuleInfoRequestChildren[j].children[k].tagName ==='ns3:Role') {                        
                        EngineerDealer = vehicleModuleInfoRequestChildren[j].children[k].textContent;
                        break;                      
                    }
                }
                console.log();
                break;
            }      
        }                 

        //////////////////////// FDSP VIN and Role harvested. Now harvest the CDL ////////////////////////////////    
        let CDLChildren;
        for(var i =0; i< vehicleChildren.length; i++) {
            console.log(vehicleChildren[i].nodeName.toString());
            if (vehicleChildren[i].nodeName == "ns3:CurrentDIDList"){

                CDLChildren = vehicleChildren[i].children;
                console.log("We've found CDL.")
                break;
            }

        }
        
        //////////////////////// CDL harvested. Now harvest the individual node data from CDL list //////////////////////////////// 

        for (let index = 0; index < CDLChildren.length; index++) {
            nodeInfo.commsProtocol = CDLChildren[index].getAttribute("specificationCategory");  //GGDS

            for (let node_index = 0; node_index < CDLChildren[index].children.length; node_index++) {
                
                if (CDLChildren[index].children[node_index].localName == "Address") {     //Node Address
                    nodeInfo.address = CDLChildren[index].children[node_index].textContent;
                }
                
                if (CDLChildren[index].children[node_index].localName == "ECUAcronym") {      //Node Name
                    nodeInfo.acronym = CDLChildren[index].children[node_index].getAttribute("name")
                    stateAndDerivedAssembly = CDLChildren[index].children[node_index];
                }            
            }


            for (let i = 0; i < stateAndDerivedAssembly.children.length; i++) {
                if (stateAndDerivedAssembly.children[i].localName == "State"){
                    for (let k = 0; k < stateAndDerivedAssembly.children[i].children.length; k++) {
                        //Start - StateUpdateRole//////////////////////////////////////////////////////////////////////////////////////
                        if (stateAndDerivedAssembly.children[i].children[k].localName == "StateUpdateRole"){
                            for (let j = 0; j < stateAndDerivedAssembly.children[i].children[k].children.length; j++) {
                                if (stateAndDerivedAssembly.children[i].children[k].children[j].localName == "Role"){
                                    nodeInfo.stateUpdateRole = stateAndDerivedAssembly.children[i].children[k].children[j].textContent;
                                }

                                if (stateAndDerivedAssembly.children[i].children[k].children[j].localName == "RoleSource"){
                                    nodeInfo.stateUpdateRoleSource = stateAndDerivedAssembly.children[i].children[k].children[j].textContent;
                                }
                                
                                if (stateAndDerivedAssembly.children[i].children[k].children[j].localName == "RoleID"){
                                    nodeInfo.stateUpdateRoleID = stateAndDerivedAssembly.children[i].children[k].children[j].textContent;
                                }

                                if (stateAndDerivedAssembly.children[i].children[k].children[j].localName == "RoleEvent"){
                                    nodeInfo.stateUpdateRoleEvent = stateAndDerivedAssembly.children[i].children[k].children[j].textContent;
                                }    

                                if (stateAndDerivedAssembly.children[i].children[k].children[j].localName == "RoleDesc"){
                                    nodeInfo.stateUpdateRoleDesc = stateAndDerivedAssembly.children[i].children[k].children[j].textContent;
                                }
                            }            
                        }

                        if (stateAndDerivedAssembly.children[i].children[k].localName  == "StateChangeDateTime"){
                            nodeInfo.stateChangeDate = stateAndDerivedAssembly.children[i].children[k].textContent;
                        }
            
                        if (stateAndDerivedAssembly.children[i].children[k].localName  == "GatewayListState"){
                            nodeInfo.currentOrHistory = stateAndDerivedAssembly.children[i].children[k].textContent;
                            if (HistoryPresent===false){
                                if (stateAndDerivedAssembly.children[i].children[k].textContent === "HISTORY"){
                                        HistoryPresent = true;
                                }
                            }
                        }

                        //Get DIDS                    
                        if (stateAndDerivedAssembly.children[i].children[k].localName  == "Gateway"){
                            let dids = stateAndDerivedAssembly.children[i].children[k].children;
                            for (let j = 0; j < dids.length; j++) {
                                DID = new Parameter();
                                DID.didType = stateAndDerivedAssembly.children[i].children[k].children[j].getAttribute("didType");
                                DID.didValue = stateAndDerivedAssembly.children[i].children[k].children[j].getAttribute("didValue");
                                for (let y = 0; y < stateAndDerivedAssembly.children[i].children[k].children[j].children.length; y++) {
                                    if (stateAndDerivedAssembly.children[i].children[k].children[j].children[y].localName=="Response"){
                                        DID.response = stateAndDerivedAssembly.children[i].children[k].children[j].children[y].textContent; 
                                    }
                                    if (stateAndDerivedAssembly.children[i].children[k].children[j].children[y].localName=="IsConfig"){
                                        DID.isConfig = stateAndDerivedAssembly.children[i].children[k].children[j].children[y].textContent; 
                                    }                                
                                }
                                partNumbersAndDids.addDid(new Parameter(DID.didType, DID.didValue, DID.response, DID.isConfig));
                                DID = null;                     
                            }
                        }

                    }//'for k' Current/History

                    nodeList.addNode(new NodeInfo(nodeInfo.commsProtocol, nodeInfo.address, nodeInfo.acronym, nodeInfo.stateUpdateRole, nodeInfo.stateUpdateRoleSource, nodeInfo.stateUpdateRoleEvent, 
                        nodeInfo.stateUpdateRoleDesc, nodeInfo.stateUpdateRoleID, nodeInfo.stateChangeDate, nodeInfo.currentOrHistory, nodeInfo.derivedAssembly)
                        ,partNumbersAndDids);
                    partNumbersAndDids = null;
                    partNumbersAndDids = new Parameters();

                    nodeInfo.stateUpdateRole = "";
                    nodeInfo.stateUpdateRoleSource = "";
                    nodeInfo.stateUpdateRoleEvent = "";
                    nodeInfo.stateUpdateRoleDesc = "";
                    nodeInfo.stateUpdateRoleID = "";

                } //if 'State'



                if (stateAndDerivedAssembly.children[i].localName == "DerivedAssembly"){
                    derivedAssembly = new Parameter();
                    for (let k = 0; k < stateAndDerivedAssembly.children[i].children.length; k++) {
                        if (stateAndDerivedAssembly.children[i].children[k].localName == "DID"){
                            for (let j = 0; j < stateAndDerivedAssembly.children[i].children[k].children.length; j++) {
                                derivedAssembly.didType = stateAndDerivedAssembly.children[i].children[k].getAttribute("didType");
                                derivedAssembly.didValue = stateAndDerivedAssembly.children[i].children[k].getAttribute("didValue");
                                //break;
                            }
                        }

                        for (let j = 0; j < stateAndDerivedAssembly.children[i].children[k].children.length; j++) {
                            if (stateAndDerivedAssembly.children[i].children[k].children[j].localName == "Response"){
                                derivedAssembly.response = stateAndDerivedAssembly.children[i].children[k].children[j].textContent;
                                //break;
                            }
                        }
                    }
                    let nodeListLength = nodeList.getNumberOfNodes;
                    let listOfNodes = nodeList.getNodes;
                    listOfNodes[nodeListLength-1].nodeInfo.derivedAssembly = new Parameter(derivedAssembly.didType,derivedAssembly.didValue,derivedAssembly.response,derivedAssembly.isConfig);
                    derivedAssembly = null;
                }

                console.log();
        
            }//for i
            
        }
        //////////////////////// Individual node data from CDL list harvested. //////////////////////////////// 
        //////////////////////// Now harvest vehicle program and year. //////////////////////////////// 

        for (let j = 0; j < vehicleModelYearChildren.length; j++) {
            if (vehicleModelYearChildren[j].tagName ==='ns3:ProgramCode') {                        
                vehicleProgram = vehicleModelYearChildren[j].textContent;                        
            }
            if (vehicleModelYearChildren[j].tagName ==='ns3:ModelYear') {                        
                modelYear = vehicleModelYearChildren[j].textContent;  
                break;                      
            }
        }
        

        console.log("FDSP Field - is not empty")
    }
    else{
        alert("Enter a valid 'Vehicle Module Info Service' result XML.")
        console.log("FDSP Field - is empty")
    }

    let listOfNodes = nodeList.getNodes;

    if (listOfNodes!=0) {
        let dropDown = document.getElementById('dropdownMenuButton1');
        dropDown.removeAttribute("hidden");
        let dropMsg = document.getElementById('dropMsg');
        dropMsg.removeAttribute("hidden");

        // PopulateComboBox(listOfNodes, warningsArray, flashActionList);
        // let listCount = document.getElementById("comboxList").getElementsByTagName("li").length;
        // console.log("listCount = " + listCount);

        ///////////////////// Display Warning Symbol and Warning Text /////////////////////
        if (warningsArray.lengthWarnings !== 0) {   
            ///////////////////// Display Warning Symbol /////////////////////         
            let warningImage = document.getElementById('WarningImage');
            warningImage.src = "assets/images/Warning.png";
            warningImage.width = "50";
            warningImage.height = "50";
            ///////////////////// Display Warning Text /////////////////////
            let x = document.getElementById('DisplayNode');
            let y = x.textContent;
            let warningMessage = "(";
            let localWarnings = warningsArray.getWarnings;
            for (let i = 0; i < localWarnings.length; i++) {
                if (warningMessage !== "(") {
                    warningMessage = warningMessage + " ";  
                }
                warningMessage = warningMessage + "0x" + localWarnings[i].nodeAddress;         
             }
             warningMessage = warningMessage + ")";

             let warningText = document.getElementById("WarningText");
             warningText.innerHTML = warningMessage;
             
             warningText.removeAttribute("hidden");  
             warningImage.removeAttribute("hidden");   

        }
           /////////////////// Flash Action List /////////////////////

    //let flashActionList = new FlashActionList(); // Flash Action List

    if (typeof flashActionListChildren !== 'undefined') {
        let flashAction = new FlashAction();  
        for (let i = 0; i < flashActionListChildren.length; i++) {
            //Check for flash action and add to the list
            
            let currntFlashAction = flashActionListChildren[i];
            if (currntFlashAction.attributes.length>2) { // If it has more than 2 attributes then a flash action has been found.

                /////////////////////////////////////////////
                //Get the flash action details
                
                flashAction.description = currntFlashAction.getAttribute("description");
                flashAction.id = currntFlashAction.getAttribute("id");
                flashAction.parser = currntFlashAction.getAttribute("parser");
                flashAction.revision = currntFlashAction.getAttribute("revision");
                flashAction.targetNode = currntFlashAction.getAttribute("targetNode");

                //Loop through the assemblies

                let assemblyList = new AssemblyList();

                for (let k = 0; k < currntFlashAction.children.length; k++) {
                    if (currntFlashAction.children[k].tagName==="ns3:Assembly") {

                        let assemblyItem = new AssemblyItem();

                        if (currntFlashAction.children[k].hasAttribute("DirectivesFileDownloadId")) {
                            assemblyItem.directivesFileDownloadId = currntFlashAction.children[k].getAttribute("DirectivesFileDownloadId");
                        }
                        assemblyItem.assemblyDID = currntFlashAction.children[k].getAttribute("assemblyPartNumberDID");
                        assemblyItem.available = currntFlashAction.children[k].getAttribute("availableAssy");
                        assemblyItem.current = currntFlashAction.children[k].getAttribute("currentAssy");                        
                        
                        //Get Has Action # and NodeInfo Parts and Config
                        let softwareAndConfig = new Parameters();
                        for (let j = 0; j < currntFlashAction.children[k].children.length; j++) {

                            let z = currntFlashAction.children[k].children[j];

                            if (z.nodeName==="ns3:HasActionID") {
                                assemblyItem.haNumber = currntFlashAction.children[k].children[j].textContent;
                                assemblyItem.haRevision = currntFlashAction.children[k].children[j].getAttribute("Revision");
                            }
                            
                            if (z.nodeName==="ns3:NodeInfo") {     
                                let x = currntFlashAction.children[k].children[j]; 
                                console.log("I="+ i +" K="+k+" J="+j);  
                                
                                if (currntFlashAction.children[k].children[j].hasAttribute("nodeAddress")) {
                                    assemblyItem.nodeAddress = currntFlashAction.children[k].children[j].getAttribute("nodeAddress");
                                }
                                
                                ////////////Capture Software and DIDS//////////////////////
                                let software = currntFlashAction.children[k].children[j].children;
                                //let softwareAndConfig = new Parameters();
                                let DID = new Parameter();
                                for (let q = 0; q < software.length; q++) {
                                    if (software[q].tagName==="ns3:Software") {
                                        DID.didType = software[q].getAttribute("type");
                                        DID.didValue = software[q].getAttribute("didValue");
                                        DID.response = software[q].getAttribute("partNumber");                                    
                                        DID.isConfig = "false"
                                        softwareAndConfig.addDid(DID.didType, DID.didValue, DID.response, DID.isConfig);
                                    }
                                    
                                    if (software[q].tagName==="ns3:ModifiedConfig") {
                                        DID.didType = software[q].getAttribute("didType");
                                        DID.didValue = software[q].getAttribute("didValue");
                                        for (let p = 0; p < software[q].children.length; p++) {
                                            if (software[q].children[p].tagName=="ns3:Response") {
                                                DID.response = software[q].children[p].textContent;
                                                break;
                                            }                                            
                                        }                                        
                                        DID.isConfig = "true"
                                        softwareAndConfig.addDid(DID.didType, DID.didValue, DID.response, DID.isConfig);
                                    }                                    
                                    DID = null;
                                    DID = new Parameter();
                                    console.log();                                
                                }         
                            }
                        } // Loop Software Part # and DIDs

                        console.log("assemblyItem.directivesFileDownloadId = " + assemblyItem.directivesFileDownloadId);
                        console.log("assemblyItem.assemblyDID = " + assemblyItem.assemblyDID);
                        console.log("assemblyItem.available = " + assemblyItem.available);
                        console.log("assemblyItem.current = " +  assemblyItem.current);
                        console.log("assemblyItem.haRevision = " + assemblyItem.haRevision);
                        console.log("assemblyItem.haNumber = " + assemblyItem.haNumber);
                        console.log("assemblyItem.nodeAddress = " + assemblyItem.nodeAddress);

                        assemblyItem.softwareAndConfig = softwareAndConfig;
                        softwareAndConfig = null;
                        softwareAndConfig = new Parameters();                            
                        assemblyList.addToAssemblyList(assemblyItem.directivesFileDownloadId, assemblyItem.assemblyDID, assemblyItem.available, assemblyItem.current, assemblyItem.haRevision, assemblyItem.haNumber, assemblyItem.nodeAddress, assemblyItem.softwareAndConfig);
                        assemblyItem = null;
                        console.log();
                    }
                    console.log();
                    flashAction.assemblyList = assemblyList;                

                } // Loop Assemblies
                flashActionList.addFlashActionLToList(flashAction.description, flashAction.id, flashAction.parser, flashAction.revision, flashAction.targetNode, flashAction.assemblyList);
                flashAction = null;
                flashAction = new FlashAction();  
                console.log();
            }
            console.log();
        }
    }

    console.log();
    /////////////////// I Have Harvested Flash Action List Data /////////////////////

    /////////////////// Display Flash Action List Icon /////////////////////

    let length = flashActionList.getFALLength;
    if (length!=0) {
            /////////////////// Display Flash Symbol /////////////////////  
            let falImage = document.getElementById('FALImage');
            falImage.src = "assets/images/Lightning.png";
            falImage.width = "50";
            falImage.height = "50";
            ///////////////////// Display Flash Action Nodes /////////////////////            
            let flashActionText = [];
            let fal = flashActionList.getFAL;
            for (let i = 0; i < length; i++) {
                let push = true;   
                let node = fal[i].targetNode;
                if (flashActionText.length!==0) {
                    for (let k = 0; k < flashActionText.length; k++) {
                        if (flashActionText[k]===node) {
                            //Already have the node.
                            push=false;
                            break;
                        }                        
                    }
                }

                if (push) {
                    flashActionText.push(node);
                }                    
            }

            let displayFALNodes = "(";
            for (let i = 0; i < flashActionText.length; i++) {
                if (displayFALNodes != "(") {
                    displayFALNodes = displayFALNodes + ", 0x" + flashActionText[i];  
                }
                else{
                    displayFALNodes = displayFALNodes + "0x" + flashActionText[i];                
                }
                
            }
            displayFALNodes = displayFALNodes + ")";
            console.log();   
            
            let falText = document.getElementById("FALText");
            falText.innerHTML = displayFALNodes;
            
            falText.removeAttribute("hidden");  
            falImage.removeAttribute("hidden");  
    }

    
    PopulateComboBox(listOfNodes, warningsArray, flashActionList);
    let listCount = document.getElementById("comboxList").getElementsByTagName("li").length;
    console.log("listCount = " + listCount);

} // End If 'There are Flash Actions'

    /////////////////// Display Flash Action List Table /////////////////////
    
    //Does the FAL item have a description?  If not, fill description with 'FENIX'

    //Description
    //ID and revision (if FENIX populae with ID and not revision as they are the same value)
    //MR or PMI
    //AssemblyDID current availble




     ///////////////////// Reset XML Text Box  /////////////////////
    let textBox = document.getElementById('xmlInput')        
    textBox.value = "";
    textBox.setAttribute('placeholder', "To view GIVIS/GVMS data (HISTORY, CURRENT, AVAILABLE, WARNING), paste the full and complete XML result of a 'Vehicle Module Info Service' FDSP call here and select 'Run'");


}//Main


/////////////////// Display Flash Action List Table /////////////////////
function PopulateFALTable(flashActionList, targetNode){

    /* Search through the FAL data for the targetNode

    if (node found)

        Create Headings
        

        ///////////////  Table structure /////////////
        **Parent Table **
            targetNode
            id
            revision
            parser (MR/PMI)
            description
            Assemblies **Child Table ** 
                    directivesFileDownloadID
                    AssemblyDID
                    Current
                    Available
                    Has Action Number & Revision
                    Software & DIDS **Grandchild Table** 
                        DIDS


    */

    //Search through the FAL data for the targetNode
    let fal = flashActionList.getFAL;
    let length = flashActionList.getFALLength;
    let targetList = [];
    for (let i = 0; i < length; i++) {
        if (fal[i].targetNode == targetNode) {
            targetList.push(i);
        }        
    }

    //Check if node has FAL
    length = targetList.length;
    if (length>0) {

        //Display FAL message
        let falLabel = document.getElementById("FALTableText");
        falLabel.removeAttribute("hidden");  

        //Create Parent Table Headers
        let table = document.getElementById('FALTable');
        let tableHeader = table.createTHead();
        let tableBody = table.createTBody();
        tableHeader.setAttribute('class', 'table-dark sticky-top top-0');
    
        let rowIndex = 0;
        let columnIndex = 0;
        let headerRows = {};
        let headerCells = {};
        let headerHTML = {};
        headerRows["Row" + rowIndex] = tableHeader.insertRow(rowIndex); 
        headerCells["Cells" + rowIndex + columnIndex] = headerRows["Row" + rowIndex].insertCell(columnIndex);
        headerHTML["html" + rowIndex + columnIndex] = headerCells["Cells" + rowIndex + columnIndex].innerHTML = "<th scope='col'>" + "Node" + "</th>";
        columnIndex++;
        headerCells["Cells" + rowIndex + columnIndex] = headerRows["Row" + rowIndex].insertCell(columnIndex);
        headerHTML["html" + rowIndex + columnIndex] = headerCells["Cells" + rowIndex + columnIndex].innerHTML = "<th scope='col'>" + "MR/PMI" + "</th>";
        columnIndex++;
        headerCells["Cells" + rowIndex + columnIndex] = headerRows["Row" + rowIndex].insertCell(columnIndex);
        headerHTML["html" + rowIndex + columnIndex] = headerCells["Cells" + rowIndex + columnIndex].innerHTML = "<th scope='col'>" + "Service Action #" + "</th>";
        columnIndex++;
        headerCells["Cells" + rowIndex + columnIndex] = headerRows["Row" + rowIndex].insertCell(columnIndex);
        headerHTML["html" + rowIndex + columnIndex] = headerCells["Cells" + rowIndex + columnIndex].innerHTML = "<th scope='col'>" + "Description" + "</th>";
        columnIndex++;
        headerCells["Cells" + rowIndex + columnIndex] = headerRows["Row" + rowIndex].insertCell(columnIndex);
        headerHTML["html" + rowIndex + columnIndex] = headerCells["Cells" + rowIndex + columnIndex].innerHTML = "<th scope='col'>" + "Assembly" + "</th>";
        columnIndex++;
       
        rowIndex = 0; //Reset For Table Body
        columnIndex = 0;
        let bodyRows = {};
        let bodyCells = {};
        let bodyHTML = {};

        //Parse targetList
        for (let i = 0; i < length; i++) {

        
            bodyRows["Row" + rowIndex] = tableBody.insertRow(rowIndex); 
            
            /////////////////////////
            //Node
            bodyCells["Cells" + rowIndex + columnIndex] = bodyRows["Row" + rowIndex].insertCell(columnIndex);
            bodyHTML["html" + rowIndex + columnIndex] = bodyCells["Cells" + rowIndex + columnIndex].innerHTML = fal[targetList[i]].targetNode;
            columnIndex++;
            /////////////////////////
            //MR/PMI
            bodyCells["Cells" + rowIndex + columnIndex] = bodyRows["Row" + rowIndex].insertCell(columnIndex);
            bodyHTML["html" + rowIndex + columnIndex] = bodyCells["Cells" + rowIndex + columnIndex].innerHTML = fal[targetList[i]].parser;
            columnIndex++;
            /////////////////////////
            //Service Action
            // if revision is greater than 3 characters then don't add that to the service action #                        
            let serviceActionText = fal[targetList[i]].id;
            let revision = fal[targetList[i]].revision;
            if (revision.length<4) {
                serviceActionText = serviceActionText + ',' + revision;
            }            
            bodyCells["Cells" + rowIndex + columnIndex] = bodyRows["Row" + rowIndex].insertCell(columnIndex);
            bodyHTML["html" + rowIndex + columnIndex] = bodyCells["Cells" + rowIndex + columnIndex].innerHTML = serviceActionText;
            columnIndex++;
            /////////////////////////            
            //Description
            //if description === null
            // get directivesFileDownloadId and populate description

            let description = fal[targetList[i]].description;
            if (description===null) {
                if (fal[targetList[i]].assemblyList.lengthAssemblies > 0) {
                    if (typeof fal[targetList[i]].assemblyList.assemblyList[0].directivesFileDownloadId !== 'undefined') {
                        description = fal[targetList[i]].assemblyList.assemblyList[0].directivesFileDownloadId;
                    }
                }
            }

            bodyCells["Cells" + rowIndex + columnIndex] = bodyRows["Row" + rowIndex].insertCell(columnIndex);
            bodyHTML["html" + rowIndex + columnIndex] = bodyCells["Cells" + rowIndex + columnIndex].innerHTML = description;
            columnIndex++;

             /////////////////////////// AssemblyList /////////////////////////

            if (fal[targetList[i]].assemblyList.lengthAssemblies === 0) {
                let assemblyListText = "<font color='#ff0000' size='2'><i>Missing</i></font>";
                bodyCells["Cells" + rowIndex + columnIndex] = bodyRows["Row" + rowIndex].insertCell(columnIndex);
                bodyHTML["html" + rowIndex + columnIndex] = bodyCells["Cells" + rowIndex + columnIndex].innerHTML = assemblyListText;                
            }
            if (fal[targetList[i]].assemblyList.lengthAssemblies > 0) {
                //Create Assembly List Item Table.

                bodyCells["Cells" + rowIndex + columnIndex] = bodyRows["Row" + rowIndex].insertCell(columnIndex);
                let assemblyTable = document.createElement('table');
                let assemblyTableHeader = assemblyTable.createTHead();
                let assemblyTableBody = assemblyTable.createTBody();
                assemblyTableHeader.setAttribute('class', 'table-dark sticky-top top-0');
                assemblyRowIndex = 0; 
                assemblyColumnIndex = 0;
                let assemblyHeaderRows = {};
                let assemblyHeaderCells = {};
                let assemblyHeaderHTML = {};
                assemblyHeaderRows["Row" + assemblyRowIndex] = assemblyTableHeader.insertRow(assemblyRowIndex); 

                assemblyHeaderCells["Cells" + assemblyRowIndex + assemblyColumnIndex] = assemblyHeaderRows["Row" + assemblyRowIndex].insertCell(assemblyColumnIndex);
                assemblyHeaderHTML["html" + assemblyRowIndex + assemblyColumnIndex] = assemblyHeaderCells["Cells" + assemblyRowIndex + assemblyColumnIndex].innerHTML = "<th scope='col'>" + "assemblyPartNumberDID" + "</th>";
                assemblyColumnIndex++;
                
                assemblyHeaderCells["Cells" + assemblyRowIndex + assemblyColumnIndex] = assemblyHeaderRows["Row" + assemblyRowIndex].insertCell(assemblyColumnIndex);
                assemblyHeaderHTML["html" + assemblyRowIndex + assemblyColumnIndex] = assemblyHeaderCells["Cells" + assemblyRowIndex + assemblyColumnIndex].innerHTML = "<th scope='col'>" + "currentAssy" + "</th>";
                assemblyColumnIndex++;
                
                assemblyHeaderCells["Cells" + assemblyRowIndex + assemblyColumnIndex] = assemblyHeaderRows["Row" + assemblyRowIndex].insertCell(assemblyColumnIndex);
                assemblyHeaderHTML["html" + assemblyRowIndex + assemblyColumnIndex] = assemblyHeaderCells["Cells" + assemblyRowIndex + assemblyColumnIndex].innerHTML = "<th scope='col'>" + "availableAssy" + "</th>";
                assemblyColumnIndex++;
                
                assemblyHeaderCells["Cells" + assemblyRowIndex + assemblyColumnIndex] = assemblyHeaderRows["Row" + assemblyRowIndex].insertCell(assemblyColumnIndex);
                assemblyHeaderHTML["html" + assemblyRowIndex + assemblyColumnIndex] = assemblyHeaderCells["Cells" + assemblyRowIndex + assemblyColumnIndex].innerHTML = "<th scope='col'>" + "HasActionID" + "</th>";
                assemblyColumnIndex++;

                //table.appendChild(assemblyTable);

                bodyRows["Row" + rowIndex].appendChild(assemblyTable);

                //bodyCells["Cells" + rowIndex + columnIndex].appendChild(assemblyTable);


            }            
            /////////////////////////
            rowIndex++;
            columnIndex = 0;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////

function PopulateComboBox(listOfNodes, warningsArray, flashActionList){
    if (listOfNodes.length!=0) {
        let ul = document.getElementById("comboxList");
        ul.innerHTML = "";
        console.log("Number of nodes = "+ listOfNodes.length); 
        for (let i = 0; i < listOfNodes.length; i++) {  
            
            //check if Node is already in the list.
            let addToCombobox = true;
            for (let k = 0; k < ul.children.length; k++) {
                if (listOfNodes[i].nodeInfo.address === ul.children[k].innerHTML) {
                    addToCombobox = false;
                    break;  
                }          
            }

            if (addToCombobox===true) {
                console.log("Node " + i + " = " + listOfNodes[i].nodeInfo.address);          
                let li = document.createElement('li');            
                li.setAttribute('class', 'dropdown-item');
                li.textContent = listOfNodes[i].nodeInfo.address;       
                li.addEventListener("click", function() { CaptureNodeIndexes(listOfNodes[i].nodeInfo.address, warningsArray, flashActionList) } );      
                ul.appendChild(li);
            }

        }
        console.log();
    }
    console.log();
}

function  CaptureNodeIndexes(ECU, warningsArray, flashActionList){
    //Create a list of indexes of the target Node/ECU
    clearTable("FALTable");
    let falLabel = document.getElementById('FALTableText');
    falLabel.setAttribute("hidden", "hidden");

    document.getElementById('FDSPMode').innerHTML = "<b>" + EngineerDealer + "</b>";
    document.getElementById('DisplayVIN').innerHTML = "<b>" + vin + " (" + vehicleProgram + " " +  modelYear + ")"  + "</b>";    
    document.getElementById('DisplayNode').innerHTML = "<font color='#008000' size='6'><b>" + "NODE 0x" + ECU + "</b></font>";

    if (warningsArray.lengthWarnings !== 0) {          
        let warningDetails = "<font color='#ff0000' size='6'>" + "NODE 0x" + ECU + "</font> (WARNING - "
        let localWarnings = warningsArray.getWarnings;
        for (let i = 0; i < localWarnings.length; i++) {
            if (ECU === localWarnings[i].nodeAddress) {
                warningDetails = warningDetails + "code:" + localWarnings[i].code + " / " + "source:" + localWarnings[i].source + " / " +  "details:" + localWarnings[i].details  + ")";
                document.getElementById('DisplayNode').innerHTML = "<b>" + warningDetails + "</b>";
                break;
            }
        }
    }

    clearTable("NodeTable");
    let listOfNodes = nodeList.getNodes;
    let nodeIndexesWorking = [];
    let nodeIndexesSafe = [];
    for (let i = 0; i < listOfNodes.length; i++) {      
        if (listOfNodes[i].nodeInfo.address == ECU) {
            let date = listOfNodes[i].nodeInfo.stateChangeDate;
            let year = parseInt(date.substring(0,4));
            let month = parseInt(date.substring(5,7))-1;
            let day = parseInt(date.substring(8,10));
            let hour = parseInt(date.substring(11,13));
            let min = parseInt(date.substring(14,16));
            let sec = parseInt(date.substring(17,19));
            let nodeDate = new Date(year, month, day, hour, min, sec);
            nodeIndexesWorking.push([i,nodeDate]);
            nodeIndexesSafe.push([i,nodeDate]);
        }
    }

    //For FDSP with no history the wrong parts are being displayed.  Need to figure out a toggle between history and standard fdsp reports.
    let sortedIndex;
    
    if (nodeIndexesWorking.length==1) {
        sortedIndex = [1];
        for (let i = 0; i < nodeIndexesWorking.length; i++) {
            if (i===0) {
                sortedIndex[0] = nodeIndexesWorking[i][0];    
            }
            else{
                sortedIndex[i] = nodeIndexesWorking[i][0];   
            }        
        }
    }
    else{
        sortedIndex = sortIndexByDate(nodeIndexesWorking, nodeIndexesSafe);
    }

    console.log();

    if (sortedIndex.length!=0) {
        PopulateNodeTable(sortedIndex);
    }

    if (flashActionList.getFALLength!=0) {
        PopulateFALTable(flashActionList,ECU);
    }
    
}


function sortIndexByDate(nodeIndexes, nodeIndexesSafe) {  
    let sortedIndex = [];
    for (let i = 0; i < nodeIndexes.length; i++) {
        for (let j = 0; j < (nodeIndexes.length - i - 1); j++) {

            if (nodeIndexes[j][1].getTime() > nodeIndexes[j+1][1].getTime()) {
                let dateTemp = nodeIndexes[j][1];
                nodeIndexes[j][1] = nodeIndexes[j+1][1];
                nodeIndexes[j+1][1] = dateTemp; 
                console.log();               
            }        
        }
    }
    for (let i = 0; i < nodeIndexes.length; i++) {
        for (let j = 0; j < nodeIndexesSafe.length; j++) {
            if (nodeIndexesSafe[j][1].getTime()===nodeIndexes[i][1].getTime()) {
                sortedIndex.push(j);
                break;
            }            
        }        
    }
    return sortedIndex;
}

function PopulateNodeTable(sortedIndex){
    //Create a header list by consolidating all the dids under each node instance (History,Current,Available)
    let FirstColumnVerticalHeadings = [];
    let listOfNodes = nodeList.getNodes;  


    if (HistoryPresent===true) {
        sortedIndex.forEach(index => {
            listOfNodes[index].dids.dids.forEach(did => {
                if (FirstColumnVerticalHeadings.length!=0) {
                    let pushDid = true;
                    for (let i = 0; i < FirstColumnVerticalHeadings.length; i++) {
                        if (FirstColumnVerticalHeadings[i]==did.didType.didValue) {
                            pushDid = false;
                            break;
                        }                    
                    }
                    if (pushDid) {
                        FirstColumnVerticalHeadings.push(did.didType.didValue);
                    }
                }
                else{
                    FirstColumnVerticalHeadings.push(did.didType.didValue);
                }
            });
        });
        
        highlightMissingDids(FirstColumnVerticalHeadings);
    }
    else{    
        for (let i = 0; i < listOfNodes[sortedIndex].dids.dids.length; i++) {
            FirstColumnVerticalHeadings.push(listOfNodes[sortedIndex].dids.dids[i].didType.didValue);
        }
    }

    //Determine the order of History,Current,Available.
    let table = document.getElementById('NodeTable');
    let tableHeader = table.createTHead();
    let tableBody = table.createTBody();
    tableHeader.setAttribute('class', 'table-dark sticky-top top-0');
    
    FirstColumnVerticalHeadings.unshift("<th scope='col'>" + "Derived Assembly" + "</th>");
    FirstColumnVerticalHeadings.unshift("<th scope='col'>" + "ID" + "</th>");
    FirstColumnVerticalHeadings.unshift("<th scope='col'>" + "Role" + "</th>");
    FirstColumnVerticalHeadings.unshift("<th scope='col'>" + "Date" + "</th>");
    FirstColumnVerticalHeadings.unshift("<th scope='col'>" + "State" + "</th>");

    let verticalHeadingsCount = 4;

    let columnIndex = 0;

    //Rows
    let rows = {};
    for (let i = 0; i < FirstColumnVerticalHeadings.length; i++) {

        if (i>verticalHeadingsCount) {
            rows["didRow" + i] = tableBody.insertRow(i-(verticalHeadingsCount+1));   
        }
        else{        
            rows["didRow" + i] = tableHeader.insertRow(i);   
        }
    }

    //Cells
    let cells = {};
    for (let i = 0; i < FirstColumnVerticalHeadings.length; i++) {        
        cells["didCells" + i] = rows["didRow" + i].insertCell(columnIndex);
    }

    columnIndex++;

    //HTML
    let html = {};
    for (let i = 0; i < FirstColumnVerticalHeadings.length; i++) {

        if (i>verticalHeadingsCount) {
            html["html" + i] = cells["didCells" + i].innerHTML = "<b>" + FirstColumnVerticalHeadings[i] + "</b>";    
        }
        else{
            html["html" + i] = cells["didCells" + i].innerHTML = "<th scope='col'>" + FirstColumnVerticalHeadings[i] + "</th>";
        }
        
    }

    console.log();
    if (HistoryPresent===true) {
        DisplayChanges(sortedIndex,FirstColumnVerticalHeadings);
    }
    addDataToColumns(rows, columnIndex, FirstColumnVerticalHeadings, sortedIndex);
    console.log();
}


function DisplayChanges(sortedIndex, tableHeaderNames){
    let listOfNodes = nodeList.getNodes;   
    for (let i = 4; i < tableHeaderNames.length; i++) {
        for (let j = 1; j < sortedIndex.length; j++) {            
            let EOL;
            for (let t = 0; t < listOfNodes[sortedIndex[0]].dids.dids.length; t++) {
                if (tableHeaderNames[i] === listOfNodes[sortedIndex[0]].dids.dids[t].didType.didValue){
                    EOL = listOfNodes[sortedIndex[0]].dids.dids[t].didType.response;
                    break;
                }                     
            }
            for (let q = 0; q < listOfNodes[sortedIndex[j]].dids.dids.length; q++) {
                if (tableHeaderNames[i] === listOfNodes[sortedIndex[j]].dids.dids[q].didType.didValue){
                    let historyCurrent = listOfNodes[sortedIndex[j]].dids.dids[q].didType.response;

                    if ((EOL!="")&&(historyCurrent!="")) {
                        if (historyCurrent!=EOL) {
                            if (EOL==="<font color='#ff0000' size='2'><i>Missing</i></font>") {
                                listOfNodes[sortedIndex[j]].dids.dids[q].didType.response = listOfNodes[sortedIndex[j]].dids.dids[q].didType.response; 
                            }
                            else{
                                listOfNodes[sortedIndex[j]].dids.dids[q].didType.response = "<font color='#ff0000' size='3'>" + listOfNodes[sortedIndex[j]].dids.dids[q].didType.response + "</font>"; 
                            }
                        }   
                    }
                    break;
                }                
            }
        }   
    }
}

// function DisplayChanges(sortedIndex, tableHeaderNames){
//     let listOfNodes = nodeList.getNodes;   
//     for (let i = 4; i < tableHeaderNames.length; i++) {
//         for (let j = 1; j < sortedIndex.length; j++) {            
//             let EOL;
//             for (let t = 0; t < listOfNodes[sortedIndex[0]].dids.dids.length; t++) {
//                 if (tableHeaderNames[i] === listOfNodes[sortedIndex[0]].dids.dids[t].didType.didValue){
//                     EOL = listOfNodes[sortedIndex[0]].dids.dids[t].didType.response;
//                     break;
//                 }                     
//             }
//             for (let q = 0; q < listOfNodes[sortedIndex[j]].dids.dids.length; q++) {
//                 if (tableHeaderNames[i] === listOfNodes[sortedIndex[j]].dids.dids[q].didType.didValue){
//                     let historyCurrent = listOfNodes[sortedIndex[j]].dids.dids[q].didType.response;

//                     if ((EOL!="")&&(historyCurrent!="")) {
//                         if (historyCurrent!=EOL) {
//                             listOfNodes[sortedIndex[j]].dids.dids[q].didType.response = "<font color='#ff0000' size='3'>" + listOfNodes[sortedIndex[j]].dids.dids[q].didType.response + "</font>"; 
//                         }   
//                     }
//                     break;
//                 }                
//             }
//         }   
//     }
// }

function addDataToColumns(rows, columnIndex, tableHeaderNames, sortedIndex){
    let listOfNodes = nodeList.getNodes;    
    let header = true;
    for (let k = 0; k < sortedIndex.length; k++) {       
        header = true;
        for (let i = 0; i < tableHeaderNames.length; i++) {    
            for (let j = 0; j < listOfNodes[sortedIndex[k]].dids.dids.length; j++) {
                if (header===true) {                    
                    header = false; 
                    
                    rows["didRow0"].insertCell(columnIndex).innerHTML = "<th scope='col'>" + listOfNodes[sortedIndex[k]].nodeInfo.currentOrHistory + " ( 0x" + listOfNodes[sortedIndex[k]].nodeInfo.address + ")" + "</th>";
                    rows["didRow1"].insertCell(columnIndex).innerHTML = "<th scope='col'>" + listOfNodes[sortedIndex[k]].nodeInfo.stateChangeDate + "</th>";

                    let w = listOfNodes[sortedIndex[k]].nodeInfo.stateUpdateRole;
                    if (typeof w === 'undefined') {
                        w = "";
                    }
                    let x = listOfNodes[sortedIndex[k]].nodeInfo.stateUpdateRoleSource;
                    if (typeof x === 'undefined') {
                        x = "";
                    }                    
                    let y = listOfNodes[sortedIndex[k]].nodeInfo.stateUpdateRoleDesc;
                    if (typeof y === 'undefined') {
                        y = "";
                    }
                    let z = w + " " + x + " " + y;

                    rows["didRow2"].insertCell(columnIndex).innerHTML = "<th scope='col'>" + z + "</th>";
                    rows["didRow3"].insertCell(columnIndex).innerHTML = "<th scope='col'>" + listOfNodes[sortedIndex[k]].nodeInfo.stateUpdateRoleID + "</th>";

                    if (typeof listOfNodes[sortedIndex[k]].nodeInfo.derivedAssembly === 'undefined') {
                        rows["didRow4"].insertCell(columnIndex).innerHTML = "<th scope='col'>" + "" + "</th>";
                    }
                    else {                
                    rows["didRow4"].insertCell(columnIndex).innerHTML = "<th scope='col'>" + listOfNodes[sortedIndex[k]].nodeInfo.derivedAssembly.response + " (" + listOfNodes[sortedIndex[k]].nodeInfo.derivedAssembly.didValue + ")" + "</th>";
                    }
                }
                if (tableHeaderNames[i]===listOfNodes[sortedIndex[k]].dids.dids[j].didType.didValue) {
                    rows["didRow"+ i].insertCell(columnIndex).innerHTML = listOfNodes[sortedIndex[k]].dids.dids[j].didType.response;

                    break;
                } 
            }
        }
        columnIndex++      
    }
    console.log();
}


function highlightMissingDids(tableHeaderNames){

    //We need an empty cell in the table if the did is missing.
    //If that missing did exists in the next column(s) it (they) will lack a table cell reference.

    let listOfNodes = nodeList.getNodes; 
    let pushMissing = true;
    for (let i = 0; i < tableHeaderNames.length; i++) {
        for (let k = 0; k < listOfNodes.length; k++) {
            for (let j = 0; j < listOfNodes[k].dids.dids.length; j++) {
                pushMissing = true;
                if (tableHeaderNames[i] == listOfNodes[k].dids.dids[j].didType.didValue  ) {
                    pushMissing = false;
                    break;
                }                              
            }

            if (pushMissing===true) {
                let missingNest = new Parameter("",tableHeaderNames[i], "<font color='#ff0000' size='2'><i>Missing</i></font>");
                let missing = new Parameter(missingNest,"", "", "");
                listOfNodes[k].dids.dids.push(missing);
            }      
        }        
    }        
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

//Listener for Button Click
document.getElementById("submitBtn").addEventListener("click", main);