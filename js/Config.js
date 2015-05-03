if (!window.TapTen) { window.TapTen = new Object();}


TapTen.SPAWN_INTERVAL = 5000;  // hexagon spawn interval in ms
TapTen.SPAWN_COUNTS = [2, 3, 4, 5, 6, 7, 8, 9, 10]; // highest amount of hexagons
                                             // spawned per spawn interval depending
                                             // on the current difficulty
TapTen.MAX_DIFFICULTY = TapTen.SPAWN_COUNTS.length;

TapTen.MAX_COUNTER_VALUE = 10; // highest value hexagon counters may reach
TapTen.COUNTER_INCREASE_INTERVAL = 1000; // interval in which counters increase in ms
TapTen.COUNTER_RESET_INTERVAL = 1000; // time a counter waits to continue increasing after clicking in ms

TapTen.SPAWN_COUNTER_MIN_VALUES = [1, 1, 1, 1, 2, 2, 2, 3, 3];
TapTen.SPAWN_COUNTER_MAX_VALUES = [3, 4, 4, 4, 5, 5, 6, 7, 8];



