// Marching Squares Metaballs Interpolation
// Coding in the Cabana
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/challenges/coding-in-the-cabana/005-marching-squares.html
// https://youtu.be/0ZONMNUKTfU
// p5 port: https://editor.p5js.org/codingtrain/sketches/hEB4588QC
class Bubble {
	constructor() {
		this.r = random(40, 60);
		this.direction = createVector(random([-1, 1]), random([-1, 1]))
		this.velocity = createVector(1, 1)
		this.position = createVector(random(this.r, width - this.r), random(this.r, height - this.r))
		this.friction = 0.02
		this.maxSpeed = 40
	}

	show() {
		if(camera.pointInView(this.position.x + this.r, this.position.y) || camera.pointInView(this.position.x - this.r, this.position.y) || camera.pointInView(this.position.x, this.position.y + this.r) || camera.pointInView(this.position.x, this.position.y - this.r)) {
			push()
			camera.translateToView();
			noFill();
			stroke(255);
			// fill(255, 50);
			strokeWeight(2);
			circle(this.position.x, this.position.y, this.r * 2);
			pop();
		}



	}

	update() {
		this.position.add(this.velocity.copy().mult(this.direction.copy()))

		if(this.velocity.x > 1){
			this.velocity.x *= (1-this.friction)
		}

		if(this.velocity.y > 1){
			this.velocity.y *= (1-this.friction)
		}

		for (let bubble of map2.bubbles){
			if (bubble !== this){
				let distance = p5.Vector.sub(bubble.position, this.position)
				if (distance.mag() <= this.r + bubble.r){
					this.velocity.set(p5.Vector.add(bubble.velocity, this.velocity).div(2))
					bubble.velocity.set(p5.Vector.add(bubble.velocity, this.velocity).div(2))

					this.velocity.limit(this.maxSpeed)

					this.direction.set(distance.x / ((Math.abs(distance.x)) * -1), distance.y / ((Math.abs(distance.y)) * -1))
				}
			}
		}


		if (this.position.x > map2.width - this.r) {
			this.direction.x = -1
		}
		if (this.position.x < this.r){
			this.direction.x = 1
		}
		if (this.position.y > map2.height - this.r) {
			this.direction.y = -1;
		}
		if (this.position.y < this.r){
			this.direction.y = 1
		}
	}
}
