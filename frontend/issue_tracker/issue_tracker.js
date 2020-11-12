
//State of the all tickets for page
var state = {
    tickets: {},
    itemsToPopulate : {
        ticket_type: {
            label:"Type",
            type: 'select',
            options: [
                "Bug",
                "Incident",
                "Database",
                "IT Support",
                "Website",
                "Access"
            ]
        },
        project: {
            label: "Project",
            type: "text"
        }, 
        reporter: {
            label: "Reporter",
            type: "text"
        }, 
        assign: {
            label: "Assigned",
            type: "text"
        }, 
        ticket_priority: {
            label:"Priority",
            type: 'select',
            options: [
                "Minor",
                "Medium",
                "Major",
                "Show Stopper"
            ]
        },
        summary:{
            label: "Summary",
            type: "text"
        }, 
        ticket_description: {
            label: "Description",
            type: "textarea"
        }, 
        resolution: {
            label: "Resolution",
            type: "textarea"
        }, 
        ticket_status: {
            label:"Status",
            type: 'select',
            options: [
                "Pending",
                "In Progress",
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
async function retrieveAllTickets() {
    const url = "http://localhost:5000/tickets/";

    let response = await fetch(url,
        {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
        });

    let tickets = await response.json();
    return tickets;
}


/******************************************************
 * updateTicket()
 * Asynchronous call to Ticket API to update Ticket
 ******************************************************/
async function updateTicket() {
    let payload = {};
    Object.keys(state.itemsToPopulate).map(key => payload[key] = document.getElementById(`${key}_update_id`).value)
    console.log(payload)
    const url = `http://localhost:5000/ticket/${payload.id}/`;

    let response = await fetch(url,
        {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

    let tickets = await response.json();
    return tickets;
}


/******************************************************
 * toggleUpdateTicketForm(id)
 * Toggle between Update Ticket and dashboard. It 
 * also removes Ticket Form container so the form elements
 * can be repopulated. 
 * @param {string} id => Id of Ticket
*******************************************************/
function toggleUpdateTicketForm(id) {
    let containerClass = "update-form-container";
    let updateTicket = document.getElementById('update-ticket');
    let updateTicketClass = updateTicket.className;
    if (new RegExp('show').test(updateTicketClass)) {
        updateTicket.classList.remove("show");
        updateTicket.classList.add('hide');
        document.querySelector(`.${containerClass}`).remove();
    }
    else {
        updateTicket.classList.remove('hide');
        updateTicket.classList.add("show");
        populateUpdateTicketForm(id, containerClass);
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
function populateUpdateTicketForm(id, containerClass) {
    let updateTicket = document.getElementById('update-ticket-form');

    state.tickets.forEach(ticket => {
        if (ticket.id == id) {
            let container = document.createElement('div');
            Object.keys(state.itemsToPopulate).forEach(key => {
                let node = document.createElement('div');
                let br = document.createElement('br');
                let label = createLabel(key);
                let input = null;
                
                if( state.itemsToPopulate[key].type == "select"){
                    input = createSelectElement(key, ticket);
                }
                else {
                    input = createInput(key);
                }
                
                input.value = ticket[key];
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
            container.appendChild(submitButton);
            updateTicket.appendChild(container).className = containerClass;
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

function createSelectElement(key, ticket) {
    let select = document.createElement('select')
    select.name = `${key}_update_id`;
    select.id = `${key}_update_id`;
    
    state.itemsToPopulate[key].options.forEach( option => {
        let optionElement = document.createElement('option');
        if(ticket[key] == option)
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

    createHeaderTemplate(markUp.issue_tracker);

    retrieveAllTickets().then(response => {
        state.tickets = response.tickets
        let ticketKeys = ["id", "create_date", "ticket_type", "ticket_priority", "summary", 'ticket_description', "assign", "ticket_status"]
        let tableBodyElement = document.getElementById('ticket-table-body');
        for (let ticket of response.tickets) {
            let tableRow = document.createElement('tr');
            ticketKeys.map(key => {
                if (key == "create_date") {
                    let formatDate = new Date(ticket[key]);
                    ticket[key] = `${formatDate.getMonth()}/${formatDate.getDate()}/${formatDate.getFullYear()}`;
                }

                let node = document.createElement('td');
                let text = document.createTextNode(`${ticket[key]}`);
                if (key == 'id') {
                    node.className = "ticket-id";
                    node.onclick = () => {
                        toggleUpdateTicketForm(ticket[key]);
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
    updateTicket().then(data => {
        window.location.reload();
    }).catch(err => {
        window.alert(err.message + " Please contact administrator");
    })
})