var state = {
    row: 1
}


async function getBranches() {

    const url = "http://localhost:5000/branches/";
    let response = await fetch(url,
        {
            method: "GET",
            headers : { 'Content-Type': 'application/json'}
        });
    let data = await response.json();
    return data;
}

window.addEventListener("load", () => {
    console.log("LOAD EVENT");
    createHeaderTemplate(markUp.branches_header);

    getBranches().then(response => {
        let branchElement = document.getElementById('branches');
        let row = document.createElement('div')
        row.id = "row-0";        
        row.className = "row";
        let rowNumber = 0;
        for (let branch = 0; branch <= response.branches.length; branch++) {

            if( branch == response.branches.length )
            {
                branchElement.appendChild(row);
                break;
            }

            if( branch % 4 == 0 )
            {  
                rowNumber++;
                branchElement.appendChild(row);
                row = document.createElement('div');
                row.className = "row";
                row.id = `row-${rowNumber}`;
            }

            
            let node = document.createElement('div');
            node.className = 'col-4 card';
            let anchor = document.createElement('a');
            let linkText = document.createTextNode(`${response.branches[branch]}`);
            anchor.appendChild(linkText);
            anchor.title = `${response.branches[branch]}`;
            anchor.href = `/branches/${response.branches[branch]}/coverage_report/index.htm`;
            node.appendChild(anchor)
            row.appendChild(node);
        }
    }).catch( err => alert(err.toString() + " Please contact your administrator") );

})