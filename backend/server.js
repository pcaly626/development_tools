const express = require('express');
const app = express();
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
/**********************************End of Google OAuth*************************************/

const databaseManager = require('./database_manager');
const codeReviewDatabaseManager = require('./code_review_database_manager');

const PORT = 5000;

app.use( (request, response, next) => {
    response.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    response.header("Access-Control-Allow-Headers",  "Origin, X-Requested-With, Content-Type, Accept");
    response.header( "Access-Control-Allow-Origin", "*");
    next();
});

app.use(express.urlencoded());
app.use(express.json());  

app.get( '/branches/', ( request, response) => {
    const allBranches = fs.readdirSync('../frontend/branches/');
        branchList = allBranches.filter( branch => {if(!RegExp('[.]').test(branch)) return branch});                
        response.status(200).send(JSON.stringify({ branches: branchList }))
})

app.get( '/tickets/', ( request, response ) => {
    let result = 'success';
    if(request.error){
        result = request.error.toString();
    }    

    databaseManager.selectAllInCompleteTickets( (data) => {
        response.send(JSON.stringify({status:result, tickets: data}));
    });
});

app.get( '/complete_tickets/', ( request, response ) => {

    let result = 'success';
    if(request.error)
    {
        result = request.error.toString();
    }
    databaseManager.selectAllCompleteTickets( (data) => {
            response.send(JSON.stringify({status:result, tickets: data}));
    });
});
            
app.post( '/ticket/', ( request, response ) => {
    let result = 'success';

    if(request.error)
    {
        result = request.error.toString();
    }

    let data = request.body;
    let values = Object.keys(data).map( key => {return data[key]})
    databaseManager.insertTicketIntoDatabase(values);
    response.send(JSON.stringify({status:result, data: values}));
});


app.put( '/ticket/:id/', ( request, response ) => { 
    let result = 'success';
    const { id } = request.params;
    if(request.error) 
    {
      result = request.error;
    }
    let data = request.body;
    delete data.id
    delete data.create_date
    let values = Object.keys(data).map( key => {return data[key]})
    databaseManager.updateTicketIntoDatabase(id, values);
    response.send(JSON.stringify({status:result, ticket: values, id: id}));
})

app.listen( PORT, () => {
    console.log(`Internal site server is running on ${PORT}`)
})
