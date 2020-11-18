function signup() {
    console.log('came here bro')
    const patientFname = $('#patientFname').val();
    const patientLname = $('#patientLname').val();
    const patientDOB = $('#patientDOB').val();
    const patientGender = $('#patientGender').val();
    const patientPhone = $('#patientPhone').val();
    const patientDoor = $('#patientDoor').val();
    const patientStreet = $('#patientStreet').val();
    const patientPincode = $('#patientPincode').val();
    const patientPwd = $('#patientPwd').val();
    axios.post('/shplogin/signuppat', {
        patientFname, patientLname, patientDOB, patientGender, patientPhone, patientDoor, patientStreet, patientPincode, patientPwd
    }).then(res => {
        console.log(res.data);
        var html = "<script> alert('";
        html += res.data.msg
    html+="')</script>";
    $("#status").html(html);
        console.log(res)
    }).catch(err => {

    });
}