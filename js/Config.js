if (!window.TapTen) { window.TapTen = new Object();}


TapTen.SPAWN_INTERVAL = 5000;  // hexagon spawn interval in ms
TapTen.MAX_DIFFICULTY = 23;

TapTen.MAX_COUNTER_VALUE = 10; // highest value hexagon counters may reach
TapTen.COUNTER_INCREASE_INTERVAL = 1000; // interval in which counters increase in ms
TapTen.COUNTER_RESET_INTERVAL = 1000; // time a counter waits to continue increasing after clicking in ms

TapTen.SPAWN_COUNTER_MIN_VALUE = 1;
TapTen.SPAWN_COUNTER_MAX_VALUE = 2;

TapTen.HEXAGON_START_TEXTS = [
  "", "", "TAPTEN", "", "",
  "TAP", "HEXAGONS", "TO REDUCE", "COUNTERS!",
  "", "", "START", "", "",
  "DIFFICULTY", "WILL", "INCREASE", "OVER TIME!",
  "YOU LOSE", "IF ALL", "HEXAGONS", "HAVE", "COUNTERS!"
];

TapTen.HEXAGON_END_TEXTS = [
  "", "YOUR", "TIME", "IS UP!", "",
  "WOULD", "YOU", "MIND", "SHARING?",
  "", "", "", "", "",
  "", "", "", "",
  "", "QUIT", "", "RETRY", ""
];


