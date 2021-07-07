/*
   global grid example
*/

var flatlandConfig = {
  server: "https://flatland.earth",
  land: "group3",
  updateIntervall: 30,
  spawnIntervall: 40,
  debug: false,
  clearscreen: true,
  backgroundcolor: [208, 208, 208],
  backgroundblend: 0.1,
};

var machineConfig = {
  name: "wave",
  maxCount: 10,
  minSize: 20,
  maxSize: 30,
  lifetime: 10000, // forever...!
  color1: [0, 0, 255],
  color1Opacity: 0.1,
  color2: [0, 0, 0],
  color2Opacity: 0,
  pendown: true,
};

// ---------------------------------------------------------------
class Machine extends defaultMachine {
  setup() {
    this.setPenDown();
    this.setType(MachineType.RECT);
    this.setLifetime(10000000); //forever
    this.color1 = color(
      machineConfig.color1[0],
      machineConfig.color1[1],
      machineConfig.color1[2]
    );
    noStroke();
  }

  move() {
    this.setPosition(-width / 2 + this.size / 2, height / 2 - this.size / 2);
    this.setSize(250);
    if (c3 < 255) {
      c3 += 0.05;
    } else {
      c3 = 0;
    }
    let timeLastUpdated = Date.now(); // will hold the current date/time in milliseconds
    const TIME_BETWEEN_RANDOMIZATIONS = 100; // milliseconds between new randoms
    if (Date.now() - timeLastUpdated > TIME_BETWEEN_RANDOMIZATIONS) {
      // generate new random numbers
      c2 = random(c3, 255);

      // update the time
      timeLastUpdated = Date.now();
    }
    this.color1 = color(0, random(c3, 100), c3, random(0, 40));
  }
}
// --------------------------------------------------------------
let c3 = 0;
let c2 = 0;
let gui;
let flatland;
// local stuff
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  flatland = new Flatland(); // connect to the flatland server
  initGui();
  initSocketIO(flatlandConfig.server);
}

function draw() {
  flatland.update(); // update + draw flatland
}
