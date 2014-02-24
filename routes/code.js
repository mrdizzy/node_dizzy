var hljs = require('highlight.js'),
markdown = require('marked');
exports.index = function(req, res) {
    
    res.render('code/index', { title: 'Express' });
    
}

exports.create = function(req, res) {
    var doc = req.body.code;
    markdown.setOptions({highlight: function(code) {
        return hljs.highlightAuto(code).value
    }})
    markdown(doc, function(err, content) {
        if (err) throw err;
        
    res.render("code/create", { code: content})
    })
}