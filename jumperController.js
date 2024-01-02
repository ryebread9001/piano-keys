const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database("/var/database/messages.db", sqlite3.OPEN_READWRITE);

module.exports.postScore = async (req, res, next) => {
    try {
        const username = "test-user";
        let text = `{ "username":"${username}" , "score":"${req.body['score']}" , "date":"${req.body['date']}" }`;
        db.run("INSERT INTO tbl (one) VALUES ( ?1 );", {1: text});
        console.log("WE GOT TO HERE AT LEAST");
        res.send(`score-posted: ${req.body['score'] + "-" + username + "-" + req.body['date']}`);
    } catch (err) {
        next(err);
    };
}


module.exports.getScore = async (req, res, next) => {
    try {
        console.log("WE GOT TO HERE AT LEAST");
        db.all("SELECT * FROM tbl;", (err, rows) => {
            console.log("DB CALL");
            res.send(rows);
        });
    } catch (err) {
        console.log(err);
        next(err);
    };
}