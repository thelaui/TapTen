if (!window.TapTen) { window.TapTen = new Object();}

TapTen.random = function(min, max) {
  return Math.floor(Math.random() * (max-min)) + min;
}

TapTen.pad = function(number, charNum) {
  return (
    1e15 + number + // combine with large number
    "" // convert to string
  ).slice(-charNum) // cut leading "1"
}

TapTen.socialPopup = function(mode) {
  var url = mode == "google"
    ? "https://plus.google.com/share?url=thelaui.github.io/TapTen"
    : mode == "twitter" ? "http://twitter.com/share"
    : "";

  var width  = $(window).width() >= 600 ? 600 : 300,
           height = $(window).height() >= 600 ? 600 : 300,
           left   = ($(window).width()  - width)  / 2,
           top    = ($(window).height() - height) / 2,
           opts   = 'status=1' +
                    ',menubar=no' +
                    ',toolbar=no' +
                    ',resizable=yes' +
                    ',scrollbars=yes' +
                    ',width='  + width  +
                    ',height=' + height +
                    ',top='    + top    +
                    ',left='   + left;

  window.open(url, '', opts);

}

TapTen.setCookie = function(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

TapTen.getCookie = function(cname) {
  var name = cname + "=";
  var cookieArray = document.cookie.split(';');
  var cookieNum = cookieArray.length;
  for (var i = 0; i < cookieNum; ++i) {
    var currentCookie = cookieArray[i];
    while(currentCookie.charAt(0) == ' ') {
      currentCookie = currentCookie.substring(1);
    }
    if (currentCookie.indexOf(name) == 0) {
      return currentCookie.substring(name.length, currentCookie.length);
    }
  }

  return ""
}

// point coordinates must be given in counter-clockwise order
TapTen.isPointInTriangle = function(pointX, pointY,
                                    triPoint0X, triPoint0Y,
                                    triPoint1X, triPoint1Y,
                                    triPoint2X, triPoint2Y) {

var area = 0.5 * (-triPoint1Y * triPoint2X +
                  triPoint0Y * (-triPoint1X + triPoint2X) +
                  triPoint0X * (triPoint1Y - triPoint2Y) +
                  triPoint1X * triPoint2Y);


var s = 1.0/(2.0 * area) * (triPoint0Y * triPoint2X - triPoint0X * triPoint2Y + (triPoint2Y - triPoint0Y) * pointX + (triPoint0X - triPoint2X) * pointY);
var t = 1.0/(2.0 * area) * (triPoint0X * triPoint1Y - triPoint0Y * triPoint1X + (triPoint0Y - triPoint1Y) * pointX + (triPoint1X - triPoint0X) * pointY);
var u = 1.0 - s - t;

return 0 <= s && s <= 1.0 && 0 <= t && t <= 1.0 && 0 <= u && u <= 1.0;

}
