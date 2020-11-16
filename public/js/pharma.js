function viewPresc() {
    const id = $('#patientID').val();
    const date = $('#dateIssue').val();
    const time = $('#timeIssue').val();
    const datetime = `${date} ${time}:00`;
    axios.post('/pharma', {
        id, datetime
    }).then(res => {
        //console.log(res.data);
        document.getElementById("presTable").style.display = "block";
    }).catch(err => {

    });
}
