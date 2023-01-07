// Set the dimensions of the map
const mapWidth = 100;
const mapHeight = 100;

// Set the scaling factor for the noise function
let scaleSlider;
let scale = 5;

// Set the threshold for drawing cave structures
let caveSlider;
let caveThreshold = 128;

// Create a 2D array to store the height values
let map = [];
let button;
function setup() {
	scaleSlider = createSlider(5, 50, 5);
	scaleSlider.position(10, 25);
	scaleSlider.style('width', '80px');

	caveSlider = createSlider(0, 255, 100);
	caveSlider.position(10, 50);
	caveSlider.style('width', '80px');

	button = createButton('refresh');
	button.position(0, 0);
	button.mousePressed(refreshMap);
	refreshMap();
	createCanvas(mapWidth * scale, mapHeight * scale);


	// Generate the height values using noise()
	// for (let x = 0; x < mapWidth; x++) {
	// 	for (let y = 0; y < mapHeight; y++) {
	// 		// Use noise() to generate a value between 0 and 1
	// 		let noiseVal = noise(x / scale, y / scale);
	// 		// Scale the noise value to a range between 0 and 255
	// 		heights[x][y] = noiseVal * 255;
	// 	}
	// }
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
}

function draw() {
	frameRate(1);

	scale = scaleSlider.value();
	caveThreshold = caveSlider.value();

	background(0);

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
