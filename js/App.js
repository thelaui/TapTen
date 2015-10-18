if (!window.TapTen) { window.TapTen = new Object();}

TapTen.App = function() {

  this.hexagons = [];
  this.score = 0;
  this.currentHighScore = 0;
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
        var negativeChance = TapTen.random(1, 100);

        if (negativeChance <= TapTen.NEGATIVE_NUMBER_CHANCE_LEVEL) {
          availableHexagons[randomId].activate(-5, false);
        } else {
          availableHexagons[randomId].activate(1, false);
        }
      } else {
        this.stop();
        break;
      }
    }
  }

  this.spawnHexagonText = function(textID) {
    var totalHexagonNum = this.hexagons.length;
    for (var hex = 0; hex < totalHexagonNum; ++hex) {
      $(this.hexagons[hex].text).html(TapTen.LOCALES[TapTen.LANGUAGE][textID][hex]);
    }
  }

  this.spawnSocialButtons = function(facebookPos, googlePos, twitterPos) {
    $(this.hexagons[facebookPos].hexTop).addClass("hex-facebook-top");
    $(this.hexagons[facebookPos].hexMiddle).addClass("hex-facebook-middle");
    $(this.hexagons[facebookPos].hexBottom).addClass("hex-facebook-bottom");

    var facebookIcon = document.createElement("div");
    $(facebookIcon).addClass("fa fa-facebook");
    $(this.hexagons[facebookPos].hexMiddle).append(facebookIcon);

    $(this.hexagons[facebookPos].hex).click(function(){
      FB.ui({
        method: 'share',
        href: 'thelaui.github.io/TapTen',
      }, function(response){});
    });
    $(this.hexagons[googlePos].hexTop).addClass("hex-google-top");
    $(this.hexagons[googlePos].hexMiddle).addClass("hex-google-middle");
    $(this.hexagons[googlePos].hexBottom).addClass("hex-google-bottom");

    var googleIcon = document.createElement("div");
    $(googleIcon).addClass("fa fa-google-plus");
    $(this.hexagons[googlePos].hexMiddle).append(googleIcon);

    $(this.hexagons[googlePos].hex).click(function(){
      TapTen.socialPopup("google");
      return false;
    });

    $(this.hexagons[twitterPos].hexTop).addClass("hex-twitter-top");
    $(this.hexagons[twitterPos].hexMiddle).addClass("hex-twitter-middle");
    $(this.hexagons[twitterPos].hexBottom).addClass("hex-twitter-bottom");

    $(this.hexagons[twitterPos].hex).click(function(){
      TapTen.socialPopup("twitter");
      return false;
    });

    var twitterIcon = document.createElement("div");
    $(twitterIcon).addClass("fa fa-twitter");
    $(this.hexagons[twitterPos].hexMiddle).append(twitterIcon);
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

    // set languages
    $("#score-text").text(TapTen.LOCALES[TapTen.LANGUAGE]["SCORE_TEXT"]);
    $("#highscore-text").text(TapTen.LOCALES[TapTen.LANGUAGE]["FORMER_BEST_TEXT"]);
    $("#countdown-hexagons").text(TapTen.LOCALES[TapTen.LANGUAGE]["COUNTDOWN_HEXAGONS"]);
    $("#countdown-seconds").text(TapTen.LOCALES[TapTen.LANGUAGE]["COUNTDOWN_SECONDS"]);

    $("#score-container").show();
    $("#score-container").removeClass("new-high-score");
    $("#countdown-container").show();
    $("#highscore-container").hide();
    $("#language-container").hide();
    $("#score-number").text(TapTen.pad(this.score, 7));

    var self = this;
    this.updateHexagons();

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

    $("#highscore-number").text(TapTen.pad(this.currentHighScore, 7));

    if (this.score > this.currentHighScore) {
      this.currentHighScore = this.score;
      $("#score-text").text(TapTen.LOCALES[TapTen.LANGUAGE]["NEW_HIGHSCORE_TEXT"]);
      $("#score-container").addClass("new-high-score");
      TapTen.setCookie("highscore", this.currentHighScore, 100);
    }

    this.showEnd();
  }

  this.showStart = function() {
    $("#score-container").hide();
    $("#highscore-container").hide();
    $("#countdown-container").hide();
    $("#language-container").show();

    this.despawnHexagons();
    this.spawnHexagons();

    this.spawnHexagonText("HEXAGON_START_TEXTS");

    this.spawnSocialButtons(19, 20, 21);

    $(this.hexagons[2].text).addClass("hex-title");

    $(this.hexagons[11].hexTop).addClass("hex-start-top");
    $(this.hexagons[11].hexMiddle).addClass("hex-start-middle");
    $(this.hexagons[11].hexBottom).addClass("hex-start-bottom");

    $(this.hexagons[15].hexTop).addClass("hex-howto-top");
    $(this.hexagons[15].hexMiddle).addClass("hex-howto-middle");
    $(this.hexagons[15].hexBottom).addClass("hex-howto-bottom");

    $(this.hexagons[16].hexTop).addClass("hex-neutral-top");
    $(this.hexagons[16].hexMiddle).addClass("hex-neutral-middle");
    $(this.hexagons[16].hexBottom).addClass("hex-neutral-bottom");

    var self = this;
    $(this.hexagons[15].hex).click( function() {
      self.showHowTo(0);
    });

    $(this.hexagons[16].hex).click( function() {
      self.showAbout();
    });

    $(this.hexagons[11].hex).click( function() {
      self.despawnHexagons();
      self.spawnHexagons();
      self.run();
    });
  }

  this.showAbout = function() {
    $("#score-container").hide();
    $("#countdown-container").hide();
    $("#language-container").hide();

    this.despawnHexagons();
    this.spawnHexagons();

    this.spawnHexagonText("HEXAGON_ABOUT_TEXTS");

    $(this.hexagons[2].text).addClass("hex-title");

    $(this.hexagons[20].hexTop).addClass("hex-neutral-top");
    $(this.hexagons[20].hexMiddle).addClass("hex-neutral-middle");
    $(this.hexagons[20].hexBottom).addClass("hex-neutral-bottom");

    var self = this;
    $(this.hexagons[20].hex).click( function() {
      self.showStart();
    });

  }

  this.showHowTo = function(stageId) {
    $("#score-container").hide();
    $("#highscore-container").hide();
    $("#countdown-container").hide();
    $("#language-container").hide();

    this.despawnHexagons();
    this.spawnHexagons();

    this.spawnHexagonText("HEXAGON_HOWTO_TEXTS_" + stageId);

    $(this.hexagons[2].text).addClass("hex-title");

    var windowTimeoutId = -1;
    var randomFillIntervalId = -1;
    var self = this;

    // activate stage specific stuff
    if (stageId == 0) {
      windowTimeoutId =
      window.setTimeout(function() {
        self.hexagons[11].activate(1, true);
      }
      , 2000);
    } else if (stageId == 1) {
      this.hexagons[11].activate(1, true);
      this.score = 0;
      $("#score-number").text(TapTen.pad(this.score, 7));
      $("#score-container").show();
    } else if (stageId == 2) {
      this.hexagons[11].activate(10, false);
    } else if (stageId == 3) {
      windowTimeoutId =
      window.setTimeout(function() {
        self.hexagons[11].activate(-5, false);
      }
      , 2000);
    } else if (stageId == 4) {
      // begin to randomly fill the field with hexagons after 5 seconds
      windowTimeoutId =
      window.setTimeout(function() {
        randomFillIntervalId =
        window.setInterval(function() {
          var totalHexagonNum = self.hexagons.length;

          for (var elem = 0; elem < 5; ++elem) {
            var availableHexagons = [];

            for (var i = 0; i < totalHexagonNum; ++i) {
              var currentHex = self.hexagons[i];
              if (!currentHex.active && i!=2 && i != 19 && i != 21) {
                availableHexagons.push(currentHex);
              }
            }

            var availableHexagonNum = availableHexagons.length;
            if (availableHexagonNum >= self.hexagonsToBeSelected - elem) {
              var randomId = TapTen.random(0, availableHexagonNum - 1);

              availableHexagons[randomId].activate(1, false);
              $(availableHexagons[randomId].text).html("");
            }
          }
        }
        , 1000);
      }
      , 5000);
    } else if (stageId == 5) {
      this.spawnSocialButtons(10, 11, 12);
    }


    // set buttons and their actions
    $(this.hexagons[19].hexTop).addClass("hex-neutral-top");
    $(this.hexagons[19].hexMiddle).addClass("hex-neutral-middle");
    $(this.hexagons[19].hexBottom).addClass("hex-neutral-bottom");

    $(this.hexagons[21].hexTop).addClass("hex-neutral-top");
    $(this.hexagons[21].hexMiddle).addClass("hex-neutral-middle");
    $(this.hexagons[21].hexBottom).addClass("hex-neutral-bottom");

    function clearWindowCallbacks() {
      if (randomFillIntervalId != -1) {
        window.clearInterval(randomFillIntervalId);
      }

      if (windowTimeoutId != -1) {
        window.clearTimeout(windowTimeoutId);
      }
    }

    if (stageId == 0) {
      $(this.hexagons[19].hex).click(function() {
        clearWindowCallbacks();
        self.showStart();
      });
    } else {
      $(this.hexagons[19].hex).click(function() {
        clearWindowCallbacks();
        self.showHowTo(stageId - 1);
      });
    }

    if (stageId == 5) {
      $(this.hexagons[21].hex).click(function() {
        clearWindowCallbacks();
        self.showStart();
      });

      $(self.hexagons[20].hexTop).addClass("hex-start-top");
      $(self.hexagons[20].hexMiddle).addClass("hex-start-middle");
      $(self.hexagons[20].hexBottom).addClass("hex-start-bottom");

      $(this.hexagons[20].hex).click(function() {
        clearWindowCallbacks();
        self.despawnHexagons();
        self.spawnHexagons();
        self.run();
      });
    } else {
      $(this.hexagons[21].hex).click(function() {
        clearWindowCallbacks();
        self.showHowTo(stageId + 1);
      });
    }

  }

  this.showEnd = function() {
    $("#countdown-container").hide();
    $("#language-container").hide();
    $("#highscore-container").show();

    this.despawnHexagons();
    this.spawnHexagons();

    // first, show time up texts
    this.spawnHexagonText("HEXAGON_TIME_UP_TEXTS");

    var self = this;
    // after some time, show replay/share screen
    window.setTimeout(function() {
      self.spawnHexagonText("HEXAGON_END_TEXTS");

      $(self.hexagons[1].text).addClass("hex-title");
      $(self.hexagons[2].text).addClass("hex-title");
      $(self.hexagons[3].text).addClass("hex-title");

      $(self.hexagons[19].hexTop).addClass("hex-end-top");
      $(self.hexagons[19].hexMiddle).addClass("hex-end-middle");
      $(self.hexagons[19].hexBottom).addClass("hex-end-bottom");

      $(self.hexagons[19].hex).click( function() {
        self.showStart();
      });

      $(self.hexagons[21].hexTop).addClass("hex-start-top");
      $(self.hexagons[21].hexMiddle).addClass("hex-start-middle");
      $(self.hexagons[21].hexBottom).addClass("hex-start-bottom");

      $(self.hexagons[21].hex).click( function() {
        self.despawnHexagons();
        self.spawnHexagons();
        self.run();
      });

      self.spawnSocialButtons(10, 11, 12);
    }, 2000);

  }

  // connect language buttons
  var self = this;
  $("#flag-en").click(function() {
    TapTen.LANGUAGE = "en";
    self.showStart();
  });

  $("#flag-de").click(function() {
    TapTen.LANGUAGE = "de";
    self.showStart();
  });

  // get previous high score if possible
  var highScore = TapTen.getCookie("highscore");
  if (highScore != "") {
    this.currentHighScore = parseInt(highScore);
  }

  this.showStart();
}

