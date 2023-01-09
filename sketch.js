// Set the dimensions of the map
// import {UI} from "./src/utility/debugUiManager.js";
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

let restartBtn

function setup() {
	if(webglOn){
		createCanvas(600, 600, WEBGL);
	}else{
		createCanvas(600, 600);

	}

	noise = new OpenSimplexNoise(Date.now());
	camera = new View(0, 0, width, height)

	// map = new Map(300, 300, 16, 20)
	map2 = new MarchingSquaresMapGenerator(width*2, height*2, 15, true, 5);
	// player = new Player({x: map.width/2 * map.scale, y:map.height/2 * map.scale})

	player = new Player({x: map2.rows/2 * map2.rez, y:map2.cols/2 * map2.rez})
	score = 1;
	lastMillis = 0
	game = true

	restartBtn = createButton('Restart')
	restartBtn.position(windowWidth/2, 500)
	restartBtn.mousePressed(restartGame)
	restartBtn.hide()

	frameRate(60)
}

function draw() {

	background(0)

	if (!game){
		restartBtn.show()
		textSize(40)
		fill(200, 0, 0)
		textAlign(CENTER)
		text('GAME OVER', width/2, 200)

		textSize(30)
		textAlign(CENTER)
		fill(255)
		stroke(255,0,0)
		text('Your final score is:', width/2, 350)
		text(score, width/2, 400)

		stroke(255)
		noFill()
		rect(0, 0, width, height, 10)
		noStroke()
		return
	}

	let delta = millis() - lastMillis;
	lastMillis = millis();
	score += Math.floor(delta / 10)

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
	if(frameCount % 5 === 0){
		// fill(255, 255, 0)
		// noStroke();
		// textSize(36);
		// textFont("Georgia");
		// text(Math.floor(frameRate()), 10, 10)
		// stroke(0)
	}

	fill((1 - player.healthPerc) * 255, player.healthPerc * 255, 0)
	noStroke()
	rect(15, 565, player.healthPerc * 200, 20, 40)

	noFill()
	stroke(255)
	rect(15, 565, 200, 20, 40)

	fill(0)
	rect(400, 550, 200, 50, 20, 0, 10, 0)

	fill(255)
	textSize(32)
	textAlign(RIGHT)
	text(score, 590, 587)

	noFill()
	rect(0, 0, width, height, 10)
	stroke(255,0,0)

	if (player.healthPerc <= 0){
		game = false
	}

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

	score = 0
	player.healthPerc = 1
	player.velocity.mult(0)
	player.position = createVector(map2.rows/2 * map2.rez, map2.cols/2 * map2.rez)
	restartBtn.hide()
	game = true
}

function windowResized(){
	restartBtn.position(windowWidth/2, 500)
}

function keyPressed(){
	if (keyCode === 82) { // 82 is the key code for "r"
		map.refresh();
	}
}

function mousePressed(e){
	if (e.button === 0){
		player.shootTentacle()
	}else if(e.button === 2){
		player.releaseTentacle()
	}

}

function mouseReleased(e){
	if (e.button === 0){
		player.releaseTentacle()
	}
}
