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

let n =  new Date();
m = n.getMonth() + 1;
document.getElementById("date1").innerHTML = n.getDate() + " / " + m + " / " + n.getFullYear();

function roomAllocation() {
    let string = "Patient Alloacated Room No : "+ Math.floor((Math.random() * 10) + 1);
    alert(string);
}

function roomSearch() {
    alert("Room details Found : ");
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
    window.location.href = "https://www.google.com";
}