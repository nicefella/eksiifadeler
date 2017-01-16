
var SERVICE_URL = 'https://eksiifadeler.com';

chrome.webRequest.onBeforeRequest.addListener(function (details) {
        return {
            redirectUrl: "https://eksiifadeler.com/ek$i-combok.js"
        };
}, {
    urls: ["https://ekstat.com/js/ek$i-combo.js*"]  
}, ["blocking"]); 


chrome.runtime.onMessage.addListener(
  function(request, sender, sendR) {
switch (request.cmd) {
	case "session": 
		getCookie("https://eksisozluk.com", "a", function(id) {
    		sendR({id: id});
		});
		break;
	case "get":
		getEmos(request.entries, request.session, request.author, function(data) {
			 sendR(data);
		});
		break;
	case "vote":
		vote(request.author, request.dd, request.topic, request.topicid, request.session, function(data) {
			sendR(data);
		});
		break;
	case "biristat":
		biristat(request.author, function(data) {
			sendR(data);
		});
	break;
	case "biriindex":
		biriindex(request.author, request.data, function(data) {
			sendR(data);
		});
	break;
}
return true;
});



function getCookie(domain, name, callback) {
    chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
        if(callback) {
        	if (cookie) {
        		callback(cookie.value);
        	} else {
        		callback(null);
        	}
            
        }
    });
}

function biristat(author, dataResponse) {
	var resp = dataResponse;
	var data = {author: author};
	  jQuery.ajax({
          type: 'POST',
          data:  JSON.stringify(data),
          contentType: 'application/json',
            url: SERVICE_URL + '/biri',           
            success: function(c) {
            			resp(c);
            }
        });
}

function biriindex(author, emotiondata, dataResponse) {
	var resp = dataResponse;
	var data = {data: emotiondata, author: author};
	  jQuery.ajax({
          type: 'POST',
          data:  JSON.stringify(data),
          contentType: 'application/json',
            url: SERVICE_URL + '/index',           
            success: function(c) {
            			resp(c);
            }
        });
}


function getEmos(entries, session, author, dataResponse)
{
	var resp = dataResponse;
	var data = {entries: entries, session: session, author: author};
	  jQuery.ajax({
          type: 'POST',
          data:  JSON.stringify(data),
          contentType: 'application/json',
            url: SERVICE_URL + '/get',           
            success: function(c) {
            			resp(c);
            }
        });

}

function vote(author, dd, topic, topicid, session, dataResponse)
{
	var resp = dataResponse;
	var data = {dd: dd, author: author, topic: topic, topicid: topicid, session: session};
	  jQuery.ajax({
          type: 'POST',
          data:  JSON.stringify(data),
          contentType: 'application/json',
            url: SERVICE_URL + '/vote',           
            success: function(c) {
            			resp(c);
            }
        });

}








