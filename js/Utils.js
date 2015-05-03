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

