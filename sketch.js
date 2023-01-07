// Set the dimensions of the map
// import {UI} from "./src/utility/debugUiManager.js";

let ui;

// Create a 2D array to store the height values
let map;

let camera;

let lastMillis;

let player

function setup() {
	createCanvas(400, 400);
	player = new Player({x: width/2, y:height/2})

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

	updateUiValues();
	player.update()
	camera.update(delta, player.position, player.velocity);

	// console.log(playerLocation, camera.location)
	// push();
	// 		ellipse(playerLocation.x, playerLocation.y, 10, 10)
			// scale(1.5)
			map.render();
			player.draw()
			// fill(255)
			// ellipseMode(CENTER)
	// pop();


	// noLoop();
}

function updateUiValues(){
	map.scale 		  = ui.getScaleValue();
	map.caveThreshold = ui.getCaveThresholdValue();
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
