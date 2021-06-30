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
    this.setType(MachineType.POINT);
    this.setSize(random(0, 100));
    this.setLifetime(random(0, machineConfig.lifetime));
    this.setStroke(0, random(255), random(100, 255), 128);
    this.setFill(random(255), random(255), random(255), 128);
    this.setPenDown();
    //this.penDown();
    this.myown_rotationspeed = random(-0.001, 0.001);
    this.myownrandomradius = 100;
    var randomindex = int(random(grid.length));
    this.myownvariable_centerx = grid[index].x;
    this.myownvariable_centery = grid[index].y;
    index = (index + 1) % grid.length;
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
let grid = [];

// local stuff
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // create a global grid
  for (var a = 0; a < TWO_PI; a += 10) {
    for (var bb = 0; bb < maxpoints; bb++) {
      let x = 150 * cos(a);
      var y = 150 * sin(a);
      var v = createVector(x, y);
      grid.push(v);
    }
  }

  machineConfig.maxCount = grid.length;

  flatland = new Flatland(); // connect to the flatland server
  initGui();
  initSocketIO(flatlandConfig.server);
}

function draw() {
  flatland.update(); // update + draw flatland
}
