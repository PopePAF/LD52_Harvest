// Set the dimensions of the map
// import {UI} from "./src/utility/debugUiManager.js";

// TODO: look at that: https://jsfiddle.net/klenwell/3ZdXf/

let resetCount = 0;

let map2;

let camera;

let lastMillis;

let player

let noise;

let score = 0

let gameRunning = true

let gameSong;

let menu;

let canvasWidth;
let canvasHeight;

let currentGameColor;
let delta = 0;

// BASIC SETTINGS
let autoMode			= false;
let showFrameRate		= false;
let webglOn			= false;
let godMode			= true;
let gravityOn			= true;

// MAP SETTINGS
let minMapSize			= 100;
let maxMapSize			= 2000;
let minRez = 10;
let maxRez = 25;

function preload(){
	gameSong = loadSound('assets/ingame.mp3', null, null);
}

function setup() {
	frameRate(120)
	//fullscreen(true);
	noCursor();

	canvasWidth = windowWidth;
	canvasHeight = windowHeight;

	if(webglOn){
		createCanvas(canvasWidth, canvasHeight, WEBGL);
	}else{
		createCanvas(canvasWidth, canvasHeight);
	}

	menu = new Menu();
	noise = new OpenSimplexNoise(Date.now());
	camera = new View(0, 0, width, height)

	this.resetMap();

	// spawn player
	let newPosition = createVector(map2.cols/2 * map2.rez - map2.height/2 - 90, map2.rows/2 * map2.rez);
	player = new Player(newPosition, color(350, 360, 300));

	// send player into orbit around map
	if(false) {
		let distanceFromMapCenter = dist(player.position.x, player.position.y, map2.width / 2, map2.height / 2);
		let gravitationalForceMagnitude = 0.2;
		let requiredSpeed = Math.sqrt(gravitationalForceMagnitude * distanceFromMapCenter);
		player.applyForce(createVector(0, 1).setMag(requiredSpeed));
	}
	score = 0;
	lastMillis = 0
	gameRunning = true;
}


function resetMap() {
	currentGameColor = color(random(0, 360), 360, 360, 255);
	let mapSize = random(minMapSize, maxMapSize);
	let bubbleCount = random(1, 2);
	// the rezolution should be 12 if the mapSize is 300 and 24 if the mapSize is 1200
	let rezolution = map(mapSize, minMapSize, maxMapSize, minRez, maxRez);
	//let rezolution = random(12, 20);
	let lerp = true;
	map2 = new MarchingSquaresMapGenerator(mapSize, mapSize, rezolution, lerp, bubbleCount, currentGameColor);
}

function draw() {
	delta = deltaTime / 20;
	console.log(deltaTime)
	colorMode(HSB, 360, 360, 360, 255)
	background(0)

	//menu.displayIntro();
	if (!gameRunning){
		menu.displayGameOver();
		return
	}

	if (!gameSong.isPlaying()) {
		gameSong.play();
	}


	lastMillis = millis();
	player.update()
	camera.update(player.position, player.velocity, 1.2);

	if(webglOn) {
		translate(-width / 2, -height / 2, 0);
	}

	if(map2.bubbles.length === 0){
		player.waypoint = createVector(map2.width * 1.5 + width, map2.height / 2);
		if(player.position.x > map2.width + width / 2){
			player.position.x = -width / 2;
			this.resetMap();
			player.waypoint = createVector(map2.width / 2, map2.height / 2);
			//player.setColor(currentGameColor)
		}
	}

	map2.display2();
	player.draw()
	//menu.displayInGameUI();

	//Draw the framerate
	if(showFrameRate){
		fill(currentGameColor);
		textSize(16);
		text("FPS: " + floor(frameRate()), 10, height - 10);
	}

	push();
	strokeWeight(5)
	point(mouseX, mouseY);
	pop();
}

function keyPressed(){
	// reset the game if 'r' is pressed
	if (keyCode === 82) {
		resetCount += 1;
		setup();
	}
	// toggle autoMode if 't' is pressed
	if (keyCode === 84){
		autoMode = !autoMode;
	}

	// toggle frame rate display if 'f' is pressed
	if (keyCode === 70){
		showFrameRate = !showFrameRate;
	}

	// toggle godMode if 'h' is pressed
	if (keyCode === 72){
		godMode = !godMode;
	}

	// toggle gravity if 'g' is pressed
	if (keyCode === 71){
		gravityOn = !gravityOn;
	}
}

function mousePressed(){
	userStartAudio();
}
