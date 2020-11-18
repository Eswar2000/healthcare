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
    res.render('shplogin.ejs',{errormessage:null})
    });

app.get('/logout',function(req,res,next){
    patientDetails = null
    doctorDetails = null
    empDetails = null
    res.redirect('/')
})

app.post('/shplogin',function(req,res,next){
    const userDetails = req.body;
    console.log(userDetails);
    let firstTwoLetters = userDetails.patientID.substring(0,2)
    if(firstTwoLetters[0] >= 'A' && firstTwoLetters[0] <='M'){
        dbConnect.query("select * from patientLogin where ID = ?",[userDetails.patientID],function(error,rows,fields){
            if(!!error)
                console.log('Username Error');
            if(rows.length == 0){
                res.render('shplogin.ejs',{errormessage: 'No User Found'})
            }
            else{
                if(rows[0].PW == userDetails.patientPwd){
                    patientDetails = JSON.parse(JSON.stringify(rows[0]))
                    console.log('Patient')
                    console.log(patientDetails)
                    doctorDetails = null
                    empDetails = null
                    res.redirect('/patient')
                } 
                else{
                    res.render('shplogin.ejs',{errormessage: 'Password Incorrect'})
                }
            }
        })
    }
    else if(firstTwoLetters[0] >= 'M' && firstTwoLetters[0] <='Z'){
        dbConnect.query("select * from doctorLogin where ID = ?",[userDetails.patientID],function(error,rows,fields){
            if(!!error)
                console.log('Username Error');
            if(rows.length == 0){
                res.render('shplogin.ejs',{errormessage: 'No User Found'})
            }
            else{
                if(rows[0].PW == userDetails.patientPwd){
                    doctorDetails = JSON.parse(JSON.stringify(rows[0]))
                    console.log('Doctor')
                    patientDetails = null
                    empDetails = null
                    res.redirect('/doctorView')
                } 
                else{
                    res.render('shplogin.ejs',{errormessage: 'Password Incorrect'})
                }
            }
        })
    }
    else if(firstTwoLetters == 'em'){
        dbConnect.query("select * from employeeLogin where ID = ?",[userDetails.patientID],function(error,rows,fields){
            if(!!error)
                console.log('Username Error');
            if(rows.length == 0){
                res.render('shplogin.ejs',{errormessage: 'No User Found'})
            }
            else{
                if(rows[0].PW == userDetails.patientPwd){
                    empDetails = JSON.parse(JSON.stringify(rows[0]))
                    console.log('Employee')
                    console.log(empDetails)
                    patientDetails = null
                    doctorDetails = null
                    res.redirect('/employeeHome');
                } 
                else{
                    res.render('shplogin.ejs',{errormessage: 'Password Incorrect'})
                }
            }
        }) 
    }
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
                else {
                    console.log("Inserted into patient table")
                    dbConnect.query("insert into Bill(pID,amount,eID) values(?, 0, 'em00011')",[id],function(err){
                        if(!!err)
                            console.log(err)
                        else{
                            res.json({msg : String("Your Patient Id is  : " + id)});
                            res.status(200).end();
                        }
                    })
                }
            })
        }
    })
});

app.get('/patient',function(req,res){
    var presList;
    var pName;
    var hist; 
    let docs;
    dbConnect.query("SELECT prescDateTime,medicine,dosage FROM prescription where pID = ?",[patientDetails.ID],function(error,rows,fields){
        if(!!error)
            console.log("error");
        else{
            presList = (JSON.parse(JSON.stringify(rows)));
            for (var i = 0; i < presList.length; i++) {
                presList[i].prescDateTime = convertDate(presList[i].prescDateTime)
            }
            console.log(presList);
            dbConnect.query("select pid,did,appDateTime,amount,disease from bill natural join treatment where pID = ?",[patientDetails.ID],function(error,rows,fields){
                if(!!error)
                    console.log("error");
                else{
                    if(rows.length ==0){
                        hist = [{amount: '0'}]
                    }
                    else{
                        hist = (JSON.parse(JSON.stringify(rows)));
                        for (var i = 0; i < hist.length; i++) {
                            hist[i].appDateTime = convertDate(hist[i].appDateTime)
                        }
                    }
                    console.log(hist);
                    dbConnect.query("select pFname as PName from patient where pid = ?",[patientDetails.ID],function(error,rows,fields){
                        if(!!error)
                            console.log(error);
                        else{
                            pName = (JSON.parse(JSON.stringify(rows)));
                            console.log(pName);
                            dbConnect.query("Select * from spec",function(err,rows){
                                docs = (JSON.parse(JSON.stringify(rows)))
                                console.log(docs)
                                if(!!error)
                                    console.log(error);
                                else{
                                    res.render('patient.ejs',{
                                        plist : presList,
                                        hist : hist,
                                        pName : pName,
                                        appMsg : '',
                                        doctors : docs
                                    })
                                }
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
    appDetails.docDetails = appDetails.docDetails.substring(0,7)
    let dateTime = appDetails.appDate+' '+appDetails.appTime+':00'
    console.log(appDetails)
    dbConnect.query("insert into Appointment values(?, ?, ?,?)",[patientDetails.ID,appDetails.docDetails,dateTime,appDetails.reason],function(error){
        if(!!error)
            console.log(error);
        else {
            dbConnect.query("update bill set amount = amount + 500 where pID = ?",[patientDetails.ID],function(err){
                if(!!err)
                    console.log(err)
                else{
                    console.log('Success');
                    res.redirect('/patient')
                }
            })
        }
    })
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
    console.log(doctorDetails)
    var today = new Date();                     
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    dbConnect.query("select * from docView where dID = ? and appDateTime >= ?;",[doctorDetails.ID,dateTime],function(error,rows,fields){
        if(!!error) 
            console.log("error");
        else{
            let dView = (JSON.parse(JSON.stringify(rows)));
            for (var i = 0; i < dView.length; i++) {
                dView[i].appDateTime = convertDate(dView[i].appDateTime)
            }
            dbConnect.query("select * from docView where dID = ? and appDateTime < ?;",[doctorDetails.ID,dateTime],function(error,rows,fields){
                if(!!error) 
                    console.log("error");
                else{
                    let dViewp = (JSON.parse(JSON.stringify(rows)));
                    for (var i = 0; i < dViewp.length; i++) {
                        dViewp[i].appDateTime = convertDate(dViewp[i].appDateTime)
                    }
                    res.render('doctorView.ejs',{
                        dView : dView,
                        dViewp : dViewp,
                        dName : doctorDetails.Name
                    })
                }
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

app.get('/roomSearch',(req,res)=>{
    res.render('roomSearch.ejs',{errormessage: null})
})

app.post('/roomSearch',(req,res)=>{
    if(req.body.rID !== ''){
        var today = new Date();                     
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        dbConnect.query("SELECT * FROM roomSearch WHERE RNO = ? and rOutDate > ?",[req.body.rID,date],(err,rows)=>{
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
        var today = new Date();                     
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        dbConnect.query("SELECT * FROM roomSearch WHERE pID = ? and rOutDate > ?",[req.body.pID,date],(err,rows)=>{
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
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    var qry = "Insert into prescription values('"+presDetails.pID+"','"+dateTime+"','"+presDetails.drugName+"','"+presDetails.dosage+"')";
    dbConnect.query(qry,function(error){
        if(!!error)
            console.log(error);
        else{
            console.log('Insert Success')
            let nos = presDetails.dosage.split('-')
            let no = parseInt(nos[0]) + parseInt(nos[1])+ parseInt(nos[2])
            no = no *5
            dbConnect.query("update Drugs set drugCount = drugCount - ? where drugName = ?",[no,presDetails.drugName],function(err){
                if(!!err)
                    console.log(err)
                else{
                    console.log('Update Success');
                    dbConnect.query("select drugPrice from drugs where drugName = ?",[presDetails.drugName],function(err,rows,fields){
                        if(!!err)
                            console.log(err)
                        else{
                            let cost = parseInt(rows[0].drugPrice)
                            dbConnect.query("update bill set amount = amount + ? where pID = ?",[no*cost,presDetails.pID],function(err){
                                if(!!err)
                                    console.log(err)
                                else{
                                    console.log('Updated Bill')
                                    res.render('addToPres.ejs',{PresMsg:String(presDetails.drugName)+' Added'})
                                }
                            })
                        }
                    })
                }
            })
        }
    }) 
})

app.get('/roomallocate',(req,res)=>{
    res.render('roomAllocate.ejs',{errormsg:null})
})

app.post('/roomallocate',(req,res)=>{
    var roomDetails = req.body;
    console.log(roomDetails);
    var today = new Date();  
    var date2 = new Date(roomDetails.rOutDate);                   
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var qry = "Insert into roomrecord values('"+roomDetails.rNo+"','"+date+"','"+roomDetails.rOutDate+"','"+'em00002'+"','"+roomDetails.pID+"','"+'1'+"')";
    var Difference_In_Time = date2.getTime() - today.getTime(); 
    let value = Difference_In_Time / (1000 * 3600 * 24);
    dbConnect.query(qry,function(error){
        if(!!error)
            console.log(error);
        else{
            console.log('Insert Success');
            dbConnect.query("select rPrice from rooms where rNo = ?",[roomDetails.rNo],function(err,rows,fields){
                if(!!err)
                    console.log(err)
                else{
                    value = value * parseInt(rows[0].rPrice)
                    dbConnect.query("Update bill set amount = amount + ? where pID = ?",[value,roomDetails.pID],function(err){
                        if(!!err)
                            console.log(err)
                        else{
                            res.render('roomAllocate.ejs',{errormsg:'Room Allocated'})
                        }
                    })
                }
            })
        }
    }) 
})

app.get('/roomAvail',function(req,res){
    var roomhist;
    var today = new Date();                     
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    dbConnect.query("select * from rooms where rNo not in (select rNo from roomAvail where rOutDate > ?)",[date],function(error,rows,fields){
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

app.get('/employeeHome',(req,res)=>{
    res.render('employeeHome.ejs')
})

app.get('/treatment',(req,res)=>{
    res.render('patientTreatment.ejs',{treatMsg:''})
})

app.post('/treatment',(req,res)=>{
    var treatDetails = req.body;
    var today = new Date();                     
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var qry = "insert into treatment values('"+doctorDetails.ID+"','"+treatDetails.pID+"','"+String(date + ' '+treatDetails.appTime)+"','"+treatDetails.disease+"')";
    dbConnect.query(qry,function(error){
        if(!!error){
            console.log(error)
        }
        else{
            console.log('success');
            res.render('patientTreatment.ejs',{treatMsg : 'Added Treatment'})
        }
    })
    console.log(qry)
})

app.listen(port,() => {
    console.log("Port 3000 Accessed");
})