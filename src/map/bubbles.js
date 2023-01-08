// Marching Squares Metaballs Interpolation
// Coding in the Cabana
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/challenges/coding-in-the-cabana/005-marching-squares.html
// https://youtu.be/0ZONMNUKTfU
// p5 port: https://editor.p5js.org/codingtrain/sketches/hEB4588QC
class Bubble {
	constructor(position , r) {
		this.r = r;
		this.direction = createVector(random([-1, 1]), random([-1, 1]))
		this.velocity = createVector(1, 1)
		this.position = position;
		this.friction = 0.02
		this.maxSpeed = 40
		this.charge = 0
		this.disChargeRate = 0.02
	}

	show() {
		// if(camera.pointInView(this.position.x + this.r, this.position.y) || camera.pointInView(this.position.x - this.r, this.position.y) || camera.pointInView(this.position.x, this.position.y + this.r) || camera.pointInView(this.position.x, this.position.y - this.r)) {
		// 	push()
		// 	camera.translateToView();
		// 	noFill();
		// 	stroke(255);
		// 	// fill(255, 50);
		// 	strokeWeight(2);
		// 	circle(this.position.x, this.position.y, this.r * 2);
		// 	pop();
		// }
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
					if (bubble.charge < 0.5 && this.charge > 0){
						bubble.charge = 0.5
					}
					this.velocity.set(p5.Vector.add(bubble.velocity, this.velocity).div(2))
					bubble.velocity.set(p5.Vector.add(bubble.velocity, this.velocity).div(2))

					this.velocity.limit(this.maxSpeed)

					this.direction.set(distance.x / ((Math.abs(distance.x)) * -1), distance.y / ((Math.abs(distance.y)) * -1))
				}
			}
		}

		for (let bubbleC of map2.bubbleCollectibles){
			let distance = p5.Vector.sub(bubbleC.position, this.position)
			if (distance.mag() <= this.r + bubbleC.r){
				if (this.charge > 0){
					map2.bubbleCollectibles.splice(map2.bubbleCollectibles.indexOf(bubbleC), 1)
					map2.placeBubbleCollectible()
					if(player.healthPerc <= 0.8){
						player.healthPerc += 0.2
					}else if (player.healthPerc < 1){
						player.healthPerc += (1 - player.healthPerc)
					}
					score += 200
				}else {
					this.velocity.set(p5.Vector.add(bubbleC.velocity, this.velocity).div(2))
					bubbleC.velocity.set(p5.Vector.add(bubbleC.velocity, this.velocity).div(4).mult(3))

					this.velocity.limit(this.maxSpeed)

					this.direction.set(distance.x / ((Math.abs(distance.x)) * -1), distance.y / ((Math.abs(distance.y)) * -1))
				}
			}


		}

		if (this.charge > 0){
			this.charge -= this.disChargeRate
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
