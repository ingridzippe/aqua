console.log("wtf")
// alert(document.domain);

var url = chrome.extension.getURL('toolbar.html');

var height = '35px';
// var iframe = "<iframe src='"+url"' id='theAquaButtonInsert33178' style='height:"+height"'></iframe>";

var iframe = "<div src='"+url+"' id='aqua33178'></div>";

$('body').append(iframe);

document.getElementById("aqua33178").onclick = function() {
  console.log('onclick')
  var domain = document.domain;
  var url = window.location.href;
  recordDomainAndUrl(domain, url);
};

function recordDomainAndUrl(domain, url) {
  console.log('rdu')
  var xhr = new XMLHttpRequest();
  var httpUrl = "http://localhost:3000/post/content";
  xhr.open('POST', httpUrl, true);
  params = 'domain='+domain+'&url='+url;
  xhr.open('POST', httpUrl, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
      console.log(this.responseText);
  };
  // xhr.onreadystatechange = function() {
  // if (xhr.readyState == 4 && xhr.status == 200) {
  //     console.log("6")
  //     //return stuff
  // } else {
  //     console.log("7")
  //     //return stuff
  // }
  xhr.send(params);
  // };
}

  // const params = {
  //   domain: domain,
  //   url: url
  // };
  // const path = "/post/content";
  //
  // // send the text from the requestBubble to the backend
  // $.post(path, params, responseJSON => {
  //   // parse and display the results
  //   console.log("responseJSON ", responseJSON)
  //   const responseObject = JSON.parse(responseJSON);
  //   // console.log(responseObject);
  //   // updateJsonTrackResultsDict(responseObject.results)
  //   // displayResultsDict();
  // })
