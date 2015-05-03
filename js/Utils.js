if (!window.TapTen) { window.TapTen = new Object();}

TapTen.random = function(min, max) {
  return Math.floor(Math.random() * (max-min)) + min;
}



