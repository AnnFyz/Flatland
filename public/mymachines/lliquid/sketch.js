/*
   global grid example
*/

var flatlandConfig = {
  server: "https://flatland.earth",
  land: "testland",
  updateIntervall: 30,
  spawnIntervall: 100,
  debug: false,
  clearscreen: false,
  backgroundcolor: [255, 255, 255],
  backgroundblend: 0.5,
};

var machineConfig = {
  name: "grid",
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

// ---------------------------------------------------------------
class Machine extends defaultMachine {
  setup() {
    // initialize your machine
    this.setType(MachineType.CIRCLE);
    this.setSize(random(0, 100));
    this.setLifetime(random(0, machineConfig.lifetime));
    this.setStroke(0, random(255), random(100, 255), 120);
    this.setFill(0, random(150), random(100, 255), 0);
    this.setPenDown();
    //this.penDown();
    this.myown_rotationspeed = random(-0.01, 0.01);
    this.myownrandomradius = 50;
    var randomindex = int(random(liquid.length));
    this.myownvariable_centerx = centerOfSystemX;
    this.myownvariable_centery = centerOfSystemY;
    index = (index + 1) % liquid.length;
  }
  move() {
    // how does your machine move
    translate(-20, -100);
    this.setPosition(
      this.myownvariable_centerx +
        cos(millis() * this.myown_rotationspeed) * this.myownrandomradius,
      this.myownvariable_centery +
        sin(millis() * this.myown_rotationspeed) * this.myownrandomradius
    );
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
