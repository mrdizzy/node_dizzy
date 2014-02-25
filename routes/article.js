var cradle = require('cradle'),
connection = require('./../config/couchdb/connection');

cradle = new(cradle.Connection)(connection.host, connection.port, { auth: { username: connection.username, password: connection.password}});
var db = cradle.database(connection.database)
console.log(connection)


/*
 * GET users listing.
 */
exports.index = function(req, res) {
  

  db.view('types/by_article', function(err, response) {
        res.render('article/index', { articles: response.toArray()})
    })
        
}