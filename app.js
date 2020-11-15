if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const dbConnect = mysql.createConnection({
    host:'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DB_PW,
    database: 'healthcare'
});
let patientDetails = null
let doctorDetails = null
dbConnect.connect(function(error){
    if(!!error)
        console.log("Connection Error");
    else 
        console.log("Connection Successful");
})
app.use("/public",express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));
app.get("/",(req,res) =>{
    res.render('index.ejs')
})
app.get('/shplogin', function(req, res, next) { 
    res.render('shplogin.ejs')
    });

app.get('/logout',function(req,res,next){
    patientDetails = null
    doctorDetails = null
    res.redirect('/')
})

app.post('/shplogin/signinpat',function(req,res,next){
    const userDetails = req.body;
    console.log(userDetails);
    var qry = "Select pPwd from patient where pID = '"+userDetails.patientID+"'"
    dbConnect.query(qry,function(error,rows,fields){
        if(!!error)
            console.log('Error');
        if(rows[0] !== null)
            if(rows[0].pPwd == userDetails.patientPwd){
                patientDetails = JSON.parse(JSON.stringify(rows[0]))
            } 
    })
});

app.post('/shplogin/signuppat',function(req,res){
    const userDetails = req.body;
    console.log(userDetails);
    let id = 'A000202'
    var qry = "INSERT INTO PATIENT VALUES('"+id+"', '"+userDetails.patientFname+"', '"+userDetails.patientLname+"', '"+userDetails.patientGender+"', '"+userDetails.patientPhone+"', '"+userDetails.patientDOB+"', '"+userDetails.patientDoor+"', '"+userDetails.patientStreet+"', '"+userDetails.patientPincode+"', '"+userDetails.patientPwd+"')";
    console.log(qry);
    dbConnect.query(qry,function(error){
        if(!!error)
            console.log('Error');
        else 
            console.log('Success'); 
    })
    res.redirect('/shplogin')
});

app.get('/patient',function(req,res){
    var presList;
    var pName;
    var hist; 
    dbConnect.query("select dID,pID,appDateTime,reason from appointment natural join patient where pid = 'A000001';",function(error,rows,fields){
        if(!!error)
            console.log("error");
        else{
            presList = (JSON.parse(JSON.stringify(rows)));
            console.log(presList);
            dbConnect.query("select pid,did,appDateTime,amount,disease from bill natural join treatment where pID = 'A000001';",function(error,rows,fields){
                if(!!error)
                    console.log("error");
                else{
                    hist = (JSON.parse(JSON.stringify(rows)));
                    console.log(hist);
                    dbConnect.query("select pFname as PName from patient where pid='A000001';",function(error,rows,fields){
                        if(!!error)
                            console.log(error);
                        else{
                            pName = (JSON.parse(JSON.stringify(rows)));
                            console.log(pName);
                            res.render('patient.ejs',{
                                plist : presList,
                                hist : hist,
                                pName : pName
                            })
                        }
                    })
                }
            })  
        }
    })
});

app.get('/roomshow',function(req,res){
    var roomhist;
    dbConnect.query("SELECT rNo,rType,concat(concat(pFname,' '),pLname) as PName,rInDate,rOutDate FROM healthcare.roomrecord natural join rooms natural join patient;",function(error,rows,fields){
        if(!!error)
            console.log("error");
        else{
            roomhist = (JSON.parse(JSON.stringify(rows)));
            console.log(roomhist);
            res.render('roomshow.ejs',{
                roomhist : roomhist
            })
        }
    })
})

app.listen(port,() => {
    console.log("Port 3000 Accessed");
})