
//State of the all tickets for page
var state = {
    codeReviews: {},
    itemsToPopulate : {
        code_review_status: {
            label:"Status",
            type: 'select',
            options: [
                "Pending",
                "Complete"
            ]
        },
        id: {
            label: "",
            type: "text"
        }
    }
}

/******************************************************
 * retrieveAllTickets()
 * Asynchronous call to Ticket API to Retrieve all Tickets
 ******************************************************/
async function retrieveAllInCompleteCodeReviews() {
    const url = "http://localhost:5000/incomplete_code_reviews/";

    let response = await fetch(url,
        {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
        });

    let codeReviews = await response.json();
    return codeReviews;
}


/******************************************************
 * updateTicket()
 * Asynchronous call to Ticket API to update Ticket
 ******************************************************/
async function updateCodeReviews() {
    let payload = {};
    Object.keys(state.itemsToPopulate).map(key => payload[key] = document.getElementById(`${key}_update_id`).value)
    console.log(JSON.stringify(payload))
    const url = `http://localhost:5000/code_review/${payload.id}/`;
    console.log(url)
    let response = await fetch(url,
        {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

    let codeReviews = await response.json();
    return codeReviews;
}


/******************************************************
 * toggleUpdateTicketForm(id)
 * Toggle between Update Ticket and dashboard. It 
 * also removes Ticket Form container so the form elements
 * can be repopulated. 
 * @param {string} id => Id of Ticket
*******************************************************/
function toggleUpdateCodeReviewForm(id) {
    let containerClass = "update-form-container";
    let updateTicket = document.getElementById('update-code-review');
    let updateTicketClass = updateTicket.className;
    if (new RegExp('show').test(updateTicketClass)) {
        updateTicket.classList.remove("show");
        updateTicket.classList.add('hide');
        document.querySelector(`.${containerClass}`).remove();
    }
    else {
        updateTicket.classList.remove('hide');
        updateTicket.classList.add("show");
        populateUpdateCodeReviewForm(id, containerClass);
    }
}

/******************************************************
 * populateUpdateTicketForm(id)
 * Creates dynamic elements for the Update form 
 * based on the ticket ID you select
 * @param {string} id => Id of Ticket
 * @param {string} containerClass => Container Div that 
 * contains all the form children  
 ******************************************************/
function populateUpdateCodeReviewForm(id, containerClass) {
    let updateCodeReview = document.getElementById('update-code-review-form');

    state.codeReviews.forEach(codeReview => {
        if (codeReview.id == id) {
            let container = document.createElement('div');
            Object.keys(state.itemsToPopulate).forEach(key => {
                let node = document.createElement('div');
                let br = document.createElement('br');
                let label = createLabel(key);
                let input = null;
                
                if( state.itemsToPopulate[key].type == "select"){
                    input = createSelectElement(key, codeReview);
                }
                else {
                    input = createInput(key);
                }
                
                input.value = codeReview[key];
                if( key == 'id')
                {
                    input.style.display = 'none';
                }
                node.appendChild(label);
                node.appendChild(br);
                node.appendChild(input);
                container.appendChild(node);
            })

            let buttonText = document.createTextNode("Update");
            let submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.appendChild(buttonText);
            submitButton.className = 'update-code-review-button';
            container.appendChild(submitButton);
            updateCodeReview.appendChild(container).className = containerClass;
        }
    })

}


function createLabel(key) {
    let label = document.createElement('label');
    let text = document.createTextNode(state.itemsToPopulate[key].label)
    label.setAttribute('for', `${key}_update_id`);
    label.appendChild(text);
    return label;
}

function createInput(key) {

    let input = document.createElement('input')
    input.name = `${key}_update_id`;
    input.id = `${key}_update_id`;
    input.type = state.itemsToPopulate[key].type;
    return input;
}

function createSelectElement(key, codeReview) {
    let select = document.createElement('select')
    select.name = `${key}_update_id`;
    select.id = `${key}_update_id`;
    
    state.itemsToPopulate[key].options.forEach( option => {
        let optionElement = document.createElement('option');
        if(codeReview[key] == option)
        {
            optionElement.selected = true;
        }
  
        optionElement.value = option;
        optionElement.innerHTML = option;
        select.appendChild(optionElement);
    })
    return select;
}

/******************************************************
 * On Load get all tickets and populate a table 
 ******************************************************/
window.addEventListener('load', () => {
    retrieveAllInCompleteCodeReviews().then(response => {
        state.codeReviews = response.codeReviews
        let codeReviewKeys = ["id", "create_date", "author", "reviewer", "branch", "code_review_status"]
        let tableBodyElement = document.getElementById('code-review-table-body');
        for (let review of response.codeReviews) {
            let tableRow = document.createElement('tr');
            codeReviewKeys.map(key => {
                if (key == "create_date") {
                    let formatDate = new Date(review[key]);
                    review[key] = `${formatDate.getMonth()}/${formatDate.getDate()}/${formatDate.getFullYear()}`;
                }

                let node = document.createElement('td');
                let text = document.createTextNode(`${review[key]}`);
                if (key == 'id') {
                    node.className = "code-review-id";
                    node.onclick = () => {
                        toggleUpdateCodeReviewForm(review[key]);
                    }
                }
                node.appendChild(text);
                tableRow.append(node);
            })
            tableBodyElement.appendChild(tableRow);
        }
    }).catch( err =>  
        window.alert( err.toString() + " Please contact you administator" )
    )
})

/******************************************************
 * On Submit update a ticket then reload the page
 ******************************************************/
window.addEventListener('submit', (event) => {
    event.preventDefault();
    updateCodeReviews().then(data => {
        window.location.reload();
    }).catch(err => {
        window.alert(err.message + " Please contact administrator");
    })
})