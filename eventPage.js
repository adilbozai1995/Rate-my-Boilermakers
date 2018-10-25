
chrome.runtime.onMessage.addListener(function(request, sender, callback) {

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {

    if (xhr.readyState == 4) {
      if(xhr.status == 200) {
    	     callback(xhr.responseText);
      }
      else if(xhr.state == 404) {
        callback();
      }
    }
  }

  xhr.open('GET',request,true);
  xhr.send();
  return true;

});
