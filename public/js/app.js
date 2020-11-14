const mysql = require('mysql')
const express = require('express')
const app = express()
const port = 3000
const path = require('path')

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

app.get("/",(req,res) =>{
    var options = { 
        root: path.join(__dirname) 
    }; 
    res.sendFile("../index.html",options)
    dbConnect.query("SELECT * from Location where pincode = '600001'",function(error,rows,fields){
        //callback
        if(!!error)
            console.log('Error');
        else 
            console.log(rows);
    });
})

app.listen(port,() => {
    console.log("Port 3000 Accessed");
})