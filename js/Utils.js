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

  console.log(url)
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
