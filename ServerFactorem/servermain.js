const http = require('http');
const url = require('url');
const fs = require('fs');
const TAFFY = require('taffy');
const createHTML = require('create-html');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
var filignore = [".gitignore", "runserver.bat", "ServerFactorem.zip", "servermain.js", "mainstylesheet.css"];
var filignore1 = ["none", "none", "none", "none", "none"];
var html;
var ip4 = '192.168.*.*';
var wiredip4 = '0.0.0.0';
const { COPYFILE_EXCL } = fs.constants;
var portnum = 8080;
var contentType = {'Content-Type':'text/html'};
var taffydbdata;
var products = TAFFY();
var linkeddb = TAFFY();
var databasestringcontent = "database";
var columns = "";

fs.readFile('serverdb.json', function(err, data) {
    if (err) {
        return err;
    } 
    taffydbdata = JSON.parse(data);
    linkeddb = TAFFY(taffydbdata);
    console.log("Database attributes: ")
    $.each(taffydbdata, function(key, value){
        var attr;
        attr = Object.keys(value);
        if(columns.includes(attr) != true)
            columns = columns.concat(attr);
    });
    console.log(columns);
    //Log the TAFFY database data, and log the products data to compare for debugging purposes
    console.log("TAFFY Database JSON data: ");
    console.log(taffydbdata);
});

function arrayIncludes (string, array) {
    for(var i = 0; i < 5; i++) {
        if(string.includes(array[i])) return true;
    }
    return false;
}

function processContentType (filename) {
    if(arrayIncludes(filename, filignore) === false) {
        if(filename.includes('.js') === true) {
            contentType["Content-Type"] = 'text/javascript';
        }
        if(filename.includes('.html') === true || filename.includes('.txt') === true) {
            contentType["Content-Type"] = 'text/html';
        }
        if(filename.includes('.css') === true) {
            contentType["Content-Type"] = 'text/css';
        }
        if(filename.includes('.jpg') === true || filename.includes('.JPG') === true || filename.includes('.png') === true || filename.includes('.PNG') === true || filename.includes('.bmp') === true || filename.includes('.BMP')) {
            contentType["Content-Type"] = 'image';
        }
        if(filename.includes('.mp4') === true || filename.includes('.MP4') === true || filename.includes('.wmv') === true || filename.includes('.WMV') === true || filename.includes('.avi') === true || filename.includes('.AVI')) {
            contentType["Content-Type"] = 'video';
        }
        if(filename.includes('.exe') === true) {
            contentType["Content-Type"] = 'executable';
        }
        if(filename.includes('.apk') === true || filename.includes('.APK') === true) {
            contentType["Content-Type"] = 'apk';
        }
        if(filename.includes('.zip') === true) {
            contentType["Content-Type"] = 'compressed';
        }
        return contentType["Content-Type"];
    }
    else return 'IGNORE';
}

function createHTMLContent (filelist, size) {
    let htmlContent = `<h1>Main Server Navigational Page</h1>\n<table>\n<tr>\n<th>File Names</th>\n<th>File Type</th>\n<th>Options</th>\n</tr>`;
    for(var i = 0; i < size; i++) {
        let ct = processContentType(filelist[i]);
        if(ct === 'image')
            htmlContent = htmlContent.concat(`\n<tr>\n<td><img src="${filelist[i]}" width="100px"/></td>\n<td>${processContentType(filelist[i])}</td>\n<td><a href="http://${ip4}:8080/${filelist[i]}">View</a><a style="margin-left:10px;" href="http://${ip4}:8080/${filelist[i]}" download="${filelist[i]}">Download</a></td>\n</tr>`);
        else if(ct === 'IGNORE') {
            //We want the css to take effect, so we have to set the content type to text/css
            contentType["Content-Type"] = 'text/css';
            htmlContent = htmlContent.concat(`\n</table>`);
            return htmlContent;
        }
        else
            htmlContent = htmlContent.concat(`\n<tr>\n<td>${filelist[i]}</td>\n<td>${processContentType(filelist[i])}</td>\n<td><a href="http://${ip4}:8080/${filelist[i]}">View</a><a style="margin-left:10px;" href="http://${ip4}:8080/${filelist[i]}" download="${filelist[i]}">Download</a></td>\n</tr>`);
    }
    htmlContent = htmlContent.concat(`\n</table>`);
    //console.log(`HTML Content: ${htmlContent}`);
    return htmlContent;
}

function createDatabaseHTML () {
    let htmlContent = `<h1>Database contents: </h1>`;
    let thheaders = columns.split(",");
    let tdtext = [thheaders.length];
    for(var i = 0; i < thheaders.length; i++) {
        tdtext[i] = linkeddb({"db_data":true}).select(thheaders[i]).toString().split(",");
    }
    htmlContent = htmlContent.concat(`\n<h3>Database Content:</h3>\n`);
    htmlContent = htmlContent.concat(`\n<p>${databasestringcontent}</p>\n`);
    htmlContent = htmlContent.concat(`\n<h3>Database Column Attributes:</h3>\n`);
    htmlContent = htmlContent.concat(`\n<p>${columns}</p>\n`);
    htmlContent = htmlContent.concat(`<table><tr>`);
    for(var i = 0; i < thheaders.length; i++) {
        htmlContent = htmlContent.concat(`<th>${thheaders[i]}</th>\n`);
    }
    htmlContent = htmlContent.concat(`</tr>\n`);
    for(var i2 = 0; i2 < taffydbdata.length; i2++) {
        htmlContent = htmlContent.concat(`<tr>\n`);
        for(var i = 0; i < thheaders.length; i++) {
            htmlContent = htmlContent.concat(`<td>${tdtext[i][i2]}</td>\n`);
        }
        htmlContent = htmlContent.concat(`</tr>\n`);
    }
    //console.log(`HTML Content: ${htmlContent}`);
    return htmlContent;
}

var source = function (req, res) {
    var path = url.parse(req.url, true);
    var filelist = new Array(100);
    var fn = "." + path.pathname;
    let index = 0;
    let htmlContent;
    let dbhtmlContent;
    console.log("req.url: "+req.url);
    if(req.url.includes(".")) {
        /*console.log();
        console.log('----------------');
        console.log("Filepath: " + fn);  
        console.log('Server storage/directory: ');*/
        fs.readdirSync(__dirname).forEach(file => {
            //console.log("File accessible by server: " + file);
            filelist[index] = file;
            index++;
        });
        htmlContent = createHTMLContent(filelist, index);
        dbhtmlContent = createDatabaseHTML();
        html = createHTML({
            title: 'Server Index',
            lang: 'en',
            css: 'mainstylesheet.css',
            body: htmlContent
        });
        fs.writeFile('serverindex2.html', html, function(err) {
            if (err) console.log(err);
        });
        html = createHTML({
            title: 'Server Database Index',
            lang: 'en',
            css: 'mainstylesheet.css',
            body: dbhtmlContent
        });
        fs.writeFile('dbrequestservice.html', html, function(err) {
            if (err) console.log(err);
        });
        console.log(fn);
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
        else if(fn === './dbrequestservice.html') {
            fs.readFile('dbrequestservice.html', function(err, data) {
                if (err) {
                res.writeHead(404, contentType);
                return res.end("404 Not Found");
                } 
                res.writeHead(200, {'Content-Type':'text/html'});
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
    else if(req.url.includes("?data")) {
        var getData = req.url;
        console.log(getData);
    }
    else {
        req.on('data', function (chunk) {
            console.log("CHUNK POST data: " + chunk.toString());
            var filedata = chunk.toString().split("&")[1];
            console.log(chunk.includes("msg%3A"));
            if(chunk.toString().includes("msg%3A")) {
                var msgsplit = chunk.toString().split("msg%3A");
                var msg = msgsplit[1];
                console.log("msg: " + msg);
                msgsplit = msg.split("+");
                msg = "";
                for(var i = 0; i < msgsplit.length; i++) {
                    msg = msg.concat(msgsplit[i] + " ");
                }
                fs.writeFile('textmsg.txt', msg, function(err) {
                    if (err) console.log(err);
                });
            }
        });
        res.end();
    }
}
http.createServer(source).listen(portnum, ip4);

function callback(err) {
    if (err) throw err;
}
