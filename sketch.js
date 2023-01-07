let player

function setup() {
	createCanvas(1000, 600);
	player = new Player({x: width/2, y:height/2})

	frameRate(20)
}

function draw() {
	background(200);
	player.update()
	player.draw()

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
