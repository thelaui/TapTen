if (!window.TapTen) { window.TapTen = new Object();}

TapTen.LAST_HEXAGON_ID = 0;

TapTen.Hexagon = function(parentDiv, app) {

  this.id = TapTen.LAST_HEXAGON_ID++;
  this.app = app;
  this.currentCount = 1;
  this.active = false;
  this.isUndying = false;
  this.counterIntervalId = 0;
  this.counterResetTimeoutlId = 0;

  this.hex = document.createElement("div");
  $(this.hex).addClass("hex noselect");
  $(this.hex).attr("id", "hex-" + this.id);

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

  this.text = document.createElement("div");
  $(this.text).addClass();
  $(this.hexMiddle).append(this.text);

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
      if (self.currentCount >= 0) {
        self.app.increaseScore();
      }
      if (self.currentCount == 0) {
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
      if (self.currentCount == 0) {
        self.deactivate();
      } else {
        self.updateStyle(false);
      }
    }, TapTen.COUNTER_INCREASE_INTERVAL);
  };

  this.updateStyle = function(justClear) {
    $(self.counter).text(self.currentCount);
    $(self.hexTop).removeClass("hex-top-diff1")
    $(self.hexTop).removeClass("hex-top-diff2")
    $(self.hexTop).removeClass("hex-top-diff3")
    $(self.hexTop).removeClass("hex-top-negative")
    $(self.hexMiddle).removeClass("hex-middle-diff1")
    $(self.hexMiddle).removeClass("hex-middle-diff2")
    $(self.hexMiddle).removeClass("hex-middle-diff3")
    $(self.hexMiddle).removeClass("hex-middle-negative")
    $(self.hexBottom).removeClass("hex-bottom-diff1")
    $(self.hexBottom).removeClass("hex-bottom-diff2")
    $(self.hexBottom).removeClass("hex-bottom-diff3")
    $(self.hexBottom).removeClass("hex-bottom-negative")

    $(self.counter).removeClass("counter-negative")

    if (!justClear) {

      var difficultyRatio = self.currentCount / TapTen.MAX_COUNTER_VALUE;

      if (difficultyRatio < 0) {
        $(self.hexTop).addClass("hex-top-negative");
        $(self.hexMiddle).addClass("hex-middle-negative");
        $(self.hexBottom).addClass("hex-bottom-negative");
        $(self.counter).addClass("counter-negative")
      } else if (difficultyRatio <= 0.4) {
        $(self.hexTop).addClass("hex-top-diff1");
        $(self.hexMiddle).addClass("hex-middle-diff1");
        $(self.hexBottom).addClass("hex-bottom-diff1");
      } else if (difficultyRatio <= 0.8) {
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

  this.activate = function(counterValue, isUndying) {
    this.active = true;
    this.isUndying = isUndying;
    this.currentCount = counterValue;
    $(this.counter).show();
    this.updateStyle(false);
    this.startCounter();
  };

  this.deactivate = function() {
    this.currentCount = 1;
    this.updateStyle(true);
    $(this.counter).hide();
    this.active = false;
    window.clearInterval(this.counterIntervalId);
    window.clearTimeout(this.counterResetTimeoutlId);

    if (this.isUndying) {
      var self = this;
      window.setTimeout(function() {
        self.activate(1, true);
      }
      , 1000);
    }

  };


}

