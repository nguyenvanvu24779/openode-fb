var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var client = new Client();
const https = require('https');
function getStrings(test_str, text_begin, text_end) {
      var start_pos = test_str.indexOf(text_begin);
      if (start_pos < 0) {
         return '';
      }
      start_pos += text_begin.length;
      var end_pos = test_str.indexOf(text_end, start_pos);
      var text_to_get = test_str.substring(start_pos, end_pos);
      return text_to_get;
}


router.get('/', function (req, res) {
	return res.send("Hello opeNode!");
});

router.get('/checkip', function (req, res) {
    // direct way 
    client.get("http://ip-api.com/json", function (data, response) {
        // parsed response body as js object 
        console.log(data);
        return res.send(data);
        // raw response 
        //console.log(response);
    });
	//return res.send("Hello opeNode!");
});

router.get('/test', function (req, res) {
    console.log(req.query.userAgent);
    res.json({msg : 'OK'})
});

router.get('/post2GroupVideo', function (req, res) {
    var groupId = req.query.groupId;
    var message = req.query.message;
    var c_user =  req.query.c_user;
    var cookie = req.query.cookie;
    var __dyn = req.query.jazoest;
    var fb_dtsg = req.query.fb_dtsg;
    var jazoest = req.query.jazoest;
    var videoId = req.query.videoId;
    var userAgent = req.query.userAgent;
	
    var urlParameters = 
            "composer_entry_time=7"+
            "&composer_session_id=de9f2c9a-8d7e-4bc4-87bd-6c988817e04d"+
            "&composer_session_duration=2774"+
            "&composer_source_surface=group"+
            "&hide_object_attachment=false"+
            "&num_keystrokes=16"+
            "&num_pastes=0"+
            "&privacyx&ref=group"+
            "&xc_sticker_id=0"+
            "&target_type=group"+
            "&xhpc_message="+  encodeURI(message)  +
            "&xhpc_message_text="+ encodeURI(message)  +
            "&is_react=true"+
            "&xhpc_composerid=rc.u_jsonp_4_r"+
            "&xhpc_targetid=" + groupId +
            "&xhpc_context=profile"+
            "&xhpc_timeline=false"+
            "&xhpc_finch=false"+
            "&xhpc_aggregated_story_composer=false"+
            "&xhpc_publish_type=1"+
            "&xhpc_fundraiser_page=false"+
            "&__user=" + c_user +
            "&__a=1"+
           // "&__dyn="+ __dyn + 
            "&__req=49"+
            "&__be=1"+
            "&__pc=EXP1%3Ahome_page_pkg"+
            "&__rev=3453879"+
            "&fb_dtsg="+ fb_dtsg + 
            "&jazoest="+ jazoest + 
            "&__spin_r=3453879"+
            "&__spin_b=trunk"+
            "&__spin_t=1510641759"+
            "&attachment[type]=11"+
            "&attachment[params][0]=" + videoId +
            "&attachment[reshare_original_post]=false"+
            "&xc_share_params=[" + videoId + "]" +
            "&xc_share_target_type=11"
	    
    var options = { 
        hostname: 'www.facebook.com',
        path: "/ajax/updatestatus.php?av=" + req.c_user +  "&dpr=1",
        method: 'POST',
        headers: {'Cookie': cookie,
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'user-agent' : userAgent
        }
    };
    var request =  https.request(options, (resp) => {
          var data = '';
         
          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            data += chunk;
          });
         
          // The whole response has been received. Print out the result.
          resp.on('end', () => {
           // console.log('end' + data);
          });
     
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  
  request.write(urlParameters);
  request.end();
  return res.json({ message : 'ok' });
});

router.get('/countGroupsAccount', function (req, res) {
    var cookie = req.query.cookie;
    var userAgent = req.query.userAgent;
    
    var options = 
        { 
            hostname: 'www.facebook.com',
            path: "/bookmarks/groups",
            method: 'GET',
            headers: {
                'Cookie':  cookie ,
                'user-agent' : userAgent
            }
        };
    var data = '';
                
    var request =  https.request(options, (resp) => {
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });
             
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            //console.log('end' + data);
            var regexp = /leave.php\?group_id=/g;
            var match, matches = [];
            var arrGroupId = [];
            
            while ((match = regexp.exec(data)) != null) {
                matches.push(match.index);
                arrGroupId.push(data.substring(match.index + 19, match.index + 19 + 15))
            }
            return res.json({data : arrGroupId});
     
        });
    
    }).on("error", (err) => {
            console.log("Error: " + err.message);
    });
    request.end();

});

router.get('/genFullInfoFromCooike', function (req, res) {
    var cookie = req.query.cookie;
    var userAgent = req.query.userAgent;
   
    var headers = {
        "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
        "accept-language" : "en-US,en;q=0.8",
        "accept" : "accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "user-agent" :userAgent,
        "accept-encoding" : "gzip, deflate, br",
        "cookie" :  cookie
    };
    var options = { 
          hostname: 'www.facebook.com',
          path: "/",
          method: 'GET',
          headers: headers
    };
    
    var chunks = [];
    
    var request =  https.request(options, (resp) => {
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                chunks.push(chunk);
              });
             
              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                var buffer = Buffer.concat(chunks);
                var encoding = resp.headers['content-encoding'];
                if(resp.headers.location && resp.headers.location.includes('checkpoint')){
                   return res.json({err : 'checkpoint'});
                }
                if( encoding == 'br'){  
                    /*
                  decompress(buffer, function(err, output) {
                    //(err, );
                    var strContent = '';
                    if(output){ 
                      strContent =   output.toString();
                      var fb_dtsg  = getStrings(strContent , '{"token":"', '"')
                      var jazoest = '';
                      for (var i = 0; i < fb_dtsg.length; i++) jazoest += fb_dtsg.charCodeAt(i);
                      //console.log(jazoest);
                      return res.json({data : {fb_dtsg : fb_dtsg, jazoest : jazoest}})
                    } else res.json({})
                    
                  });*/
                  return res.json({data : buffer});
                }// callback('null')
                
              });
         
        }).on("error", (err) => {
          console.log("Error: " + err.message);
          res.json({err : err})
    });
    request.end();

});


router.get('/Join2Group', function (req, res) {
    var cookie = req.query.cookie;
    var fb_dtsg = req.query.fb_dtsg;
    var jazoest = req.query.jazoest;
    var __user = req.query.__user;
    var groupId = req.query.groupId;
    var userAgent = req.query.userAgent;
   
    var params = "ref=group_jump_header"
    +"&group_id=" + groupId
    +"&client_custom_questions=1"
    +"&__user=" + __user
    +"&__a=1"
    +"&__req=q&__be=1&__pc=PHASED%3ADEFAULT&__rev=3548041"
    +"&fb_dtsg=" + fb_dtsg
    +"&jazoest=" + jazoest
    +"&__spin_r=3548041&__spin_b=trunk&__spin_t=1514077825";
    
    var options = { 
                hostname: 'www.facebook.com',
                path: "/ajax/groups/membership/r2j.php?dpr=1",
                method: 'POST',
                headers: {'Cookie':  cookie,
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'user-agent' : userAgent
                }
    };
    var request =  https.request(options, (resp) => {
          var data = '';
         
          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            data += chunk;
          });
         
          // The whole response has been received. Print out the result.
          resp.on('end', () => {
           // console.log('end' + data);
           res.json({msg : 'OK'})
          });
     
    }).on("error", (err) => {
      console.log("Error: " + err.message);
       res.json({err : err})
    });
    
    request.write(params);
    request.end();

});

router.get('/Join2GroupAnswer', function (req, res) {
    var cookie = req.query.cookie;
    var groupId = req.query.groupId;
    var userAgent = req.query.userAgent;
    var params = req.query.params;
    var customQuestions = req.query.customQuestions;
    const buffParams = Buffer.from(params, 'base64');
    const buffCustomQuestions = Buffer.from(customQuestions, 'base64');
   // console.log(buffCustomQuestions.toString('utf8'));
    
    
    var options = { 
                hostname: 'www.facebook.com',
                path: "/groups/membership_criteria_answer/save/?group_id="+ groupId + "&dpr=1" +   encodeURI(buffCustomQuestions.toString('utf8')),
                method: 'POST',
                headers: {'Cookie':  cookie,
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'user-agent' : userAgent
                }
    };
   // console.log('[Join2GroupAnswer] options:', options )
    var request =  https.request(options, (resp) => {
          var data = '';
         
          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            data += chunk;
          });
         
          // The whole response has been received. Print out the result.
          resp.on('end', () => {
           // console.log('end' + data);
           res.json({msg : 'OK'})
          });
     
    }).on("error", (err) => {
      console.log("Error: " + err.message);
      res.json({err : err});
    });
    // console.log('[Join2GroupAnswer] params', params );
    request.write(encodeURI(buffParams.toString('utf8')));
    request.end();

});

module.exports = router;
