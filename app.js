const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path');


const dbConnect = mysql.createConnection({
    host:'localhost',
    port: 3306,
    user: 'root',
    password: 'pieceofshit',
    database: 'healthcare'
});

dbConnect.connect(function(error){
    if(!!error)
        console.log("Connection Error");
    else 
        console.log("Connection Successful");
})

app.use('/', express.static(__dirname + '/application'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));
app.get("/",(req,res) =>{
    var options = { 
        root: path.join(__dirname) 
    }; 
    res.sendFile("application/index.html",options)
    dbConnect.query("SELECT * from Location where pincode = '600001'",function(error,rows,fields){
        //callback
        if(!!error)
            console.log('Error');
        else 
            console.log(rows);
    });
})
app.get('/shplogin', function(req, res, next) { 
    res.render('shplogin.ejs')
    });

app.post('/shplogin/signinpat',function(req,res,next){
    const userDetails = req.body;
    console.log(userDetails);
    var str1 = "Select pPwd from patient where pID = '";
    var str2 = "'"
    var qry = str1.concat(userDetails.patientID);
    var qry = qry.concat(str2);
    dbConnect.query(qry,function(error,rows,fields){
        if(!!error)
            console.log('Error');
        else 
            console.log(rows[0].pPwd == userDetails.patientPwd); 
    })
});

app.post('/shplogin/signuppat',function(req,res,next){
    const userDetails = req.body;
    console.log(userDetails);
    let id = 'A000102'
    var qry = "INSERT INTO PATIENT VALUES('"+id+"', '"+userDetails.patientFname+"', '"+userDetails.patientLname+"', '"+userDetails.patientGender+"', '"+userDetails.patientPhone+"', '"+userDetails.patientDOB+"', '"+userDetails.patientDoor+"', '"+userDetails.patientStreet+"', '"+userDetails.patientPincode+"', '"+userDetails.patientPwd+"')";
    console.log(qry);
    dbConnect.query("select max(pId) as pID from patient;",function(error,rows,fields){
        if(!!error)
            console.log('Error');
        else 
            console.log(rows[0].pID); 
    })
    // dbConnect.query(qry,function(error){
    // if(!!error)
    //     console.log('Error');
    // else 
    //     console.log('Success'); 
    // })
    var sendId = "<script> alert('Your Id is : " + id + "') </script>"
    res.send(sendId)
});


app.listen(port,() => {
    console.log("Port 3000 Accessed");
})