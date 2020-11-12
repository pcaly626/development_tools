const sqlite = require('sqlite3');

class CodeReviewDatabaseManager {

    static async insertCodeReviewIntoDatabase (codeReviewData) {
        let db = new sqlite.Database( './database.db', sqlite.OPEN_READWRITE, err => {
            if( err ) {
                console.error(err.message);
            }
            console.log("Now Connected to MMT_DATABASE");
        })
        
        db.run('INSERT INTO code_review(author,reviewer,branch) VALUES (?,?,?)', codeReviewData, err =>{
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

    static async updateCodeReviewIntoDatabase (id, codeReview) {
        let db = new sqlite.Database( './database.db', sqlite.OPEN_READWRITE, err => {
            if( err ) {
                console.error(err.message);
            }
            console.log("Now Connected to DATABASE");
        })
        codeReview.push(id)
        console.log(codeReview)
        let sql = "UPDATE code_review SET code_review_status=?  WHERE id = ?";
        db.run(sql, codeReview, err =>{
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


    static async selectAllCodeReviewsInDatabase (callBackDataToAPI) {
        let allTickets = [];
        
        let db = new sqlite.Database( './database.db', sqlite.OPEN_READWRITE, err => {
            if( err ) {
                console.error(err.message);
            }
            console.log("Now Connected to DATABASE");
        })
        

        db.all('SELECT * FROM code_review;', [], ( err, rows ) =>{
            if(err){
                console.log(err.message);
            }
            rows.forEach( row => allReviews.push(row))
            
        });
        db.close( err => {
            if (err) {
              console.error(err.message);
            }
            console.log('Close the database connection.'); 
            callBackDataToAPI(allReviews);
        });
    }


    static async selectAllInCompleteCodeReviews(callBackDataToAPI) {
        let allReviews = [];
        
        let db = new sqlite.Database( './database.db', sqlite.OPEN_READWRITE, err => {
            if( err ) {
                console.error(err.message);
            }
            console.log("Now Connected to DATABASE");
        })
        

        db.all('SELECT * FROM code_review WHERE code_review_status != "Complete";', [], ( err, rows ) =>{
            if(err){
                console.log(err.message);
            }
            rows.forEach( row => allReviews.push(row))
            
        });
        db.close( err => {
            if (err) {
              console.error(err.message);
            }
            console.log('Close the database connection.'); 
            callBackDataToAPI(allReviews);
        });
    }

    static async selectAllCompleteTickets(callBackDataToAPI) {
        
        let db = new sqlite.Database( './database.db', sqlite.OPEN_READWRITE, err => {
            if( err ) {
                console.error(err.message);
            }
            console.log("Now Connected to DATABASE");
        })
        

        db.all('SELECT * FROM code_review WHERE code_review_status == "Complete";', [], ( err, rows ) =>{
            if(err){
                console.log(err.message);
            }
            rows.forEach( row => allReviews.push(row))
            
        });
        db.close( err => {
            if (err) {
              console.error(err.message);
            }
            console.log('Close the database connection.'); 
            callBackDataToAPI(allReviews);
        });
    }

};

module.exports = CodeReviewDatabaseManager;