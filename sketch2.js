let camera;

function preload(){
	gameSong = loadSound('assets/ingame.mp3', null, null);
}

function setup() {
	frameRate(120)
	noCursor();
	ellipseMode(CENTER);
	rectMode(CENTER);

	canvasWidth = windowWidth;
	canvasHeight = windowHeight;

	createCanvas(canvasWidth, canvasHeight);
	player = {position:{x: 0, y: 0}, velocity: {x: 0, y: 0}};
	world = {position: {x: 100, y: 0}, r: 10};
	camera = new View(player.position.x, player.position.y, width, height)
}

function draw() {
	background(0)

	player.position.x += player.velocity.x;
	player.position.y += player.velocity.y;

	camera.update(player.position, player.velocity, 1);

	push()
		camera.translateToView();

		// Draw the Player
		ellipse(player.position.x, player.position.y, 50, 50);

		// Draw the World
		ellipse(world.position.x, world.position.y, world.r * 2);
	pop()
}

// wasd movemt for plyer
function keyPressed(){
	if(keyCode == 87){
		player.velocity.y -= 1;
	}else if(keyCode == 83){
		player.velocity.y += 1;
	}else if(keyCode == 65){
		player.velocity.x -= 1;
	}else if(keyCode == 68){
		player.velocity.x += 1;
	}
}
