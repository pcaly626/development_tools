const sqlite = require('sqlite3');

class DatabaseManager {

    static async insertTicketIntoDatabase (ticketData) {
        let db = new sqlite.Database( './database.db', sqlite.OPEN_READWRITE, err => {
            if( err ) {
                console.error(err.message);
            }
            console.log("Now Connected to DATABASE");
        })
        
        db.run('INSERT INTO ticket(project,ticket_type,ticket_priority,reporter,assign,summary,ticket_description,create_date) VALUES (?,?,?,?,?,?,?,?)', ticketData, err =>{
            if(err){
                console.log(err.message);
            }
            console.log(`A row has been inserted with rowid `);
        })

        db.close((err) => {
            if (err) {
              console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    }

    static async updateTicketIntoDatabase (id, ticket) {
        let db = new sqlite.Database( './database.db', sqlite.OPEN_READWRITE, err => {
            if( err ) {
                console.error(err.message);
            }
            console.log("Now Connected to DATABASE");
        })
        ticket.push(id)
        let sql = "UPDATE ticket SET ticket_type=?, project=?, reporter=?,assign=?,ticket_priority=?,summary=?,ticket_description=?, resolution=?, ticket_status=?  WHERE id = ?";
        db.run(sql, ticket, err =>{
            if(err){
                console.log(err.message);
            }
            console.log(`A row has been updated with rowid ${id}`);
        })

        db.close((err) => {
            if (err) {
              console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    }


    static async selectAllTicketInDatabase (callBackDataToAPI) {
        let allTickets = [];
        
        let db = new sqlite.Database( './database.db', sqlite.OPEN_READWRITE, err => {
            if( err ) {
                console.error(err.message);
            }
            console.log("Now Connected to DATABASE");
        })
        

        db.all('SELECT * FROM ticket;', [], ( err, rows ) =>{
            if(err){
                console.log(err.message);
            }
            rows.forEach( row => allTickets.push(row))
            
        });
        db.close( err => {
            if (err) {
              console.error(err.message);
            }
            console.log('Close the database connection.'); 
            callBackDataToAPI(allTickets);
        });
    }


    static async selectAllInCompleteTickets(callBackDataToAPI) {
        let allTickets = [];
        
        let db = new sqlite.Database( './database.db', sqlite.OPEN_READWRITE, err => {
            if( err ) {
                console.error(err.message);
            }
            console.log("Now Connected to DATABASE");
        })
        

        db.all('SELECT * FROM ticket WHERE ticket_status != "Complete";', [], ( err, rows ) =>{
            if(err){
                console.log(err.message);
            }
            rows.forEach( row => allTickets.push(row))
            
        });
        db.close( err => {
            if (err) {
              console.error(err.message);
            }
            console.log('Close the database connection.'); 
            callBackDataToAPI(allTickets);
        });
    }

    static async selectAllCompleteTickets(callBackDataToAPI) {
        let allTickets = [];
        
        let db = new sqlite.Database( './database.db', sqlite.OPEN_READWRITE, err => {
            if( err ) {
                console.error(err.message);
            }
            console.log("Now Connected to DATABASE");
        })
        

        db.all('SELECT * FROM ticket WHERE ticket_status == "Complete";', [], ( err, rows ) =>{
            if(err){
                console.log(err.message);
            }
            rows.forEach( row => allTickets.push(row))
            
        });
        db.close( err => {
            if (err) {
              console.error(err.message);
            }
            console.log('Close the database connection.'); 
            callBackDataToAPI(allTickets);
        });
    }

};

module.exports = DatabaseManager;