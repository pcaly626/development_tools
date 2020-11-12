# Development Tools
Easy to install and useful forms for DevOps support.

## Code Coverage
Adding the code coverage output to the `branches` directory will dynamically display a link to the index page.

## Issue Tracker
Simple way for developers to report and track code issues or request assistance. 

## Code Review
Form to plan code reviews and notify managers

## Installation
### Requirements: 
1. Linux OS
2. Apache Server
3. Node installed
4. Sqlite3
### Setup:
1. `git clone <development_tools_url>` into the apache root directory _/var/www/html/_
2. `cd backend`
3. Create database sqlite3 database.db
4. `sqlite3 database.db` then read in the sql table creation files `.read sql_files/schema.sql`
3. `npm init`
4. `npm install`
5. `node server.js`
6. Now the Website should be up and working

## Note - 2 things to do:
1. Edit server.js with credentials and emails for notifications

2. You will need to edit the crediential file _backend/keys/credentials.json.template_ => _backend/keys/credentials.json_) with necessary information.
If you are using gmail as a email you will need to go through the steps to setup a google console api (https://console.developers.google.com/).
This was a helpful youtube video (https://youtu.be/JJ44WA_eV8E)

