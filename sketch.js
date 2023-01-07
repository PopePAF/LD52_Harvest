// Set the dimensions of the map
// import {UI} from "./src/utility/debugUiManager.js";

const mapWidth = 100;
const mapHeight = 100;

let ui;

// Set the scaling factor for the noise function

let scale = 5;

// Set the threshold for drawing cave structures
// let caveSlider;
let caveThreshold = 128;

// Create a 2D array to store the height values
let map = [];
function setup() {
	console.log("setup() run");

	ui = new UI();

	createCanvas(mapWidth * scale, mapHeight * scale);

	refreshMap();
}

function refreshMap(){
	noiseSeed(random(1, 10000));
	map = [];
	for (let x = 0; x < mapWidth; x++) {
		map[x] = [];
	}

	// Generate the height values using noise()
	for (let x = 0; x < mapWidth; x++) {
		for (let y = 0; y < mapHeight; y++) {
			// Use noise() to generate a value between 0 and 1
			let noiseVal = noise(x / scale, y / scale);
			// Scale the noise value to a range between 0 and 255
			map[x][y] = noiseVal * 255;
		}
	}
	console.log("test");
}

function draw() {

	frameRate(1);
	background(0);

	updateUiValues();

	// Loop through the height values and draw the map
	for (let x = 0; x < mapWidth; x++) {
		for (let y = 0; y < mapHeight; y++) {
			// Get the height value at this position
			let h = map[x][y];
			// Set the fill color based on the height value
			fill(255-h);
			if (h > caveThreshold) {
				// Draw a black rectangle for the cave structure
				fill(0);
			}
			// Draw a rectangle at this position on the map
			rect(x * scale, y * scale, scale, scale);
		}
	}
	// noLoop();
}

function updateUiValues(){
	scale 		  = ui.getScaleValue();
	caveThreshold = ui.getCaveThresholdValue();
}
