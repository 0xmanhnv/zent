var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var app = express();
var port = process.env.PORT || 8080;
var server = require('http').Server(app);


app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === 'token_facebook') {
  	console.log(req.query['hub.challenge']);
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});


//  lang nghe ket noi
server.listen(port, function(){
	console.log("Chat bot server listening at " + port);
});