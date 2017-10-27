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
      // btn(senderId);
      if (message.message) {
        // If user send text
        if (message.message.text) {
          var text_chat = message.message.text;

          request("http://www.simsimi.com/getRealtimeReq?uuid=UwmPMKoqosEETKleXWGOJ6lynN1TQq18wwvrmCy6IRt&lc=vn&ft=1&reqText="+encodeURI(text_chat)+"&status=W",
            function(error, response, body) {
          
              if (error) return ;
              if (body.indexOf("502 Bad Gateway")> 0 || body.indexOf("respSentence") <0 ) return ;
             

              var text = JSON.parse(body);
              if (text.status == "200")
              {

                var ans=  text.respSentence;
          
                sendMessage(senderId, ans);
        
               console.log("       ans:"+ans);
              }
          });


          // if(text.indexOf("khóa học") != -1 || text.indexOf("khoa hoc") != -1 || text.indexOf("khóa HỌC") != -1){
          // 	sendKhoaHoc(senderId, "Hiện tại Zent có những khóa học như sau");
          // }else{
          // 	sendMessage(senderId, "Tui là bot đây: " + text + " thang " + senderId + " a!");
          // }
        }
      }
    }
  }

  res.status(200).send("OK");
});




function btn(senderId){
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
        "quick_replies":[
          {
            "content_type":"text",
            "title":"khóa học",
            "payload":"<POSTBACK_PAYLOAD>",
            "image_url":"https://itphutran.com/wp-content/uploads/2017/02/lay-duong-dan-mot-file.jpg"
          },
          {
            "content_type":"text",
            "title":"C++",
            "payload":"<POSTBACK_PAYLOAD>",
            "image_url":"data:image/png;base64,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"
          },
          {
            "content_type":"text",
            "title":"Laravel + php",
            "image_url": "http://dovanbao.com/wp-content/uploads/2017/06/php.png",
            "payload":"<POSTBACK_PAYLOAD>"
          }
        ]
      },
    }
  });
}

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
            "image_url":"data:image/png;base64,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"
          },
          {
            "content_type":"text",
            "title":"Laravel + php",
            "image_url": "http://dovanbao.com/wp-content/uploads/2017/06/php.png",
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