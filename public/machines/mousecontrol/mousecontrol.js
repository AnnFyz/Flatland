/*
   mouse control + sound
*/

var flatlandConfig = {
  server: "https://flatland.earth",
  land: "default",
  updateIntervall: 20,
  spawnIntervall: 500,
  debug: false,
  clearscreen: true,
  backgroundcolor: [255, 255, 255],
  backgroundblend: 0.5,
};

var machineConfig = {
  name: "mousecontrol",
  maxCount: 5,
  minSize: 1,
  maxSize: 200,
  lifetime: 2000,
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
    this.angle = random(PI * 2);
    this.radius = random(50, (height / 2.0) * 0.7);
    this.speed = random(-0.09, 0.09);

    this.setType(MachineType.CIRCLE);
    this.setStroke(0, 0, 0, 0);
    this.setFill(
      color(random(255), random(255), random(255), random(100, 200))
    );
    this.enableAudio(1, 0);
    this.setAudioPhase(map(this.speed, -0.1, 0.1, 0, 1));
    this.lastaudioupdate = 0;
    this.centerX = 0; //mouse pos
    this.centerY = 0;
  }
  move() {
    this.angle += this.speed;
    this.setSize(
      map(
        this.getLifetime(),
        0,
        1.0,
        machineConfig.maxSize,
        machineConfig.minSize
      )
    );
    var tmpr = this.radius + sin(millis() * 0.001) * 100;
    this.setPosition(
      centerOfSystemX + cos(this.angle) * tmpr,
      centerOfSystemY + sin(this.angle) * tmpr
    );
    if (millis() - this.lastaudioupdate > 100) {
      this.setAudioPan(
        constrain(map(this.pos.x, -width / 2, width / 2, -1.0, 1.0), -1, 1)
      );
      this.setAudioFrequency(map(this.speed, -0.1, 0.1, 50, 2600));
      this.setAudioAmplitude(
        map(
          this.getLifetime(),
          0.0,
          1.0,
          (1.0 / machineConfig.maxCount) * 0.1,
          0
        )
      );
      this.lastaudioupdate = millis();
    }
  }
}
// --------------------------------------------------------------

let gui;
let flatland;

let centerOfSystemX = 0;
let centerOfSystemY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
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
