/*
   empty machine example
*/

var flatlandConfig = {
    // server: "http://localhost:3000",
    server: "https://flatland.earth",
    land: 'default',
    updateIntervall: 40,
    debug: false,
    clearscreen: true,
    backgroundcolor: [255, 255, 255],
    backgroundblend: 0.02
}

var machineConfig = {
    name: 'empty-machine-example',
    maxCount: 10,
    minSize: 20,
    maxSize: 30,
    lifetime: 6000,
    color1: [0, 0, 0],
    color1Opacity: 0.5,
    color2: [0, 0, 0],
    color2Opacity: 0.2,
    pendown: true

}



// ---------------------------------------------------------------
class Machine extends defaultMachine {
    setup() {
        // initialize your machine
        this.type = MachineType.POINT;
        this.pos.x = random(-width / 2, width / 2);
        this.pos.y = random(-height / 2, height / 2);

        this.target = points[mapper];

        mapper = (mapper + 1) % points.length;
        //    this.size = random(50,90);
    }
    move() {
        // how does your machine move 
        this.pos.x = (this.pos.x * 0.97) + (this.target.x * 0.03);
        this.pos.y = (this.pos.y * 0.97) + (this.target.y * 0.03);
        var d = dist(this.pos.x, this.pos.y, this.target.x, this.target.y);
        this.size = map(d, width / 2, 0, 200, 5);
    }
}
// --------------------------------------------------------------






// global p5 stuff

//let socket
let gui;
let flatland;
let typo;
let points;
let bounds;
let mapper = 0;
function preload() {
    typo = loadFont('../../assets/fonts/RobotoMono-Regular.otf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    textAlign(CENTER, CENTER);
    points = typo.textToPoints('flatland', 0, 0, 200, {
        sampleFactor: 0.02,
        simplifyThreshold: 0
    });

    for (let i = 0; i < points.length; i++) {
        points[i].x = points[i].x - width / 3;
        points[i].y = points[i].y;

    }

    machineConfig.maxCount = points.length;
    flatland = new Flatland(); // connect to the flatland server
    initGui();
    frameRate(100);
    initSocketIO(flatlandConfig.server);
    gravitation = createVector(0, 0);




    //textFont(typo);
    //textSize(100);

}


function draw() {
    flatland.update(); // update + draw flatland
}



function initGui() {
    gui = new dat.GUI();

    let guiFlatlandFolder = gui.addFolder('flatlandConfig');
    guiFlatlandFolder.add(flatlandConfig, 'server');
    selectLand = guiFlatlandFolder.add(flatlandConfig, 'land', allLands);
    guiFlatlandFolder.add(flatlandConfig, 'debug');
    guiFlatlandFolder.add(flatlandConfig, 'updateIntervall', 1, 250);
    guiFlatlandFolder.addColor(flatlandConfig, 'backgroundcolor');
    guiFlatlandFolder.add(flatlandConfig, 'backgroundblend', 0.0, 1.0);
    guiFlatlandFolder.add(flatlandConfig, 'clearscreen');
    guiFlatlandFolder.open();

    let guiMachineFolder = gui.addFolder("machineConfig");

    guiMachineFolder.add(machineConfig, 'name');
    guiMachineFolder.add(machineConfig, 'maxCount', 1, 100);
    guiMachineFolder.add(machineConfig, "minSize", 1, 200);
    guiMachineFolder.add(machineConfig, "maxSize", 1, 200);
    guiMachineFolder.add(machineConfig, "lifetime", 1, 20000);
    guiMachineFolder.addColor(machineConfig, 'color1');
    guiMachineFolder.add(machineConfig, 'color1Opacity', 0, 1);
    guiMachineFolder.addColor(machineConfig, 'color2');
    guiMachineFolder.add(machineConfig, 'color2Opacity', 0.0, 1.0);
    guiMachineFolder.add(machineConfig, 'pendown');
    guiMachineFolder.open();
}

/*
make p5js responsive 
*/
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}