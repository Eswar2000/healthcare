function viewSignIn(){
    document.getElementById("signup").style.display = "none";
    document.getElementById("signin").style.display = "block";
}
function viewSignUp(){
    document.getElementById("signin").style.display = "none";
    document.getElementById("signup").style.display = "block";
}
document.getElementById("time").style.float= "right";

function myTimer() {
    let n =  new Date();
    m = n.getMonth() + 1;
    document.getElementById("date").innerHTML = n.getDate() + " / " + m + " / " + n.getFullYear();
    document.getElementById("time").innerHTML = n.toLocaleTimeString()
}
var myVar = setInterval(myTimer, 1000);

function onCreatePresLoad(){
    let n =  new Date();
    m = n.getMonth() + 1;
    document.getElementById("date1").innerHTML = n.getDate() + " / " + m + " / " + n.getFullYear();
}

function roomAllocation() {
    let string = "Patient Alloacated Room No : "+ Math.floor((Math.random() * 10) + 1);
    alert(string);
}

function roomSearch() {
    console.log("Came Here");
    window.alert("Room details Found : ");
}

function viewPresc(){
    document.getElementById("supply").style.display = "none";
    document.getElementById("order").style.display = "block";
}
function viewOrder(){
    document.getElementById("order").style.display = "none";
    document.getElementById("supply").style.display = "block";
}
function addMed(){
    window.location.href = "addToStock.html";
}
function stockCancel(){
    if(window.confirm("Cancel the Process ?")){
        window.alert("Cancelled");
        window.location.href = "pharma.html";
    }
}
function addStock(){
    if(window.confirm("Confirm?")){
        window.alert("Added");
        window.location.href = "pharma.html";
    }
}
function returnToStock(){
    window.location.href = "pharma.html";
}
function roomSearch(){
    window.location.href = "roomSearch.html";
}