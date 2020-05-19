var http = require('http');
var url = require('url');
var fs = require('fs');
var portnum = 8080;
var contentType = {'Content-Type':'text/html'};

function processContentType (filename) {
    if(filename.includes('.js') === true) {
        contentType["Content-Type"] = 'text/javascript';
    }
    if(filename.includes('.html') === true || filename.includes('.txt') === true) {
        contentType["Content-Type"] = 'text/html';
    }
}

var source = function (req, res) {
    var path = url.parse(req.url, true);
    var fn = "." + path.pathname;
    console.log(fn);
    processContentType (fn);
    fs.readFile('serverindex.html', function(err, data) {
        if (err) {
          res.writeHead(404, contentType);
          return res.end("404 Not Found");
        } 
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        return res.end();
      });
    if(fn != './') {
        fs.readFile(fn, function(err, data) {
        if (err) {
            res.writeHead(404, contentType);
            return res.end("404 Not Found");
        } 
        res.writeHead(200, contentType);
        res.write(data);
        return res.end();
        });
    }
  }
http.createServer(source).listen(portnum);