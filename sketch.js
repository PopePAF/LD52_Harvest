// Set the dimensions of the map
// import {UI} from "./src/utility/debugUiManager.js";
let map;
let map2;

let camera;

let lastMillis;

let player

let noise;

let imgs = [];

function preload(){

}

function setup() {
	createCanvas(600, 600, WEBGL);
	noise = new OpenSimplexNoise(Date.now());
	camera = new View(0, 0, width, height)

	// map = new Map(300, 300, 16, 20)
	map2 = new MarchingSquaresMapGenerator(width*2, height*2, 15, true);
	// player = new Player({x: map.width/2 * map.scale, y:map.height/2 * map.scale})

	player = new Player({x: map2.rows/2 * map2.rez, y:map2.cols/2 * map2.rez})
	frameRate(60)
}

function draw() {

	background(0)

	let delta = millis() - lastMillis;
	lastMillis = millis();

	if (player.tentacles.smallOne && millis() % 1000 <= 50 && !(millis() % 3000 <= 50)){
		player.releaseSmallTentacle()

	} else if (millis() % 3000 <= 50 && !player.tentacles.main && !player.tentacles.smallOne){
		player.shootSmallTentacle()
	}

	player.update()
	camera.update(delta, player.position, player.velocity, 1.2);

	translate(-width/2,-height/2,0);


	player.draw()
	map2.display();




	if(frameCount % 5 === 0){
		// fill(255, 255, 0)
		// noStroke();
		// textSize(36);
		// textFont("Georgia");
		// text(Math.floor(frameRate()), 10, 10)
		// stroke(0)
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
