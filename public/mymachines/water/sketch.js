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
  color1Opacity: 0.5,
  color2: [255, 0, 255],
  color2Opacity: 0,
  pendown: true,
};

// ---------------------------------------------------------------
class Machine extends defaultMachine {
  setup() {
    this.setPenDown();
    this.setType(MachineType.RECT);
    this.setLifetime(10000000); //forever
  }

  move() {
    this.setPosition(-width / 2 + this.size / 2, height / 2 - this.size / 2);
    this.setSize(250);
  }
}

// --------------------------------------------------------------

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
