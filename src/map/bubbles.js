// Marching Squares Metaballs Interpolation
// Coding in the Cabana
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/challenges/coding-in-the-cabana/005-marching-squares.html
// https://youtu.be/0ZONMNUKTfU
// p5 port: https://editor.p5js.org/codingtrain/sketches/hEB4588QC
class Bubble {
	constructor(position , r) {
		this.r = r;
		this.direction = createVector(random(-1, 1), random(-1, 1))
		this.velocity = createVector(1, 1)
		this.position = position;
		this.friction = 0.02
		this.maxSpeed = 40
		this.charge = 1
		this.disChargeReady = true
	}

	show() {
		if(
			view.pointInView(this.position.x + this.r, this.position.y)
			|| view.pointInView(this.position.x - this.r, this.position.y)
			|| view.pointInView(this.position.x, this.position.y + this.r)
			|| view.pointInView(this.position.x, this.position.y - this.r)
		) {
			push()
			//view.translateToView();
			noFill();
			stroke(currentGameColor);
			// fill(255, 50);
			strokeWeight(2);
			circle(this.position.x, this.position.y, this.r*2);
			pop();
		}
	}

	update() {
		//this.show();
		if (this.charge <= 0){
			map2.bubbles.splice(map2.bubbles.indexOf(this), 1)
		}

		this.position.add(this.velocity.copy().mult(this.direction.copy()));

		if(this.velocity.x > 1){
			this.velocity.x *= (1-this.friction)
		}

		if(this.velocity.y > 1){
			this.velocity.y *= (1-this.friction)
		}

		for (let bubble of map2.bubbles){
			let distanceToPlayer = p5.Vector.sub(player.position, this.position)
			if (bubble === this && distanceToPlayer.mag() > this.r + 20){
				this.disChargeReady = true
			}
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


		// this collision check assums that the map is a rectangle
		// but it actually is a circle

		// this collision check assumes that the map is a circle

		let distanceFromCenter = p5.Vector.dist(this.position, map2.location);
		let mapRadius = map2.width / 2; // Assuming width and height are the same

		if (distanceFromCenter > mapRadius - this.r) {
			// put the bubble back inside the map by moving it towards the center
			this.position = p5.Vector.lerp(this.position, map2.location, 0.1);


			let normal = p5.Vector.sub(this.position, map2.location).normalize();
			this.direction.reflect(normal);
		}
	}
}
