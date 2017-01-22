(function($){

var ICON_BASE_URL = chrome.extension.getURL("icons/"), ICON_EXT = ".png", globaldata = [], SESSIONID = null, AUTHOR = null;
var $topNavigation = $(document.getElementById("top-navigation"));
var $topicid = $("#topic").find("h1").data("id");
var $topic = $("#topic").find("h1").data("title");
var $authorLink = $topNavigation.find("a[href*='/biri/']");
var titles =["Eğlenceli", "Harika tespit", "Bilgilendirici", "Ufkum 2x", "Troll", "Çöp", "Derdi öpülesi", "Sarsıcı", "Sinir bozucu", "Yalan yanlış"];
AUTHOR = $authorLink.attr("title");


// 0. check if session exists, if exists get sessionid
chrome.runtime.sendMessage({cmd: "session"}, function(cookie) {
	  if (cookie.id != null) {

	  	SESSIONID = cookie.id;

	  	var $entrywrapper = $("#entry-list"),
		 	$children = $entrywrapper.children("li"),
		 	entries = [];

		// 1. get entryid from dom
		$children.each(function($entryIndex, entryElement){
			var $entry = $(entryElement);
				var $entryid = $entry.attr("data-id");
				entries.push($entryid);
		});

		// 2. get entry emotion data for the entryid and session
		chrome.runtime.sendMessage({cmd: "get", entries: entries, session : cookie.id, author: AUTHOR}, function(emotionsdata) {
					// 3. append emotion-div into dom
					 globaldata = emotionsdata.slice();
					 renderEmos(entries, emotionsdata);
    	});
	  }


    });


function renderEmos(entries, data)  {
	entries.forEach(function(entry) {
		var $entry = $('li[data-id=' + entry + '] footer'),
			div = $("<div/>").addClass('entry-emotions').data("id", entry),
			innerdiv = $("<div/>").addClass("inner-emotions").data("id", entry).appendTo(div)
			;
			redraw(innerdiv, entry, data);
			$("<div/>").addClass("all-emotions").data("id", entry).appendTo(div);

			div.appendTo($entry);
	});
}


function find(entry, data) {
	for (var i = 0; i < data.length; i++) {
		if (data[i].entryid == entry) {
				return data[i];
		}
	}
	return false; 
}



function updateglobal(data) {
var x = -1;
for (var i = 0; i < globaldata.length; i++) {
		if (globaldata[i].entryid == data.entryid) {
				x = i;
		}
	}

	if (x !== -1) {
		globaldata.splice(x,1);
	}
	globaldata.push(data);
}


$(document).on('mouseenter', '#entry-list li', function(e){
	e.preventDefault();
	var ep = $(this).find('.all-emotions'), entryid = ep.data("id"), ispop = ep.is(':empty');
		emolist(ep, entryid).show();
		highlight(entryid, ep);
});


$(document).on('mouseleave', '#entry-list li', function(e){
	e.preventDefault();
	$(this).find('.all-emotions').hide();
	$(this).find(".inner-emotions").show();

});


$(document).on('click', '.emotion-node', function(e){
	e.preventDefault();
	var _this = $(this), dd = $(this).attr("href");


if (!$(_this).hasClass("emotion-stat-state")) {
	chrome.runtime.sendMessage({cmd: "vote", dd: dd, author: AUTHOR, topic: $topic, topicid: $topicid, session : SESSIONID}, function(data) {	
			updateglobal(data);
			redraw(_this.parent().parent().parent().parent().find(".inner-emotions"), dd.split('/')[2], [data]);			
    	});
		$(_this).parent().hide();
}
});


function highlight(entryid, element) {
	var currentdata = find(entryid, globaldata);
	if (currentdata) {
		var em = currentdata.emotionid;
		element.find('.emotion-icon_' + em).parent().css("opacity", 1.0);
	}
}



function redraw(innerdiv, entry, data) {
var targetdiv = innerdiv.empty(), edata = find(entry, data)	
			for (var property in edata) {
				   
			    if (edata.hasOwnProperty(property)) {		    	
			        if (property.substring(0,2) == "e_" && property.split('_')[1] != "0" && edata[property] > 0)  {
			        drawEmotion(targetdiv, property.split('_')[1], false, edata[property]);
			        }
			    }
			}

}


function drawEmotion(div, id, islink, value) {
	var span = $("<span/>").addClass("emotion-node").appendTo(div),
		emocontainer = $("<div/>").addClass("emotion-container").appendTo(span),
		emowrapper = $("<div/>").addClass("emotion-wrapper").appendTo(emocontainer),
		emoicon = $("<span/>").addClass("emotion-icon emotion-icon-style_1 emotion-icon-style_2")
		.appendTo(emowrapper);
		$("<i/>").addClass("emotion-icon-style_4 emotion-icon-style_5").addClass("emotion-icon_" + id).appendTo(emoicon);
	var emotitlewrapper = $("<div/>").addClass("emotion-title-wrapper").appendTo(emowrapper);
		$("<div/>").addClass("emotion-title-text").html(titles[id - 1]).appendTo(emotitlewrapper);
		
		if (islink) {
			span.attr("href", "vote/" + id + "/" + value);
		} else {
			span.addClass("emotion-stat-state");
			emoicon.addClass("emotion-icon-style_stat");
			$("<span/>").addClass("emotion-stats").html(value). appendTo(emowrapper);
		}
}

function emolist(div, entryid) {
	div.empty();
	for (var i = 1; i <= titles.length; i++) {
		drawEmotion(div, i, true, entryid);
	}
	return div;
}
})(jQuery);
