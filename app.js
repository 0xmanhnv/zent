var logger = require('morgan');
var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var app = express();
var port = process.env.PORT || 8080;


// var urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(logger('dev'));
//set use body parser de post
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// khoi tao server
var server = require('http').Server(app);

app.get('/', (req, res) => {
	// sendMessage("100004067117030", "gui tu dong");
  res.send("Home page. Server running okay.");
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === 'token_facebook') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

// Xử lý khi có người nhắn tin cho bot
app.post('/webhook',function(req, res) {

  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        // If user send text
        if (message.message.text) {
          var text = message.message.text;
          // In tin nhắn người dùng
          // console.log(text); 
          if(text == "hi"){
          	sendMessage(senderId, "Cảm ơn bạn đã nhắn tin cho chúng tôi , chúng tôi sẽ cố gắng liên hệ lại cho bạn sớm nhất có thể!");
          }else{
          	sendMessage(senderId, "Tui là bot đây: " + text + " thang " + senderId + " a!");
          }
        }
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
      access_token: "EAABqFngJfVgBAB6QGRnVdFwGQbnRPOKBeXgbwM1d4iyOLnZC7awbHNs607DeSSrS6PwGwJaHhCMRv7SjEseFc8FagrlUQpuGJoDDpJDvefB5r1KJN8O5wPE4bFacJwigF7hUnZBASCyYGdwLELxePlPnbScZA74OET49mE2tnHiScKNXmHB",
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