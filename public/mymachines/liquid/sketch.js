/*
   empty machine example
*/

var flatlandConfig = {
  server: "https://flatland.earth",
  land: "default",
  updateIntervall: 40,
  spawnIntervall: 1,
  debug: true,
  clearscreen: true,
  backgroundcolor: [208, 208, 208],
  backgroundblend: 0.04,
};

var machineConfig = {
  name: "newtonscheBälle",
  maxCount: 4,
  minSize: 20,
  maxSize: 30,
  lifetime: 15000,
  color1: [255, 0, 255],
  color1Opacity: 0.7,
  color2: [0, 0, 0],
  color2Opacity: 0.7,
  pendown: true,
};
// ---------------------------------------------------------------
class Machine extends defaultMachine {
  setup() {
    // initialize your machine
    this.setType(MachineType.RECT); // make bot a rectangle
    this.setFill(0, 0, 255);
    this.setStroke(0, 0, 255);
    //this.setRotation(PI / 4); // rotate bot 45 degree
    this.setPosition(0, -50); // go to random pos;
    this.size = 400;
  }
  move() {
    // how does your machine move
    //this.setPosition();
  }
}
// --------------------------------------------------------------

let gui;
let flatland;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  flatland = new Flatland(); // connect to the flatland server
  initGui();
  initSocketIO(flatlandConfig.server);
}

function draw() {
  flatland.update(); // update + draw flatland
}
