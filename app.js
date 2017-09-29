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
          if(text.indexOf("khoa hoc") != -1 || text.indexOf("khóa học") != -1){
          	sendKhoaHoc(senderId, "Hiện tại Zent có những khóa học như sau");
          }else{
          	sendMessage(senderId, "Tui là bot đây: " + text + " thang " + senderId + " a!");
          }
        }
      }
    }
  }

  res.status(200).send("OK");
});






function sendMessage(senderId, message) {

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: "EAABqFngJfVgBAFKJKQ0IQdITNSgHMnVuiwG74Ayg1cokgwZCGkigCf5FiFNTaHEdlod4kUCbg5e0lq0m7fK6tsrZAlLYddR1X854XZAXgt1M6CttPXZBvQtTdgd6HoGOeRwWphebKXiGXWCx5M0B3kh5ZAMPU5EeJAyn6quo6HlUGJX4f45Rd",
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


// gui khoa hoc
function sendKhoaHoc(senderId, message){
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: "EAABqFngJfVgBAFKJKQ0IQdITNSgHMnVuiwG74Ayg1cokgwZCGkigCf5FiFNTaHEdlod4kUCbg5e0lq0m7fK6tsrZAlLYddR1X854XZAXgt1M6CttPXZBvQtTdgd6HoGOeRwWphebKXiGXWCx5M0B3kh5ZAMPU5EeJAyn6quo6HlUGJX4f45Rd",
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message,
        "quick_replies":[
          {
            "content_type":"text",
            "title":"Java",
            "payload":"<POSTBACK_PAYLOAD>",
            "image_url":"https://itphutran.com/wp-content/uploads/2017/02/lay-duong-dan-mot-file.jpg"
          },
          {
            "content_type":"text",
            "title":"C++",
            "payload":"<POSTBACK_PAYLOAD>",
            "image_url":"https://itphutran.com/wp-content/uploads/2017/02/lay-duong-dan-mot-file.jpg"
          },
          {
            "content_type":"text",
            "title":"Laravel + php",
            "payload":"<POSTBACK_PAYLOAD>"
          }
        ]
      },
    }
  });
}


//  lang nghe ket noi
server.listen(port, function(){
	console.log("Chat bot server listening at " + port);
});