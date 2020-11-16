function viewSignIn(){
    document.getElementById("signup").style.display = "none";
    document.getElementById("signin").style.display = "block";
}
function viewSignUp(){
    document.getElementById("signin").style.display = "none";
    document.getElementById("signup").style.display = "block";
}

// document.getElementById("time").style.float= "right";

// function myTimer() {
//     let n =  new Date();
//     m = n.getMonth() + 1;
//     document.getElementById("date").innerHTML = n.getDate() + " / " + m + " / " + n.getFullYear();
//     document.getElementById("time").innerHTML = n.toLocaleTimeString()
// }
// var myVar = setInterval(myTimer, 1000);

// function onCreatePresLoad(){
//     let n =  new Date();
//     m = n.getMonth() + 1;
//     document.getElementById("date1").innerHTML = n.getDate() + " / " + m + " / " + n.getFullYear();
// }

// function roomAllocation() {
//     let string = "Patient Alloacated Room No : "+ Math.floor((Math.random() * 10) + 1);
//     alert(string);
// }

// function roomSearch() {
//     console.log("Came Here");
//     window.alert("Room details Found : ");
// }

function viewOrder(){
    document.getElementById("supply").style.display = "block";
}

// function addMed(){
//     window.location.href = "addToStock.html";
// }
// function stockCancel(){
//     if(window.confirm("Cancel the Process ?")){
//         window.alert("Cancelled");
//         window.location.href = "pharma.html";
//     }
// }
// function addStock(){
//     if(window.confirm("Confirm?")){
//         window.alert("Added");
//         window.location.href = "pharma.html";
//     }
// }
// function returnToStock(){
//     window.location.href = "pharma.html";
// }
// function roomSearch(){
//     window.location.href = "roomSearch.html";
// }
// function returnToPres(){
//     window.location.href = "createPres.html";
// }
// function presCancel(){
//     if(window.confirm("Cancel the Process ?")){
//         window.alert("Cancelled");
//         window.location.href = "createPres.html";
//     }
// }

// function addPres(){
//     window.location.href = "createPres.html";
// }


function addRow() {
    var medTab = document.getElementById('mytab');

    var rowCnt = medTab.rows.length;    
    var tr = medTab.insertRow(rowCnt); 
    tr = medTab.insertRow(rowCnt);

    for (var c = 0; c < 4; c++) {
        var td = document.createElement('td');          
        td = tr.insertCell(c);
        td.setAttribute('class','cell')

        if (c == 2 || c == 3) {   
            var button = document.createElement('button');
            button.setAttribute('class','btn btn-primary');
            button.setAttribute('type', 'submit');
            if(c==3){
                button.textContent = 'Add';
            }
            else {
                button.textContent = 'Delete';
                button.setAttribute('onclick', 'removeRow(this)');
            }
            td.appendChild(button);
        }
        else {
            
            if(c==1){
                ele.setAttribute('pattern','[0-9]{1}[-]{1}[0-9]{1}[-]{1}[0-9]{1}')
                var ele = document.createElement('input');
                ele.setAttribute('type', 'text');
                ele.setAttribute('class','pres');
                ele.setAttribute('value', '');
                ele.required = true;
            }
            else{
                var ele = document.createElement('select');
                ele.setAttribute('class','pres');
                ele.setAttribute('value', '');
            }
            td.appendChild(ele);
        }
    }
}

function removeRow(oButton) {
    var empTab = document.getElementById('mytab');
    empTab.deleteRow(oButton.parentNode.parentNode.rowIndex);
}