// Set the dimensions of the map
// import {UI} from "./src/utility/debugUiManager.js";
let godMode = false;

let gameStarted = false;

let resetCount = 0;

let map;
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

function preload(){
	gameSong = loadSound('assets/ingame.mp3', null, null);
}

function setup() {
	gameStarted = false;
	noCursor();
	if(webglOn){
		createCanvas(600, 533, WEBGL);
	}else{
		createCanvas(600, 533);

	}

	menu = new Menu();
	noise = new OpenSimplexNoise(Date.now());
	camera = new View(0, 0, width, height)

	map2 = new MarchingSquaresMapGenerator(600*2, 600*2, 15, true, 5);
	if(resetCount > 0){
		player = new Player({x: map2.rows/2 * map2.rez, y:map2.cols/2 * map2.rez})
	}else{
		player = new Player({x: map2.rows/2 * map2.rez, y:-map2.cols/4 * map2.rez})
	}

	score = 0;
	lastMillis = 0
	game = true

	frameRate(60)
}


function draw() {

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
		player.shootSmallTentacle()
	}

	player.update()
	camera.update(delta, player.position, player.velocity, 1.2);

	if(webglOn) {
		translate(-width / 2, -height / 2, 0);
	}

	map2.display();
	player.draw()
	menu.displayInGameUI();
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
