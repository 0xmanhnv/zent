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
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

// khi co nguoi nhan tin cho post
app.post('/webhook', function(req, res){
	var entries = req.body.entry;
	for(var entry of entries){
		var messaging = entry.messaging;
		for(var message of messaging){
			var senderId = message.sender.id;

			if(message.message.text){
				var text = message.message.text;
				console.log(text);
				sendMessage(senderId, "bot day");
			}
		}
	}

	res.status(200).send("OK");
});

// Gửi thông tin tới REST API để trả lời
function sendMessage(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: "EAABqFngJfVgBAD2Xl4c9ZCh0m4ht65AKTehuteeBZCv2GJ8kLISTfu8Ty7he7p2yNu5cWNe6iLmADagcmZCN1oovZCvQ1IITAaXG2lZA8ZCnEQ2YSzpDd0ctuW41ZAyqxS0nFuNITW6YcvemIxWvtSqOqh34eTlIksxwCIG5i9Nz36DyhWdCHTJ",
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}

//  lang nghe ket noi
server.listen(port, function(){
	console.log("Chat bot server listening at " + port);
});