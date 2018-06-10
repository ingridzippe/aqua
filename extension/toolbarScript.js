console.log("hm");

alert(document.domain);

var url = chrome.extension.getURL('toolbar.html');

var height = '35px';
var iframe = "<iframe src='"+url"' id='theAquaButtonInsert33178' style='height:"+height"'></iframe>";

$('body').append(iframe);