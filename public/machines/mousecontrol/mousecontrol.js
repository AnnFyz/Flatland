/*
   empty machine example
*/

var flatlandConfig = {
    // server: "http://localhost:3000",
    server: "http://flatland.earth",
    land: 'default',
    updateIntervall : 10, 
    debug: false,
    clearscreen: true,
    backgroundcolor: [255, 255, 255],
    backgroundblend: 0.5
}

var machineConfig = {
    name: 'mousecontrol',
    maxCount: 5,
    minSize: 20,
    maxSize: 30,
    lifetime: 2000,
    color1: [255, 0, 255],
    color1Opacity: 0.1,
    color2: [0, 255, 255],
    color2Opacity: 0.1,
    pendown: true

}



// ---------------------------------------------------------------
class Machine extends defaultMachine {
    setup() {
        // initialize your machine
        this.type = MachineType.CIRCLE;
        this.angle = random(PI*2);
        this.radius = random(100,(width/2)*0.7);
        this.speed = random(-0.1,0.1);
        this.freq= 1;
        this.amp = 0;
        this.size= random(10,100);
        this.color1 = color(0,0,0,random(100,200));
        this.enableAudio();
        this.lastaudioupdate = 0;
    
    }
    move() {
        this.angle+=this.speed;
        
        this.pos.x=mouseX-(width/2)+(cos(this.angle)*(this.radius+(sin(millis()*0.0001)*100)));
        this.pos.y=mouseY-(height/2)+(sin(this.angle)*(this.radius+(sin(millis()*0.0001)*100)));
        if ((millis()-this.lastaudioupdate)> 100) {
            this.updateSound(
                map((this.pos.x+(width/2)),0,width,50,600),
            
                map((this.pos.y+(width/2)),0,height,0,(1/machineConfig.maxCount)*0.99)
                );
            this.lastaudioupdate = millis();
        }
    }
}
// --------------------------------------------------------------








//let socket
let gui;
let flatland;


function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    flatland = new Flatland(); // connect to the flatland server
    initGui();
    frameRate(100);
    initSocketIO(flatlandConfig.server);
    gravitation = createVector(0, 0);
}


function draw() {
    flatland.update(); // update + draw flatland
}



function initGui() {
    gui = new dat.GUI();

    let guiFlatlandFolder = gui.addFolder('flatlandConfig');
    guiFlatlandFolder.add(flatlandConfig, 'server');
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