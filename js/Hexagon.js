if (!window.TapTen) { window.TapTen = new Object();}

TapTen.LAST_HEXAGON_ID = 0;

TapTen.Hexagon = function(parentDiv, app) {

  this.id = TapTen.LAST_HEXAGON_ID++;
  this.app = app;
  this.currentCount = 1;
  this.active = false;
  this.counterIntervalId = 0;
  this.counterResetTimeoutlId = 0;

  this.hex = document.createElement("div");
  $(this.hex).addClass("hex noselect");
  $(this.hex).attr("id", "hex_" + this.id);

  this.hexTop = document.createElement("div");
  $(this.hexTop).addClass("top");
  $(this.hex).append(this.hexTop);

  this.hexMiddle = document.createElement("div");
  $(this.hexMiddle).addClass("middle");
  $(this.hex).append(this.hexMiddle);

  this.counter = document.createElement("div");
  $(this.counter).addClass("counter");
  $(this.counter).text(this.currentCount);
  $(this.hexMiddle).append(this.counter);
  $(this.counter).hide();

  this.hexBottom = document.createElement("div");
  $(this.hexBottom).addClass("bottom");
  $(this.hex).append(this.hexBottom);

  $(parentDiv).append(this.hex);

  var self = this;
  $(this.hex).click(function() {
    if (self.active) {
      --self.currentCount;
      self.updateStyle(false);
      window.clearInterval(self.counterIntervalId);
      window.clearTimeout(self.counterResetTimeoutlId);

      if (self.currentCount <= 0) {
        self.deactivate();
      } else {
        self.counterResetTimeoutlId =
        window.setTimeout(function() {
          self.startCounter();
        }, TapTen.COUNTER_RESET_INTERVAL);
      }
    }
  });

  this.startCounter = function() {
    this.counterIntervalId =
    window.setInterval(function() {
      self.currentCount = Math.min(self.currentCount + 1, TapTen.MAX_COUNTER_VALUE);
      self.updateStyle(false);
    }, TapTen.COUNTER_INCREASE_INTERVAL);
  };

  this.updateStyle = function(justClear) {
    $(self.counter).text(self.currentCount);
    $(self.hexTop).removeClass("hex-top-diff1")
    $(self.hexTop).removeClass("hex-top-diff2")
    $(self.hexTop).removeClass("hex-top-diff3")
    $(self.hexMiddle).removeClass("hex-middle-diff1")
    $(self.hexMiddle).removeClass("hex-middle-diff2")
    $(self.hexMiddle).removeClass("hex-middle-diff3")
    $(self.hexBottom).removeClass("hex-bottom-diff1")
    $(self.hexBottom).removeClass("hex-bottom-diff2")
    $(self.hexBottom).removeClass("hex-bottom-diff3")

    if (!justClear) {
      var difficultyRatio = self.currentCount / TapTen.MAX_COUNTER_VALUE;

      if (difficultyRatio <= 0.333) {
        $(self.hexTop).addClass("hex-top-diff1");
        $(self.hexMiddle).addClass("hex-middle-diff1");
        $(self.hexBottom).addClass("hex-bottom-diff1");
      } else if (difficultyRatio <= 0.666) {
        $(self.hexTop).addClass("hex-top-diff2");
        $(self.hexMiddle).addClass("hex-middle-diff2");
        $(self.hexBottom).addClass("hex-bottom-diff2");
      } else {
        $(self.hexTop).addClass("hex-top-diff3");
        $(self.hexMiddle).addClass("hex-middle-diff3");
        $(self.hexBottom).addClass("hex-bottom-diff3");
      }
    }

  };

  this.activate = function(counterValue) {
    this.active = true;
    this.currentCount = counterValue;
    $(this.counter).show();
    this.updateStyle();
    this.startCounter();
  };

  this.deactivate = function() {
    this.active = false;
    this.currentCount = 1;
    this.app.increaseScore();
    this.updateStyle(true);
    $(this.counter).hide();
  };


}

