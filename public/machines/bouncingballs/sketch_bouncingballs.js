/*
   bouncing balls
*/

var flatlandConfig = {
  server: "https://flatland.earth",
  land: "default",
  updateIntervall: 40,
  spawnIntervall: 1,
  debug: true,
  clearscreen: true,
  backgroundcolor: [255, 255, 255],
  backgroundblend: 0.5,
};

var machineConfig = {
  name: "bouncingballs",
  maxCount: 4,
  minSize: 20,
  maxSize: 30,
  lifetime: 20000,
  color1: [255, 0, 255],
  color1Opacity: 0.1,
  color2: [0, 255, 255],
  color2Opacity: 0.1,
  pendown: false,
};

class Machine extends defaultMachine {
  setup() {
    // initialize your machine
    this.setPenDown();
    this.setType(MachineType.CIRCLE);
    this.rotationspeed = random(-0.05, 0.05);
    this.speed = 10;
    this.velocity = createVector(random(-5, 5), random(-5, 5));
  }
  move() {
    // move stuff
    this.setFill(
      color(
        machineConfig.color1[0],
        machineConfig.color1[1],
        machineConfig.color1[2]
      )
    );
    // local bounce
    for (let i = 0; i < flatland.machinesLocal.length; i++) {
      if (this != flatland.machinesLocal[i]) {
        let distance = dist(
          this.pos.x,
          this.pos.y,
          flatland.machinesLocal[i].pos.x,
          flatland.machinesLocal[i].pos.y
        );
        let minimale_distance =
          this.size / 2 + flatland.machinesLocal[i].size / 2;
        if (distance <= minimale_distance) {
          let dx = flatland.machinesLocal[i].pos.x - this.pos.x;
          let dy = flatland.machinesLocal[i].pos.y - this.pos.y;
          let a = atan2(dy, dx);
          this.velocity.mult(-1);
          flatland.machinesLocal[i].velocity.mult(-1);
          let tx = this.pos.x + cos(a) * (minimale_distance * 1.1);
          let ty = this.pos.y + sin(a) * (minimale_distance * 1.1);
          flatland.machinesLocal[i].pos.x = tx;
          flatland.machinesLocal[i].pos.y = ty;
          // this.color1 = color(random(255), random(255), random(255));
        }
      }
    }
    this.velocity.add(gravitation);
    this.pos.add(this.velocity);

    // einfallswinkel = ausfallswinkel
    if (this.pos.x - this.size / 2 <= -width / 2) {
      this.pos.x = -width / 2 + this.size / 2;
      this.velocity.x *= -friction;
    }
    if (this.pos.x + this.size / 2 >= width / 2) {
      this.pos.x = width / 2 - this.size / 2;
      this.velocity.x *= -friction;
    }
    if (this.pos.y - this.size / 2 <= -height / 2) {
      this.pos.y = -height / 2 + this.size / 2;
      this.velocity.y *= -friction;
    }
    if (this.pos.y + this.size / 2 >= height / 2) {
      this.pos.y = height / 2 - this.size / 2;
      this.velocity.y *= -friction;
    }
  }
}
// --------------------------------------------------------------
let gui;
let flatland;
let gravitation;
let friction = 0.7;
let lastspawn = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  flatland = new Flatland(); // connect to the flatland server
  initGui();
  initSocketIO(flatlandConfig.server);
  gravitation = createVector(0, -0);
}

function draw() {
  flatland.update(); // update + draw flatland
}
