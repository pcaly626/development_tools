
var markUp = {
    code_review_header: `
    <nav>
        <a href="../index.html"><img class="white-icon" src="../assets/icons/home-solid.svg" height="23"
                width="35" /></a>
        <a href="create_code_review/create_code_review.html"><img class="white-icon"
                src="../assets/icons/plus-square-regular.svg" height="18" width="35" /><span>Create Code
                Review</span></a>
        <a href="#"><img class="white-icon" src="../assets/icons/columns-solid.svg" height="18" width="35" /><span>Code
                Review Dashboard</span></a>
    </nav>
        `,
    branches_header: `
        <nav>
        <a href="../index.html"><img class="white-icon" src="../assets/icons/home-solid.svg" height="23"
                width="35" /></a>
        <a href="../code_review/code_review.html"><img class="white-icon"
                src="../assets/icons/plus-square-regular.svg" height="18" width="35" /><span>Code Review</span></a>
        <a href="../issue_tracker/issue_tracker.html"><img class="white-icon" src="../assets/icons/columns-solid.svg" height="18" width="35" /><span>Issue Tracker</span></a>
        </nav>
        `
    ,
    issue_tracker:
        `
    <nav>
        <a href="../index.html"><img class="white-icon" src="../assets/icons/home-solid.svg" height="23"
        width="35" /></a>
        <a href="create_ticket/create_ticket.html"><img class="white-icon"
            src="../assets/icons/plus-square-regular.svg" height="18" width="35" /><span>Create Ticket</span></a>
        <a href="#"><img class="white-icon" src="../assets/icons/columns-solid.svg" height="18" width="35" /><span>Issue Tracker</span></a>
    </nav>
    `,
    create_issue:
        `
    <nav>
        <a href="../../index.html"><img class="white-icon" src="../../assets/icons/home-solid.svg" height="23"
        width="35" /></a>
        <a href="#"><img class="white-icon"
            src="../../assets/icons/plus-square-regular.svg" height="18" width="35" /><span>Create Ticket</span></a>
        <a href="../issue_tracker.html"><img class="white-icon" src="../../assets/icons/columns-solid.svg" height="18" width="35" /><span>Issue Tracker</span></a>
    </nav>
    `
}


const createHeaderTemplate = (markUp) => {
    let nav = document.createElement('div');
    nav.innerHTML = markUp;

    let first = document.body.firstChild;
    document.body.insertBefore(nav, first);
}

