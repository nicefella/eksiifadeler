(function($, d){

var $authorLink = $(document.getElementById("user-profile-title")),   
 	$targetCard = $(document.getElementById("profile-cards")),
	AUTHOR = $authorLink.data("nick"),
	titles =["Eğlenceli", "Harika tespit", "Bilgilendirici", "Ufkum 2x", "Troll", "Çöp"];


	chrome.runtime.sendMessage({cmd: "biristat", author: AUTHOR}, function(biridata) {	
					appendEmotionCard(biridata[0]);
    	});


function appendEmotionCard(data) {
	var li = $("<li/>").appendTo($targetCard),		
		title = $("<h3/>").html("ekşi ifadeleri").appendTo(li),
		ul = $("<ul/>").appendTo(li);


	for (var property in data) {  
		var type = property.split('_')[1], value = data[property];
			    if (data.hasOwnProperty(property)) {		    	
			        if (property.substring(0,2) == "e_" &&  type != "0" &&   value > 0)  {
			        		var innerli = $("<li/>").appendTo(ul),
			        			a = $("<a/>")
			        			.addClass("emotion-link")
			        			.attr("href", "/ifadeler/" + AUTHOR + "/" + type)
			        			.html(titles[type - 1].toLowerCase() + " ")
			        			.appendTo(innerli);
			        			$("<span/>").html(value).appendTo(innerli);
			        }
			    }
	}

	if (typeof(data) === "undefined") {$("<li/>").html("Henüz ifadesi yok").appendTo(ul);}
}

function putIndex(data) {
var $index = $('#partial-index').empty(), 
	$divtitle = $("<div/>").addClass("clearfix dropdown").appendTo($index),
	$time = + new Date(),
	$h2 = $("<h2/>").attr('title', data.entries.length + ' başlık').html("'s " + data.indextitle).appendTo($divtitle),
	$author = $("<a/>").attr('href', '/biri/' + data.authorlink).html(data.author).prependTo($h2),
	$emoicon = $("<span/>").addClass("emotion-icon-static emotion-icon-style_1 emotion-icon-style_2").prependTo($h2),
	$icon = $("<i/>").addClass("emotion-icon-style_4 emotion-icon-style_5").addClass("emotion-icon_" + data.emotionid).appendTo($emoicon),
	$ul = $("<ul/>").addClass('topic-list partial').data('timestamp', $time).appendTo($index);


	$.each(data.entries, function(index, el){
		var innerli = $("<li/>").appendTo($ul),
			innera = $("<a/>").appendTo(innerli)
			.attr('href', '/entry/' + el.entryid)
			.attr('draggable', true).html(el.topic + " ");
			$("<span/>").addClass("detail with-parentheses").html('#'+el.entryid).appendTo(innera);
	});
	refreshLocalStorage($time, $index);
}

function refreshLocalStorage(time, indexdiv) {
	var local = {"timestamp": time, "content" : null};
	local.content = $(indexdiv).html();
	localStorage.setItem("indexStateV2", JSON.stringify(local));
}

$(d).on('click', '.emotion-link', function(e) {
	e.preventDefault();
	var data = $(this).attr("href");
	chrome.runtime.sendMessage({cmd: "biriindex", data: data, author: AUTHOR}, function(indexdata) {
				putIndex(indexdata);
    	});
});

})(jQuery, document);

