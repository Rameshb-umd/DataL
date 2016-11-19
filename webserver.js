//Lets require/import the HTTP module
var http = require('http');
var url = require("url");

//Lets define a port we want to listen to
const PORT = 8080;

var Cached_urltoDisplay = "";
var Cached_question = "";
var Cached_answer = "";
//We need a function which handles requests and send response
function handleRequest(request, response) {
    var url_parts = url.parse(request.url, true);
    console.log("Path" + url_parts.pathname);
    if (url_parts.pathname == "/visualize/") {
        response.writeHead(200, {
            "Content-Type": "application/json"
        });

        var jsonObject = {
            question: Cached_question,
            answer: Cached_answer,
            urltoDisplay: Cached_urltoDisplay
        };
        var json = JSON.stringify(jsonObject);
        console.log("Path" + Cached_urltoDisplay);
        response.end(json);
        //response.end('<img src="' + urltoDisplay + '" alt="Smiley face" height="42" width="42">');
        return true;
    } else {
        var query = url_parts.query;
        var query_from_alexa = query.Query;
        findtheKnowledge(query_from_alexa, function (message) {
            response.end('' + message);
        });
    }
    //response.end('Finding results for your Query ' + query.Query);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});


//var returned = findtheKnowledge("what drives professional infrastructure");

function findtheKnowledge(question, callbackFunction) {

    var XLSX = require('xlsx');
    var replaceall = require("replaceall");
    if (question == undefined) {
        console.log("Filtering");
    } else {
        question = question.replace("ask babe", "").trim();
        var workbook = XLSX.readFile('KnowledgeBase.xlsx');
        var first_sheet_name = workbook.SheetNames[0];
        var knowledgeBase = workbook.Sheets[first_sheet_name];
        for (z in knowledgeBase) {
            var tt = 0;
            for (var i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            };
            var col = z.substring(0, tt);
            var row = parseInt(z.substring(tt));
            /* all keys that do not begin with "!" correspond to cell addresses */
            if (z[0] === '!') continue;
            if (z[0] === 'A') {
                if (row != 1) {
                    var query = JSON.stringify(knowledgeBase[z].v);
                    query = query.replace(/"/g, "");
                    var value_cell = 'B' + row;
                    var value = JSON.stringify(knowledgeBase[value_cell].v);
                    console.log(query + ":" + question + ":");
                    var url_cell = 'C' + row;
                    var url = JSON.stringify(knowledgeBase[url_cell].v);
                    if (query == question) {
                        Cached_urltoDisplay = url;
                        Cached_question = question;
                        Cached_answer = value;
                        //response.end('Finding results for your Query ' + value);
                        callbackFunction(value);
                        //return value;
                    }
                }
            }
        }
        callbackFunction("No value found for this");
    }
}