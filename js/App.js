if (!window.TapTen) { window.TapTen = new Object();}

TapTen.App = function() {

  this.hexagons = [];
  this.score = 0;
  this.currentDifficulty = 0;
  this.difficultyTicker = 0;

  this.spawnHexagons = function(numCols, numRows) {
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

  this.updateHexagons = function() {
    var elementsToBeSelected = 0;

    elementsToBeSelected = TapTen.SPAWN_COUNTS[this.currentDifficulty];

    var totalHexagonNum = this.hexagons.length;

    for (var elem = 0; elem < elementsToBeSelected; ++elem) {
      // number of hexagons with maximum value
      var availableHexagons = [];

      for (var i = 0; i < totalHexagonNum; ++i) {
        var currentHex = this.hexagons[i];
        if (!currentHex.active) {
          availableHexagons.push(currentHex);
        }
      }

      var availableHexagonNum = availableHexagons.length;
      if (availableHexagonNum > 0) {
        var randomId = TapTen.random(0, availableHexagonNum-1);
        var counterValue = TapTen.random(TapTen.SPAWN_COUNTER_MIN_VALUES[this.currentDifficulty],
                                     TapTen.SPAWN_COUNTER_MAX_VALUES[this.currentDifficulty]);

        availableHexagons[randomId].activate(counterValue);
      } else {
        console.log("You Lose!")
      }
    }
  }

  this.increaseScore = function() {
    this.score += 1;
    console.log(this.score);
    this.difficultyTicker += 1;
    if (this.difficultyTicker >= 10) {
      this.difficultyTicker = 0;
      this.increaseDifficulty();
    }
  }

  this.increaseDifficulty = function() {
    this.currentDifficulty = Math.min(this.currentDifficulty + 1,
                                      TapTen.MAX_DIFFICULTY)

    console.log(this.currentDifficulty);
  }

  this.run = function() {

    this.updateHexagons();

    var self = this;
    window.setInterval( function() {
      self.updateHexagons();
    }, TapTen.SPAWN_INTERVAL);
  }
}
