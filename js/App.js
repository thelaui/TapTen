if (!window.TapTen) { window.TapTen = new Object();}

TapTen.App = function() {

  this.hexagons = [];
  this.score = 0;
  this.hexagonsToBeSelected = TapTen.START_HEXAGON_AMOUNT;
  this.currentDifficulty = 0;
  this.difficultyTicker = 0;
  this.updateCount = 0;
  this.recentlyUpdated = false;
  this.mainIntervalId = 0;

  this.spawnHexagons = function() {
    var numCols = 5;
    var numRows = 5;
    var evenRowNum = Math.floor(numRows/2);
    this.hexagons = new Array(numCols * numRows - evenRowNum);

    var rowOffset = 0;
    for(var y=0; y<numRows; ++y) {
      var row = document.createElement("div");
      $(row).addClass("hex-row");

      var cols = numCols;

      if (y%2 == 1) {
        $(row).addClass("even");
        cols -=1;
      }


      for(var x=0; x<cols; ++x) {
        var hex = new TapTen.Hexagon(row, this);

        this.hexagons[rowOffset + x] = hex;
      }
      $("#hex-container").append(row);
      rowOffset += cols;
    }
  };

  this.despawnHexagons = function() {
    var totalHexagonNum = this.hexagons.length;

    for (var hex = 0; hex < totalHexagonNum; ++hex) {
      $(this.hexagons[hex].hex).remove();
    }
  };

  this.updateHexagons = function() {

    var totalHexagonNum = this.hexagons.length;

    for (var elem = 0; elem < this.hexagonsToBeSelected; ++elem) {
      var availableHexagons = [];

      for (var i = 0; i < totalHexagonNum; ++i) {
        var currentHex = this.hexagons[i];
        if (!currentHex.active) {
          availableHexagons.push(currentHex);
        }
      }

      var availableHexagonNum = availableHexagons.length;
      if (availableHexagonNum >= this.hexagonsToBeSelected - elem) {
        var randomId = TapTen.random(0, availableHexagonNum - 1);
        var counterValue = TapTen.random(TapTen.SPAWN_COUNTER_MIN_VALUE,
                                         TapTen.SPAWN_COUNTER_MAX_VALUE);

        availableHexagons[randomId].activate(counterValue);
      } else {
        this.stop();
        break;
      }
    }
  }

  this.increaseScore = function() {
    this.score += this.currentDifficulty + 1;

    $("#score-number").text(TapTen.pad(this.score, 7));

    this.difficultyTicker += 1;
    if (this.difficultyTicker >= 30 * (this.currentDifficulty + 1)) {
      this.difficultyTicker = 0;
      this.increaseDifficulty();
    }
  }

  this.increaseDifficulty = function() {
    this.currentDifficulty = Math.min(this.currentDifficulty + 1,
                                      TapTen.MAX_DIFFICULTY)
    this.hexagonsToBeSelected = Math.min(this.hexagonsToBeSelected + 1,
                                         23);
  }

  this.run = function() {
    this.score = 0;
    this.hexagonsToBeSelected = TapTen.START_HEXAGON_AMOUNT;
    this.currentDifficulty = 0;
    this.difficultyTicker = 0;
    this.updateCount = 0;
    this.recentlyUpdated = false;

    $("#score-container").show();
    $("#countdown-container").show();
    $("#score-number").text(TapTen.pad(this.score, 7));

    this.updateHexagons();

    var self = this;
    $("#countdown-number").text(TapTen.SPAWN_INTERVAL / 1000 - self.updateCount);
    $("#countdown-amount").text(self.hexagonsToBeSelected);

    this.mainIntervalId =
    window.setInterval( function() {

      if (!self.recentlyUpdated) {
        ++self.updateCount;

        if (self.updateCount * 1000 == TapTen.SPAWN_INTERVAL) {
          self.updateHexagons();
          self.recentlyUpdated = true;
        }

      } else {
        self.recentlyUpdated = false;
        self.updateCount = 0;
      }

      $("#countdown-amount").text(self.hexagonsToBeSelected);
      $("#countdown-number").text(TapTen.SPAWN_INTERVAL / 1000 - self.updateCount);

    }, 1000);
  }

  this.stop = function() {
    window.clearInterval(this.mainIntervalId);

    var totalHexagonNum = this.hexagons.length;
    for (var hex = 0; hex < totalHexagonNum; ++hex) {
      this.hexagons[hex].deactivate();
    }
    this.showEnd();
  }

  this.showStart = function() {
    $("#score-container").hide();
    $("#countdown-container").hide();

    this.despawnHexagons();
    this.spawnHexagons();

    var totalHexagonNum = this.hexagons.length;
    for (var hex = 0; hex < totalHexagonNum; ++hex) {
      $(this.hexagons[hex].hexMiddle).text(TapTen.HEXAGON_START_TEXTS[hex]);
    }

    // $(this.hexagons[1].hexMiddle).addClass("hex-flag-en-middle");
    $(this.hexagons[2].hexMiddle).addClass("hex-title");
    $(this.hexagons[11].hexTop).addClass("hex-start-top");
    $(this.hexagons[11].hexMiddle).addClass("hex-start-middle");
    $(this.hexagons[11].hexBottom).addClass("hex-start-bottom");

    var self = this;
    $(this.hexagons[11].hex).click( function() {
      self.despawnHexagons();
      self.spawnHexagons();
      self.run();
    });
  }

  this.showEnd = function() {
    $("#countdown-container").hide();

    this.despawnHexagons();
    this.spawnHexagons();

    // first, show time up texts
    var totalHexagonNum = this.hexagons.length;
    for (var hex = 0; hex < totalHexagonNum; ++hex) {
      $(this.hexagons[hex].hexMiddle).text(TapTen.HEXAGON_TIME_UP_TEXTS[hex]);
    }

    var self = this;
    // after some time, show replay/share screen
    window.setTimeout(function() {
      console.log(self);
      for (var hex = 0; hex < totalHexagonNum; ++hex) {
        $(self.hexagons[hex].hexMiddle).text(TapTen.HEXAGON_END_TEXTS[hex]);
      }

      $(self.hexagons[1].hexMiddle).addClass("hex-title");
      $(self.hexagons[2].hexMiddle).addClass("hex-title");
      $(self.hexagons[3].hexMiddle).addClass("hex-title");

      $(self.hexagons[19].hexTop).addClass("hex-end-top");
      $(self.hexagons[19].hexMiddle).addClass("hex-end-middle");
      $(self.hexagons[19].hexBottom).addClass("hex-end-bottom");

      $(self.hexagons[21].hexTop).addClass("hex-start-top");
      $(self.hexagons[21].hexMiddle).addClass("hex-start-middle");
      $(self.hexagons[21].hexBottom).addClass("hex-start-bottom");

      $(self.hexagons[10].hexTop).addClass("hex-facebook-top");
      $(self.hexagons[10].hexMiddle).addClass("hex-facebook-middle");
      $(self.hexagons[10].hexBottom).addClass("hex-facebook-bottom");

      var facebookIcon = document.createElement("div");
      $(facebookIcon).addClass("fa fa-facebook");
      $(self.hexagons[10].hexMiddle).append(facebookIcon);

      $(self.hexagons[10].hex).click(function(){
        FB.ui({
          method: 'share',
          href: 'thelaui.github.io/TapTen',
        }, function(response){});
      });
      $(self.hexagons[11].hexTop).addClass("hex-google-top");
      $(self.hexagons[11].hexMiddle).addClass("hex-google-middle");
      $(self.hexagons[11].hexBottom).addClass("hex-google-bottom");

      var googleIcon = document.createElement("div");
      $(googleIcon).addClass("fa fa-google-plus");
      $(self.hexagons[11].hexMiddle).append(googleIcon);

      $(self.hexagons[11].hex).click(function(){
        TapTen.socialPopup("google");
        return false;
      });

      $(self.hexagons[12].hexTop).addClass("hex-twitter-top");
      $(self.hexagons[12].hexMiddle).addClass("hex-twitter-middle");
      $(self.hexagons[12].hexBottom).addClass("hex-twitter-bottom");

      $(self.hexagons[12].hex).click(function(){
        TapTen.socialPopup("twitter");
        return false;
      });

      var twitterIcon = document.createElement("div");
      $(twitterIcon).addClass("fa fa-twitter");
      $(self.hexagons[12].hexMiddle).append(twitterIcon);

      $(self.hexagons[19].hex).click( function() {
        self.showStart();
      });

      $(self.hexagons[21].hex).click( function() {
        self.despawnHexagons();
        self.spawnHexagons();
        self.run();
      });
    }, 2000);

  }

  this.showStart();
}

