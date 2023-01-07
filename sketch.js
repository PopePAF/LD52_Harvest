// Set the dimensions of the map
// import {UI} from "./src/utility/debugUiManager.js";

let ui;

// Create a 2D array to store the height values
let map;

let playerLocation;

function setup() {
	map = new Map(200, 200, 5, 110)

	playerLocation = createVector(map.width/2*map.scale, map.height/2*map.scale);

	ui = new UI(map);

	createCanvas(800, 800);

}

function draw() {
	scale(1)
	frameRate(5);
	background(255);
	noFill();
	stroke(0)
	rect(0, 0, width, height);
	line(width/2, 0, width/2, height)
	line(0, height/2, width, height/2)

	// camera(0, 0, 0, 0, 0, 0, 0, 1, 0);
	// plane(10, 10);

	updateUiValues();
	// push();
		translate(width/2-playerLocation.x, height/2-playerLocation.y);

			map.render();
			fill(255)
			ellipseMode(CENTER)
			ellipse(playerLocation.x, playerLocation.y, 10, 10)
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
	}else if (keyCode === UP_ARROW){
		playerLocation.y -= map.scale;
	}else if (keyCode === DOWN_ARROW){
		playerLocation.y += map.scale;
	}else if (keyCode === LEFT_ARROW){
		playerLocation.x -= map.scale;
	}else if (keyCode === RIGHT_ARROW){
		playerLocation.x += map.scale;
	}
}
