
/**
 * Module dependencies.
 */

var express = require('express'),
code = require('./routes/code')
  , routes = require('./routes')
  , article = require('./routes/article')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
  var hljs = require('highlight.js'),
markdown = require('marked');
var cradle = require('cradle'),
connection = require('./config/couchdb/connection');

cradle = new(cradle.Connection)(connection.host, connection.port, { auth: { username: connection.username, password: connection.password}});
var db = cradle.database(connection.database)
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/articles.json', function(req, res) {
  console.log("json")
})
app.put('/articles/:id/:rev', article.update)
app.post('/articles/:id/:rev', function(req, res) {
  console.log(req.params.id, req.params.rev, req.body)
})
app.get('/articles', article.index)
app.get('/articles/:id', function(req, res) {
  db.get(req.params.id, function(err, doc) {
    markdown.setOptions({highlight: function(code) {
        return hljs.highlightAuto(code).value
    }})
    markdown(doc.content, function(err, content) {
        if (err) throw err;
        
    res.render("article/show", { content: content})
    })
  })
})
app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
