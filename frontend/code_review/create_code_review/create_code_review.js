var state = {
    employees: [
        { name:"Eduardo Priego"},
        { name:"Jacob Byerly"},
        { name:"Jordan Graves"},
        { name:"Naren Makkapati"},
        { name:"Paul Clay"},
        { name:"Sayuri Yesaki"},
        { name:"Vince Parish"}
    ]
}

async function postCodeReview(formData) {
    const url = "http://localhost:5000/code_review/";
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
    let updateSelectors = [ 'author', 'reviewer'];
    state.employees.forEach( employee => {
        updateSelectors.forEach( selector => {
            let selectElement = document.getElementById(selector);
            let option = document.createElement('option');
            option.innerHTML = employee.name;
            option.value = employee.name
            selectElement.appendChild(option);
        })
    }
    )
});

const form = document.getElementById("code_review_form");

form.addEventListener( 'submit', (event) => {
    event.preventDefault();
    const formData = {
        author: document.getElementById("author").value,
        reviewer: document.getElementById("reviewer").value,
        branch: document.getElementById("branch").value,
    }
    console.log( formData );
    postCodeReview(formData).then( () =>{
        window.location.href ='../code_review.html';
    })
    .catch( err=>{ alert(`Error: Contact Administrator \n ${err}`) });
})

