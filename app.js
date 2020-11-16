if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const dbConnect = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_SCHEMA
});
let patientDetails = null
let doctorDetails = null
let empDetails = null
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
    empDetails = null
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
    let id = null;
    let qry2 = "select max(pID) as pID from patient"
    dbConnect.query(qry2,function(error,rows){
        if(!!error)
            console.log(error)
        else{
            id = rows[0].pID;
            console.log(id)
            pad = (n,width,z)=>{
                z = z || '0';
                n = n + '';
                return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n; 
            }
            let integer = parseInt(id.substring(1))
            id = pad(pad(integer+1,6),7,'A')
            console.log(id)
            let qry = "INSERT INTO PATIENT VALUES('"+id+"', '"+userDetails.patientFname+"', '"+userDetails.patientLname+"', '"+userDetails.patientGender+"', '"+userDetails.patientPhone+"', '"+userDetails.patientDOB+"', '"+userDetails.patientDoor+"', '"+userDetails.patientStreet+"', '"+userDetails.patientPincode+"', '"+userDetails.patientPwd+"')";
            console.log(qry);
            dbConnect.query(qry,function(error){
                if(!!error)
                    console.log('Error');
                else 
                    console.log('Success'); 
            })
            res.redirect('/shplogin')
        }
    })
    
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
                                pName : pName,
                                appMsg : ''
                            })
                        }
                    })
                }
            })  
        }
    })
});

app.post('/patient', (req,res)=>{
    const appDetails = req.body;
    console.log(appDetails);
    var qry = "INSERT into appointment values('"+''+"','"+appDetails.appDate+"','"+appDetails.appTime+"','"+appDetails.reason+"')";
    console.log(qry)
    /*dbConnect.query(qry,function(error){
        if(!!error)
            console.log(error);
        else 
            console.log('Success');
            res.render('addToStock.ejs',{appMsg : String(stockDetails.drugName)+' has been added'}); 
    })*/
})

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

app.get('/doctorview',function(req,res){
    let dview
    dbConnect.query("select pID,dID,concat(concat(pFname,' '),pLname) as PName,reason,appDateTime,pGender,pDOB,pPhno from patient natural join appointment where dID = 'N000001';",function(error,rows,fields){
        if(!!error)
            console.log("error");
        else{
            dView = (JSON.parse(JSON.stringify(rows)));
            for (var i = 0; i < dView.length; i++) {
                dView[i].appDateTime = convertDate(dView[i].appDateTime)
            }
            res.render('doctorView.ejs',{
                dView : dView
            })
        }
    })
})

function convertDate(dateString) {
	var sqlDateArr1 = dateString.split("-");
	var sYear = sqlDateArr1[0];
	var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
	var sqlDateArr2 = String(sqlDateArr1[2]).split("T");
	var sDay = sqlDateArr2[0];
	var sqlDateArr3 = String(sqlDateArr2[1]).split(":");
	var sHour = sqlDateArr3[0];
	var sMinute = sqlDateArr3[1];
	var sqlDateArr4 = String(sqlDateArr3[2]).split(".");
	var sSecond = sqlDateArr4[0];
	return String(sDay+'/'+sMonth+'/'+sYear+' '+sHour+':'+sMinute+':'+sSecond)
}

app.get('/createPres',function(req,res){
    res.render('createPres.ejs')
})

app.get('/addToStock',(req,res)=>{
    res.render('addToStock.ejs',{drugMsg: ''});
})

app.post('/addToStock', (req,res)=>{
    const stockDetails = req.body;
    console.log(stockDetails);
    var qry = "INSERT into drugs values('"+stockDetails.drugName+"','"+stockDetails.drugPrice+"','"+stockDetails.drugCount+"','"+stockDetails.drugMfDate+"','"+stockDetails.drugExpDate+"')";
    dbConnect.query(qry,function(error){
        if(!!error)
            console.log(error);
        else 
            console.log('Success');
            res.render('addToStock.ejs',{drugMsg : String(stockDetails.drugName)+' has been added'}); 
    })
})

app.get('/pharma',(req, res)=>{
    res.render('pharma.ejs',{ presView:[{}] });
})

app.post('/pharma', (req, res) => {
    dbConnect.query('SELECT dosage, medicine FROM prescription WHERE pId = ? AND prescDateTime = ?', [req.body.id, req.body.datetime], (err, results) => {
        if (err) {
            res.status(500).end();
            console.log(req.body.id, req.body.datetime)
            console.log(err)
        } else {
            res.json(results);
            res.status(200).end();
            console.log(results)
        }
    });
});

app.get('/sendPresc',(req,res)=>{
    res.render('sendPresc.ejs')
})

app.get('/roomSearch',(req,res)=>{
    res.render('roomSearch.ejs',{errormessage: null})
})

app.post('/roomSearch',(req,res)=>{
    if(req.body.rID !== ''){
        dbConnect.query("SELECT * FROM roomSearch WHERE RNO = ? and rOutDate > '2020-10-07'",[req.body.rID],(err,rows)=>{
            if(!!err){
                console.log(err)
            }
            else{
                if(rows.length !== 0){
                    let val = JSON.parse(JSON.stringify(rows[0]))
                    console.log(val)
                    let retVal = ' Room No : '+req.body.rID+'\n InDate : '+convertDate(val.rInDate)+'\n OutDate : '+convertDate(val.rOutDate)+'\n Patient ID : '+val.pID+'\n Patient Name : '+val.pFname+'\n Patient Phone : '+val.pPhno
                    console.log(retVal)
                    res.render('roomSearch.ejs',{errormessage: retVal})
                }
                else
                    res.render('roomSearch.ejs',{errormessage: 'No Room Found'})
            }
        })
    }
    else if(req.body.pID !== ''){
        dbConnect.query("SELECT * FROM roomSearch WHERE pID = ? and rOutDate > '2020-10-07'",[req.body.pID],(err,rows)=>{
            if(!!err){
                console.log(err)
            }
            else{
                if(rows.length !== 0){
                    let val = JSON.parse(JSON.stringify(rows[0]))
                    console.log(val)
                    let retVal = ' Room No : '+val.rNo+'\n InDate : '+convertDate(val.rInDate)+'\n OutDate : '+convertDate(val.rOutDate)+'\n Patient ID : '+val.pID+'\n Patient Name : '+val.pFname+'\n Patient Phone : '+val.pPhno
                    console.log(retVal)
                    res.render('roomSearch.ejs',{errormessage: retVal})
                }
                else
                    res.render('roomSearch.ejs',{errormessage: 'No Room Found'})
            }
        })
    }
})

app.get('/addToPres',(req,res)=>{
    res.render('addToPres.ejs',{PresMsg:''})
})

app.post('/addToPres',(req,res)=>{
    var presDetails = req.body;
    console.log(presDetails)
    var today = new Date();                     
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    dateTime = date+' '+presDetails.presTime+':00';
    var qry = "Insert into prescription values('"+presDetails.pID+"','"+dateTime+"','"+presDetails.drugName+"','"+presDetails.dosage+"')";
    dbConnect.query(qry,function(error){
        if(!!error)
            console.log(error);
        else{
            console.log('Success');
        }
    }) 
})

app.get('/roomalloc',(req,res)=>{
    res.render('roomAllocate.ejs',{errormsg:null})
})

app.post('/roomalloc',(req,res)=>{
    var roomDetails = req.body;
    console.log(roomDetails);
    var today = new Date();                     
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var qry = "Insert into roomrecord values('"+roomDetails.rNo+"','"+date+"','"+roomDetails.rOutDate+"','"+'em00002'+"','"+roomDetails.pID+"','"+'1'+"')";
    dbConnect.query(qry,function(error){
        if(!!error)
            console.log(error);
        else{
            console.log('Success');
            res.render('roomAllocate.ejs',{errormsg:'Room Allocated'})
        }
    }) 
})

app.get('/roomAvail',function(req,res){
    var roomhist;
    dbConnect.query("select * from rooms where rNo not in (select rNo from roomAvail where rOutDate > '2020-10-10')",function(error,rows,fields){
        if(!!error)
            console.log("error");
        else{
            roomhist = (JSON.parse(JSON.stringify(rows)));
            console.log(roomhist);
            res.render('roomAvail.ejs',{
                roomhist : roomhist
            })
        }
    })
})

app.get('/roomAlloc',(req,res)=>{
    res.render('roomAllocate.ejs')
})

app.get('/roomAvail',function(req,res){
    var roomhist;
    dbConnect.query("select * from rooms where rNo not in (select rNo from roomAvail where rOutDate > '2020-10-10')",function(error,rows,fields){
        if(!!error)
            console.log("error");
        else{
            roomhist = (JSON.parse(JSON.stringify(rows)));
            console.log(roomhist);
            res.render('roomAvail.ejs',{
                roomhist : roomhist
            })
        }
    })
})

app.listen(port,() => {
    console.log("Port 3000 Accessed");
})