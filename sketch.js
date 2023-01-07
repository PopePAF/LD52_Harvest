// Set the dimensions of the map
// import {UI} from "./src/utility/debugUiManager.js";

// Create a 2D array to store the height values
let map;

let camera;

let lastMillis;

let player

let noise;

function setup() {
	createCanvas(400, 400);
	noise = new OpenSimplexNoise(Date.now());
	camera = new View(0, 0, width, height)
	map = new Map(100, 100, 4, 20)
	player = new Player({x: map.width/2 * map.scale, y:map.height/2 * map.scale})

	frameRate(5)
}

function draw() {

	let delta = millis() - lastMillis;
	lastMillis = millis();
	background(255);
	noFill();
	stroke(0)
	rect(0, 0, camera.width, camera.height);
	line(width/2, 0, width/2, height)
	line(0, height/2, width, height/2)

	// camera(0, 0, 0, 0, 0, 0, 0, 1, 0);
	// plane(10, 10);

	player.update()
	camera.update(delta, player.position, player.velocity);

	// console.log(playerLocation, camera.location)
	// push();
	// 		ellipse(playerLocation.x, playerLocation.y, 10, 10)
			//scale(1.5)
			 map.render();
			player.draw()
			// fill(255)
			// ellipseMode(CENTER)
	// pop();


	// noLoop();
}



function keyPressed(){
	if (keyCode === 82) { // 82 is the key code for "r"
		map.refresh();
	}
}

function mousePressed(e){
	if (e.button === 0){
		player.shootTentacle()
	}

}

function mouseReleased(e){
	if (e.button === 0){
		player.releaseTentacle()
	}
}
