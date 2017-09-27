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
	buttonMenu();

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
          	sendMessage(senderId, "hihi ccccccc");
          }else{
          	sendMessage(senderId, "Tui là bot đây: " + text);
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

// button 
function buttonMenu(){
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {
	      access_token: "EAABqFngJfVgBAD2Xl4c9ZCh0m4ht65AKTehuteeBZCv2GJ8kLISTfu8Ty7he7p2yNu5cWNe6iLmADagcmZCN1oovZCvQ1IITAaXG2lZA8ZCnEQ2YSzpDd0ctuW41ZAyqxS0nFuNITW6YcvemIxWvtSqOqh34eTlIksxwCIG5i9Nz36DyhWdCHTJ",
	    },
	    method: 'POST',
	    json:{
	    	"persistent_menu":[
			    {
			      "locale":"default",
				      "composer_input_disabled":true,
				      "call_to_actions":[
				        {
				          "title":"My Account",
				          "type":"nested",
				          "call_to_actions":[
				            {
				              "title":"Pay Bill",
				              "type":"postback",
				              "payload":"PAYBILL_PAYLOAD"
				            },
				            {
				              "title":"History",
				              "type":"postback",
				              "payload":"HISTORY_PAYLOAD"
				            },
				            {
				              "title":"Contact Info",
				              "type":"postback",
				              "payload":"CONTACT_INFO_PAYLOAD"
				            }
				          ]
				        },
				        {
				          "type":"web_url",
				          "title":"Latest News",
				          "url":"http://petershats.parseapp.com/hat-news",
				          "webview_height_ratio":"full"
				        }
				      ]
				    },
				    {
				      "locale":"zh_CN",
				      "composer_input_disabled":false
				    }
				  ]
				}
	    }
	});
}

//  lang nghe ket noi
server.listen(port, function(){
	console.log("Chat bot server listening at " + port);
});