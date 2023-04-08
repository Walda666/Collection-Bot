const mysql = require('mysql')
const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database : "collectionbot"
 
  });
  db.connect(function(err) {
    if (err) throw err;

});

module.exports = db