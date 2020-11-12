async function postTicket(formData) {
    const url = "http://localhost:5000/ticket/";
    let response = await fetch(url,
        {
            method: "POST",
            headers : { 'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
        });
    let data = await response.json();
    return data;
}

window.addEventListener( 'load', (event) => {
    createHeaderTemplate(markUp.create_issue);
})

const form = document.getElementById("ticket_form");

form.addEventListener( 'submit', (event) => {
    event.preventDefault();
    const formData = {
        project: document.getElementById("project").value,
        ticket_type: document.getElementById("ticket_type").value,
        priority: document.getElementById("priority").value,
        reporter: document.getElementById("reporter").value,
        assign: document.getElementById("assign").value,
        summary: document.getElementById("summary").value,
        description: document.getElementById("description").value,
        create_date: Date().toLocaleUpperCase()
    }
    postTicket(formData).then((value) =>{
        console.log(value.toString());
        window.location.href ='../issue_tracker.html';
    })
    .catch( err=>{ alert(`Error: Contact Administrator \n ${err}`) });
})