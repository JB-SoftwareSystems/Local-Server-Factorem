var http = require('http');
var url = require('url');
var fs = require('fs');
var createHTML = require('create-html');
var html;
const { COPYFILE_EXCL } = fs.constants;
var portnum = 8080;
var contentType = {'Content-Type':'text/html'};

function processContentType (filename) {
    if(filename.includes('.js') === true) {
        contentType["Content-Type"] = 'text/javascript';
    }
    if(filename.includes('.html') === true || filename.includes('.txt') === true) {
        contentType["Content-Type"] = 'text/html';
    }
    if(filename.includes('.css') === true) {
        contentType["Content-Type"] = 'text/css';
    }
    return contentType["Content-Type"];
}

function createHTMLContent (filelist, size) {
    let htmlContent = `<h1>Main Server Navigational Page</h1>\n<h3>Server Files:</h3>\n<table>\n<tr>\n<th>File Names</th>\n<th>File Type</th>\n<th>Options</th>\n</tr>`;
    for(var i = 0; i < size; i++) {
        htmlContent = htmlContent.concat(`\n<tr>\n<td>${filelist[i]}</td>\n<td>${processContentType(filelist[i])}</td>\n<td><a href="http://localhost:8080/${filelist[i]}">View</a></td>\n</tr>`);
    }
    htmlContent = htmlContent.concat(`\n</table>`);
    console.log(`HTML Content: ${htmlContent}`);
    return htmlContent;
}

var source = function (req, res) {
    var path = url.parse(req.url, true);
    var filelist = new Array(100);
    var fn = "." + path.pathname;
    let index = 0;
    let htmlContent;
    console.log();
    console.log('----------------');
    console.log("Filepath: " + fn);  
    console.log('Server storage/directory: ');
    fs.readdirSync('C:/mrt/Berkan/NodeJS/ServerFactorem/').forEach(file => {
        console.log("File accessible by server: " + file);
        filelist[index] = file;
        index++;
    });
    htmlContent = createHTMLContent(filelist, index);
    html = createHTML({
        title: 'Server Index',
        lang: 'en',
        css: 'mainstylesheet.css',
        body: htmlContent
      });
    fs.writeFile('serverindex2.html', html, function(err) {
        if (err) console.log(err);
    });
    processContentType (fn);
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
    else {
        fs.readFile('serverindex2.html', function(err, data) {
            if (err) {
              res.writeHead(404, contentType);
              return res.end("404 Not Found");
            } 
            res.writeHead(200, {'Content-Type':'text/html'});
            res.write(data);
            return res.end();
          });
    }
  }
http.createServer(source).listen(portnum);

function callback(err) {
    if (err) throw err;
}