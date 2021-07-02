/*
   combination of 
*/

var flatlandConfig = {
  server: "https://flatland.earth",
  land: "default",
  updateIntervall: 40,
  spawnIntervall: 1,
  debug: true,
  clearscreen: true,
  backgroundcolor: [208, 208, 208],
  backgroundblend: 0.1,
};

var machineConfig = {
  name: "newtonscheBälle",
  maxCount: 5,
  minSize: 20,
  maxSize: 30,
  lifetime: 15000,
  color1: [255, 0, 255],
  color1Opacity: 0.7,
  color2: [0, 0, 0],
  color2Opacity: 0.7,
  pendown: true,
};
let gravitation;
let friction = 0.7;
let lastspawn = 0;
let punkt = 1;
let isCollision = false;

class Machine extends defaultMachine {
  setup() {
    this.setPenDown();
    this.setType(MachineType.TEXT);
    this.setStroke(0, random(255), random(100, 255), 120);
    let lettersArray = ["☹", "😞", "😡", "😱", "😵", "😰"];
    let myIndex = int(random(lettersArray.length));
    this.setText(lettersArray[myIndex]);
    this.rotationspeed = random(-0.05, 0.05);
    this.speed = 10;
    this.velocity = createVector(random(-5, 5), random(-5, 5));
    this.color1 = color(
      machineConfig.color1[0],
      machineConfig.color1[1],
      machineConfig.color1[2]
    );
    // Anna Teil
    this.setPosition(random(-100, 100), random(-100, 100));
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(0.5, 2));
    this.acc = createVector(0, 0);
    this.size = random(50, 130);
    this.r = sqrt(this.size) * 10;
  }

  move() {
    if (this.liquidContains(this.pos)) {
      this.vel.mult(0.1);
    }

    this.color1 = color(
      lerp(
        machineConfig.color2[0],
        machineConfig.color1[0],
        this.getLifetime()
      ),
      lerp(
        machineConfig.color2[1],
        machineConfig.color1[1],
        this.getLifetime()
      ),
      lerp(machineConfig.color2[2], machineConfig.color1[2], this.getLifetime())
    );
    this.color2 = color(255, 255, 255);

    if (isCollision) {
      this.newtonFunction();
      setTimeout(function () {
        isCollision = false;
      }, 5000);
    }

    if (!isCollision) {
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
          if (distance <= minimale_distance && this.getLifetime() > 0.1) {
            let dx = flatland.machinesLocal[i].pos.x - this.pos.x;
            let dy = flatland.machinesLocal[i].pos.y - this.pos.y;
            let a = atan2(dy, dx);
            this.velocity.mult(-1);
            flatland.machinesLocal[i].velocity.mult(-1);
            let tx = this.pos.x + cos(a) * (minimale_distance * 1.1);
            let ty = this.pos.y + sin(a) * (minimale_distance * 1.1);
            flatland.machinesLocal[i].pos.x = tx;
            flatland.machinesLocal[i].pos.y = ty;
            //this.color1 = color(random(255), random(255), random(255));

            let p = createP("Begegnung №:" + punkt);
            p.style("font-size", "16px");
            p.position(
              flatland.machinesLocal[i].pos.x + windowWidth / 2,
              flatland.machinesLocal[i].pos.y + windowHeight / 2
            );
            isCollision = true;
            punkt += 1;
          }
        }
      }
      // remote bounce

      for (let i = 0; i < flatland.machinesRemote.length; i++) {
        let distance = dist(
          this.pos.x,
          this.pos.y,
          flatland.machinesRemote[i].pos.x,
          flatland.machinesRemote[i].pos.y
        );
        let minimale_distance =
          this.size / 2 + flatland.machinesRemote[i].size / 2;
        if (distance <= minimale_distance) {
          this.velocity.mult(-1);
          this.pos.x = this.pos.x + random(-100, 100);
          this.pos.y = this.pos.y + random(-100, 100);
          // this.color1 = color(random(255), random(255), random(255));
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
  // Is the ball in the Liquid?
  liquidContains(b) {
    return b.x > 0 && b.x < 0 + 400 && b.y > -50 && b.y < -50 + 400;
  }

  newtonFunction() {
    let gravity = createVector(0, 0.5);
    let wind = p5.Vector.random2D();
    let weight = p5.Vector.mult(gravity, this.size);
    this.edgesN();
    this.applyForceN(wind);
    this.applyForceN(weight);
    this.updateN();
  }

  applyForceN(force) {
    let f = p5.Vector.div(force, this.size);
    this.acc.add(f);
  }

  updateN() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  edgesN() {
    if (this.pos.x - this.size / 2 <= -width / 2) {
      this.pos.x = -width / 2 + this.size / 2;
      this.vel.x *= -1;
    }
    if (this.pos.x + this.size / 2 >= width / 2) {
      this.pos.x = width / 2 - this.size / 2;
      this.vel.x *= -1;
    }
    if (this.pos.y - this.size / 2 <= -height / 2) {
      this.pos.y = -height / 2 + this.size / 2;
      this.vel.y *= -1;
    }
    if (this.pos.y + this.size / 2 >= height / 2) {
      this.pos.y = height / 2 - this.size / 2;
      this.vel.y *= -1;
    }
  }
}

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
