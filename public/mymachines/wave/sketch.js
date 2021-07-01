/*
   global grid example
*/

var flatlandConfig = {
  server: "https://flatland.earth",
  land: "default",
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
  color1: [0, 200, 255],
  color1Opacity: 0.7,
  color2: [0, 200, 255],
  color2Opacity: 0.7,
  pendown: true,
};

let angles = [];
let angleV = [];
let r = 20;
// ---------------------------------------------------------------
class Machine extends defaultMachine {
  setup() {
    this.setPenDown();
    this.setType(MachineType.CIRCLE);
    this.setLifetime(10000000); //forever
  }

  move() {
    for (let i = 0; i < angles.length; i++) {
      let y = map(sin(angles[i]), -1, 1, -200, 200);
      strokeWeight(4);
      let x = map(i, 0, angles.length, -300, 300);
      //line(x, 0, x, y);
      this.setPosition(x, y);
      this.setSize(r * 2);
      circle(x, y, r * 2);

      angles[i] += 0.002;
      // angles[i] += angleV[i];
    }
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

  let total = floor(width / (r * 3));
  for (let i = 0; i < total + 1; i++) {
    angles[i] = map(i, 0, total, 0, 2 * TWO_PI);
    // angleV[i] = 0.01 + i / 100;
  }
}

function draw() {
  flatland.update(); // update + draw flatland
}
