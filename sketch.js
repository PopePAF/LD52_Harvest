// Set the dimensions of the map
// import {UI} from "./src/utility/debugUiManager.js";
let godMode = false;

let gameStarted = false;

let resetCount = 0;

let map2;

let camera;

let lastMillis;

let player

let noise;

let imgs = [];

let webglOn = false;

let score = 0

let game = true

let gameSong;

let menu;

let canvasWidth = 100;

let canvasHeight = 100;

let currentGameColor;

function preload(){
	gameSong = loadSound('assets/ingame.mp3', null, null);
}

function setup() {
	gameStarted = true;
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

	if(false && resetCount > 0){
		player = new Player({x: map2.rows/2 * map2.rez, y:map2.cols/2 * map2.rez}, currentGameColor)
	}else{
		player = new Player({x: map2.rows/2 * map2.rez, y:-map2.cols/4 * map2.rez}, currentGameColor)
	}

	score = 0;
	lastMillis = 0
	game = true
	frameRate(120)
}


function resetMap() {
	currentGameColor = color(random(10, 255), random(10, 255), random(10, 255), 255);
	map2 = new MarchingSquaresMapGenerator(600, 600, 15, true, 3, currentGameColor);
}

function draw() {

	//colorMode(HSB)
	background(0)

	menu.displayIntro();
	if (!game){
		menu.displayGameOver();
		return
	}

	if (!gameSong.isPlaying()) {
		gameSong.play();
	}

	let delta = millis() - lastMillis;
	lastMillis = millis();

	if (player.tentacles.smallOne && millis() % 1000 <= 50 && !(millis() % 3000 <= 50)){
		player.releaseSmallTentacle()

	} else if (millis() % 3000 <= 50 && !player.tentacles.main && !player.tentacles.smallOne){
		//player.shootSmallTentacle()
	}

	player.update()
	camera.update(delta, player.position, player.velocity, 1.2);

	if(webglOn) {
		translate(-width / 2, -height / 2, 0);
	}

	if(map2.bubbles.length === 0){
		player.waypoint = createVector(map2.width * 1.5 + width, map2.height / 2);
		if(player.position.x > map2.width + width / 2){
			let newX = -width / 2;
			player.position.x = newX;
			if(player.tentacles.main){
				player.tentacles.main.endPos.x -= (width + map2.width);
			}
			if(player.tentacles.smallOne){
				player.tentacles.smallOne.endPos.x = (width + map2.width);
			}

			player.waypoint = createVector(map2.width / 2, map2.height / 2);
			this.resetMap();
			player.setColor(currentGameColor)
			//map2.increment = random(-1, 1);
		}
	}

	map2.display2();
	player.draw(currentGameColor)
	//menu.displayInGameUI();

	// Draw the framerate
	fill(255);
	textSize(16);
	text("FPS: " + floor(frameRate()), 10, height - 10);

	push();
	strokeWeight(5)
	point(mouseX, mouseY);
	pop();
}

function checkCollisions(){
	let any_collision = false
	for(let i=0; i<map.width; i++)
	{
		for(let j=0; j<map.height; j++)
		{
			let tile = map.tiles[i][j];
			if(tile instanceof Wall)
			{
				let x_overlaps = (player.position.x-player.size/2 < tile.location.x + tile.scale) && (player.position.x+player.size/2 > tile.location.x)
				let y_overlaps = (player.position.y-player.size/2 < tile.location.y + tile.scale) && (player.position.y + player.size / 2 > tile.location.y)
				let collision = x_overlaps && y_overlaps
				if(collision)
				{
					player.velocity.setMag(0);
					any_collision = true
					return any_collision;
				}
			}
		}
	}
}

function restartGame(){
	setup();
}

function keyPressed(){
	if (keyCode === 82) { // 82 is the key code for "r"
		resetCount += 1;
		setup();
	}
}

function mousePressed(e){
	gameStarted = true;
	if (e.button === 0){
		player.shootTentacle()
	}else if(e.button === 2){
		player.releaseTentacle()
	}

	userStartAudio();
}

function mouseReleased(e){
	if (e.button === 0){
		player.releaseTentacle()
	}
}
