function viewPresc() {
    const id = $('#patientID').val();
    const date = $('#dateIssue').val();
    const time = $('#timeIssue').val();
    const datetime = `${date} ${time}:00`;
    axios.post('/pharma', {
        id, datetime
    }).then(res => {
        //console.log(res.data);
        var html = `<table border='1|1'><thead>
        <tr>
            <td class="cell">Medicine Name</td>
            <td class="cell">Taking Pattern</td>
        </tr>
    </thead><tbody>`;
        for (var i = 0; i < res.data.length; i++) {
            html+="<tr>";
            html+="<td class='cell'>"+res.data[i].medicine+"</td>";
            html+="<td class='cell'>"+res.data[i].dosage+"</td>";
            html+="</tr>";

        }
    html+="</tbody></table>";
    $("#presTable").html(html);
        console.log(res)
    }).catch(err => {

    });
}
