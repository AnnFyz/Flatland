/*
   global grid example
*/

var flatlandConfig = {
  server: "https://flatland.earth",
  land: "default",
  updateIntervall: 30,
  spawnIntervall: 100,
  debug: false,
  clearscreen: false,
  backgroundcolor: [255, 255, 255],
  backgroundblend: 0.5,
};

var machineConfig = {
  name: "wave",
  maxCount: 10,
  minSize: 20,
  maxSize: 30,
  lifetime: 10000, // forever...!
  color1: [255, 0, 255],
  color1Opacity: 0.1,
  color2: [0, 255, 255],
  color2Opacity: 0.1,
  pendown: false,
};

let angles = [];
let angleV = [];
let r = 10;
// ---------------------------------------------------------------
class Machine extends defaultMachine {
  setup() {
    // initialize your machine
    this.setType(MachineType.CIRCLE);
    let total = floor(width / (r * 2));
    for (let i = 0; i < total + 1; i++) {
      angles[i] = map(i, 0, total, 0, 2 * TWO_PI);
      // angleV[i] = 0.01 + i / 100;
    }
  }

  move() {
    beginShape();
    for (let i = 0; i < angles.length; i++) {
      let y = map(sin(angles[i]), -1, 1, -200, 200);
      strokeWeight(4);
      let x = map(i, 0, angles.length, -300, 300);
      // line(x, 0, x, y);
      circle(x, y, r * 2);
      // vertex(x,y);
      angles[i] += 0.02;
      // angles[i] += angleV[i];
    }
    endShape();
  }
}
// --------------------------------------------------------------

let gui;
let flatland;

// my own  gloabal variables
let maxpoints = 7;
let index = 0;
let liquid = [];

let centerOfSystemX = 0;
let centerOfSystemY = 0;
// local stuff
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // array of bubbles
  for (var bb = 0; bb < maxpoints; bb++) {
    var v = createVector(centerOfSystemX, centerOfSystemY);
    liquid.push(v);
  }

  machineConfig.maxCount = liquid.length;

  flatland = new Flatland(); // connect to the flatland server
  initGui();
  initSocketIO(flatlandConfig.server);
}

function draw() {
  if (mouseIsPressed) {
    centerOfSystemX = mouseX - width / 2;
    centerOfSystemY = mouseY - height / 2;
  }
  flatland.update(); // update + draw flatland
}
