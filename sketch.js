// Set the dimensions of the map
// import {UI} from "./src/utility/debugUiManager.js";

let blur = false;

let map;

let camera;

let lastMillis;

let player

let noise;

function setup() {
	createCanvas(600, 600);
	noise = new OpenSimplexNoise(Date.now());
	camera = new View(0, 0, width, height)
	map = new Map(300, 300, 16, 20)
	player = new Player({x: map.width/2 * map.scale, y:map.height/2 * map.scale})
	frameRate(60)
}

function draw() {

	let delta = millis() - lastMillis;
	lastMillis = millis();

	if (player.tentacles.smallOne && millis() % 1000 <= 50 && !(millis() % 3000 <= 50)){
		player.releaseSmallTentacle()

	} else if (millis() % 3000 <= 50 && !player.tentacles.main && !player.tentacles.smallOne){
		player.shootSmallTentacle()
	}
	// console.log(millis())

	background(255);

	if(blur){
		fill(255, 60)
		rect(0, 0, width, height);
	}else{
		background(255);
	}



	// camera(0, 0, 0, 0, 0, 0, 0, 1, 0);
	// plane(10, 10);
	checkCollisions();
	player.update()
	camera.update(delta, player.position, player.velocity, 1.2);

	// console.log(playerLocation, camera.location)
	// push();
	// 		ellipse(playerLocation.x, playerLocation.y, 10, 10)
			//scale(1.5)
			 map.render();
			player.draw()
			// fill(255)
			// ellipseMode(CENTER)
	// pop();
	// noFill();
	// stroke(0)
	// // rect(0, 0, camera.width, camera.height);
	// line(width/2, 0, width/2, height)
	// line(0, height/2, width, height/2)
	if(frameCount % 5 === 0){
		fill(255, 255, 0)
		noStroke();
		text(Math.floor(frameRate()), 10, 10)
		stroke(0)
	}



	// noLoop();
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
