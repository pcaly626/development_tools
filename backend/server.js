const http = require('http');
const fs = require('fs');
const mail = require("nodemailer");
const {google} = require("googleapis");
const readline = require('readline');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = __dirname + '/keys/token.json';
let keys = {}
let tokens = {}
// Load client secrets from a local file.
fs.readFile('./keys/credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), listLabels);
  keys = JSON.parse(content);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    tokens = JSON.parse(token)
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      console.log('Labels:');
      labels.forEach((label) => {
        console.log(`- ${label.name}`);
      });
    } else {
      console.log('No labels found.');
    }
  });
}

const ticketDatabaseManager = require('./ticket_database_manager');
const codeReviewDatabaseManager = require('./code_review_database_manager');

const PORT = 5000;

const server = http.createServer(function (request, response) {
    console.log(request.url)
    if (request.url == '/branches/') {
        const allBranches = fs.readdirSync('../frontend/branches/');
        branchList = allBranches.filter( branch => {if(!RegExp('[.]').test(branch)) return branch});        
        response.writeHead(200, {
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*"
        });
        response.write(JSON.stringify({ branches: branchList }));
        response.end();
    }

    if(request.url == '/ticket/') {
        console.log("IN TICKET");
        response.writeHead(200, {
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*"
        });

        let result = 'success';
        request.on('error', err =>{
            result = err.message;
        }).on('data', function(chunk) {
            let data = JSON.parse(chunk);
            let values = Object.keys(data).map( key => {return data[key]})
           ticketDatabaseManager.insertTicketIntoDatabase(values);
            response.write(JSON.stringify({status:result, data: values}));
        }).on( 'end', () => {
            response.end();
        })
    }
    
    if( new RegExp ('/ticket/[0-9]').test(request.url) ){
        let regEx = /\/[0-9]*\//;
        let ticketID = request.url.match(regEx)[0].split('/')[1];
        console.log(`IN TICKET and ID is ${ticketID}`);

        response.writeHead(200, {
            "Access-Control-Allow-Methods": "PUT, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*"
        });

        let result = 'success';
        request.on('error', err =>{
            result = err.message;
        }).on('data', function(chunk) {
            let data = JSON.parse(chunk);
            delete data.id
            delete data.create_date
            let values = Object.keys(data).map( key => {return data[key]})
           ticketDatabaseManager.updateTicketIntoDatabase(ticketID, values);
            response.write(JSON.stringify({status:result, ticket: values, id: ticketID}));
        }).on( 'end', () => {
            response.end();
        })
    }

    if(request.url == '/tickets/') {
        console.log("IN TICKETS");
        response.writeHead(200, {
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*"
        });
        let result = 'success';
        request.on('error', err =>{
            result = err.message;
        })
       ticketDatabaseManager.selectAllInCompleteTickets( (data) => {
            response.write(JSON.stringify({status:result, tickets: data}));
            response.end();
        });
    }


    if(request.url == '/complete_tickets/') {
        console.log("IN COMPLETE TICKETS");
        response.writeHead(200, {
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*"
        });
        let result = 'success';
        request.on('error', err =>{
            result = err.message;
        })
       ticketDatabaseManager.selectAllCompleteTickets( (data) => {
            response.write(JSON.stringify({status:result, tickets: data}));
            response.end();
        });
    }

    if(request.url == '/all_tickets/') {
        console.log("IN ALL TICKETS");
        response.writeHead(200, {
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*"
        });
        let result = 'success';
        request.on('error', err =>{
            result = err.message;
        })
       ticketDatabaseManager.selectAllTicketInDatabase( (data) => {
            response.write(JSON.stringify({status:result, tickets: data}));
            response.end();
        });
    }

    if(request.url == '/code_review/') {
        console.log("IN CODE REVIEW");
        response.writeHead(200, {
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*"
        });
        let result = 'success';
        request.on('error', err =>{
            result = err.message;
        }).on( 'data', function(chunk) {
            let data = JSON.parse(chunk);
            let values = Object.keys(data).map( key => {return data[key]})
            codeReviewDatabaseManager.insertCodeReviewIntoDatabase( values );
            response.write(JSON.stringify({status:result, data: values}));
            let transport = mail.createTransport({
                service: 'gmail',
                tls:{
                    requestUnauthorized: false
                },
                auth: {
                    type: 'OAuth2',
                    user: keys.email_user,
                    pass: keys.email_password,
                    clientId: keys.installed.client_id,
                    clientSecret: keys.installed.client_secret,
                    refreshToken: tokens.refresh_token
                }
            });
            transport.sendMail({
                from: 'Web user@email.com',
                to: "Test user@email.com",
                subject: `Code Review created for ${data.branch}`,
                html: 
                `
                <div>
                    <h3>Code Review for ${data.branch}</h3>
                    <p>Author of the changes: ${data.author}</p>
                    <p>Reviewer: ${data.reviewer}</p>
                </div>
                `
            }, function(err){
                if(err) console.log(err.toString())
            })
        }).on( 'end', ()=>{
            response.end();
        });
    }

    if(request.url == '/incomplete_code_reviews/') {
        console.log("IN INCOMPLETE CODE REVIEWS");
        response.writeHead(200, {
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*"
        });
        let result = 'success';
        request.on('error', err =>{
            result = err.message;
        })
        codeReviewDatabaseManager.selectAllInCompleteCodeReviews( (data) => {
            response.write(JSON.stringify({status:result, codeReviews: data}));
            response.end();
        });
    }
    
    if( new RegExp ('/code_review/[0-9]').test(request.url) ){
        let regEx = /\/[0-9]*\//;
        let codeReviewID = request.url.match(regEx)[0].split('/')[1];
        console.log(codeReviewID)
        console.log(`IN CODE REVIEW and ID is ${codeReviewID}`);

        response.writeHead(200, {
            "Access-Control-Allow-Methods": "PUT, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*"
        });

        let result = 'success';
        request.on('error', err =>{
            result = err.message;
        }).on('data', function(chunk) {
            let data = JSON.parse(chunk);
            delete data.id
            delete data.create_date
            let values = Object.keys(data).map( key => {return data[key]})
            codeReviewDatabaseManager.updateCodeReviewIntoDatabase(codeReviewID, values);
            response.write(JSON.stringify({status:result, codeReviews: values, id: codeReviewID}));
        }).on( 'end', () => {

            response.end();
        })
    }
})

server.listen(PORT);
console.log(`Internal site server is running on ${PORT}`)
