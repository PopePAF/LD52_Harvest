
class MarchingSquaresMapGenerator{
	width;
	height;
	 field = [];
	 rez = 5;
	cols;
	rows;
	 increment;
	zoff = 0;
	zspeed;
	noise;

	lerp = true;

	bubbleCount;

	backgroundNoiseThreshold = 0.3;

	bubbles = [];

	color = color(255, 0, 0, 255);


	constructor(_width, _height, _rez, _lerp, _bubbleCount, color) {
		this.bubbleCount = _bubbleCount;
		this.width = _width;
		this.height = _height;
		this.rez = _rez;
		//this.lerp = Math.random() < 0.5;
		this.lerp = true;
		this.increment = random(-1, 1)
		this.zspeed = random(0.0001, 0.05);
		this.backgroundNoiseThreshold = random(-1, 1);
		this.color = color;

		this.noise = new OpenSimplexNoise(Date.now());
		this.cols = 1 + this.width / this.rez;
		this.rows = 1 + this.height / this.rez;
		for (let i = 0; i < this.cols; i++) {
			let k = [];
			for (let j = 0; j < this.rows; j++) {
				k.push(0);
			}
			this.field.push(k);
		}

		this.addBubbles(this.bubbleCount);


	}

	addBubbles(count){
		for (let i = 0; i < count; i++) {
			let spaceOccupied = false;
			let r;
			let position;

			do{
				spaceOccupied = false;
				r = random(25, 40);
				position = createVector(random(r, this.width - r), random(r, this.height - r));
				for(let bubble of this.bubbles){
					if(this.checkCircleColission(position, r, bubble.position, bubble.r)){
						spaceOccupied = true;
					}
				}
			}while(spaceOccupied);


			this.bubbles.push(new Bubble(position, r));
		}
	}

	checkCircleColission(position1, r1, position2, r2){
			let distance = p5.Vector.sub(position1, position2).mag()
			return distance <= r2 + r1;

	}


	drawLine(v1, v2) {
		// console.log("drowing line?")
		if(camera.lineInView(v1.x, v1.y, v2.x, v2.y)){
			// console.log("line in view")
			let length = dist(v1.x,v1.y,v2.x,v2.y);
			push();
				camera.translateToView();
				if(length<50){
					line(v1.x, v1.y, v2.x, v2.y);
				}
			pop();
		}

	}

	drawEllipse(x, y, r, color){
		if(camera.pointInView(x, y)){
			// console.log("line in view")
			push();
			camera.translateToView();
			noStroke();
			fill(color);
			ellipse(x, y, r, r);
			pop();
		}
	}

	displayBorders(color){
		push();
			camera.translateToView();
			noFill();
			rectMode(CORNER)
			rect(0, 0, this.width, this.height);
		pop();
	}

	displayBorders2(color){
		push();
		camera.translateToView();
		noFill();
		ellipseMode(CORNER)
		ellipse(0, 0, this.width+10, this.height+10);
		pop();
	}

	displayBorders3(color){
		push();
		camera.translateToView();
		noFill();
		ellipseMode(CORNER);

		let centerX = this.width / 2;
		let centerY = this.height / 2;
		let radius = Math.min(this.width, this.height) / 2;

		let playerX = player.position.x;
		let playerY = player.position.y;
		let playerRadius = player.size * 4;

		let intersections = this.getCircleCircleIntersections(
			createVector(centerX, centerY),
			radius,
			createVector(playerX, playerY),
			playerRadius
		);

		let startAngle = 0;
		let endAngle = TWO_PI;

		if (intersections.length === 2) {
			startAngle = atan2(intersections[0].y - centerY, intersections[0].x - centerX);
			endAngle = atan2(intersections[1].y - centerY, intersections[1].x - centerX);


			// TODO: Add some effects on those intersection points
			// some sparks, lighning style lines...
			this.drawSparks(intersections[0].x, intersections[0].y, 0.5);
			this.drawSparks(intersections[1].x, intersections[1].y, 0.5);

		}
		arc(0, 0, radius * 2, radius * 2, endAngle, startAngle);

		pop();
	}

	drawSparks(x, y, intensity) {
		push();
		stroke(this.color); // Yellow color for sparks
		strokeWeight(2);
		let centerX = this.width / 2;
		let centerY = this.height / 2;
		//let baseAngle = atan2(y - centerY, x - centerX);
		let baseAngle = 0;
		for (let i = 0; i < 10; i++) {
			let angle = random(0, TWO_PI); // Add some random variation
			let length = random(10, 20) * intensity; // Adjust length based on intensity
			let x2 = x + cos(angle) * length;
			let y2 = y + sin(angle) * length;
			line(x, y, x2, y2);
		}
		pop();
	}
	display(){
		this.displayBorders();
		let xoff = 0;
		for (let i = 0; i < this.cols; i++) {
			xoff += this.increment;
			let yoff = 0;
			for (let j = 0; j < this.rows; j++) {
				let x = i * this.rez;
				let y = j * this.rez;


				// BUBBLE INTERFERENCE
				let sum = 0;
				let charge = 0;
				let bubbleShine = 0;
				for (let b of this.bubbles) {
					bubbleShine += (b.r * b.r) / ((x - b.position.x) * (x - b.position.x) + (y - b.position.y) * (y - b.position.y));
					sum += (b.r * b.r) / ((x - b.position.x) * (x - b.position.x) + (y - b.position.y) * (y - b.position.y));
					if (b.charge > charge && b.r * b.r > ((x - b.position.x) * (x - b.position.x) + (y - b.position.y) * (y - b.position.y))){
						charge = b.charge
					}
				}

				// PLAYER INTERFERENCE
				let shadowRadius = player.size * 5;
				let playerShadow = 0;
				if(this.checkpointInElippse(player.position.x, player.position.y, x, y, shadowRadius, shadowRadius) < 1){
					 playerShadow = random(0, 0.6) * (shadowRadius * shadowRadius) / ((x - player.position.x) * (x - player.position.x) + (y - player.position.y) * (y - player.position.y));
				}

				let noiseVal = float(this.noise.noise3D(xoff, yoff, this.zoff)) + sum - playerShadow;
				noiseVal = constrain(noiseVal, -1, 1)

				console.group(noiseVal)

				let fieldColor = color(
					red(this.color),
					green(this.color),
					blue(this.color),
					min(255 * noiseVal, 255)
				)
				this.field[i][j] = {color: fieldColor , noiseVal: noiseVal}

				//this.field[i][j] = {noiseVal: float(this.noise.noise3D(xoff, yoff, this.zoff)) + sum, charge: charge}

				yoff += this.increment;
			}
		}
		this.zoff += this.zspeed;

		for (let b of this.bubbles) {
			b.update();
			// b.show();
		}

		for (let i = 0; i < this.cols-1 ; i++) {
			for (let j = 0; j < this.rows-1; j++) {
				let x = i * this.rez
				let y = j * this.rez

				let noiseVal = this.field[i][j].noiseVal;
				// if(noiseVal<0){
				// 	let currentColor = color(0, this.field[i][j] * -255, 0);
				// 	this.drawEllipse(x, y, this.rez,currentColor);
				// }

				if(noiseVal > this.backgroundNoiseThreshold){
					let currentColor = this.field[i][j].color
					//currentColor.alpha = noiseVal*255;
					ellipseMode(CORNER)
					this.drawEllipse(x, y, this.rez,currentColor);

					//this.drawEllipse(x, y, this.rez, this.color);
				}


				if(!camera.pointInView(x, y)){
					continue;
				}

				let state = this.getState(
					ceil(this.field[i][j].noiseVal),
					ceil(this.field[i + 1][j].noiseVal),
					ceil(this.field[i + 1][j + 1].noiseVal),
					ceil(this.field[i][j + 1].noiseVal)
				);

				let a_val = this.field[i][j].noiseVal + 1;
				let b_val = this.field[i + 1][j].noiseVal + 1;
				let c_val = this.field[i + 1][j + 1].noiseVal + 1;
				let d_val = this.field[i][j + 1].noiseVal + 1;

				let a = createVector();
				let amt;

				if(this.lerp){
					amt = (1 - a_val) / (b_val - a_val);
					a.x = lerp(x, x + this.rez, amt);
				}else{
					a.x = x;
				}
				a.y = y;

				let b = createVector();
				if(this.lerp){
					amt = (1 - b_val) / (c_val - b_val);
					b.y = lerp(y, y + this.rez, amt);
				}else{
					b.y = y;
				}
				b.x = x + this.rez;

				let c = createVector();
				if(this.lerp){
					amt = (1 - d_val) / (c_val - d_val);
					c.x = lerp(x, x + this.rez, amt);
				}else{
					c.x = x;
				}
				c.y = y + this.rez;

				let d = createVector();
				if(this.lerp){
					amt = (1 - a_val) / (d_val - a_val);
					d.y = lerp(y, y + this.rez, amt);
				}else{
					d.y = y;
				}
				d.x = x;

				stroke(this.color);
				strokeWeight(2);
				//color(random(255))
				// state = 0;
				switch (state) {
					case 1:
						this.drawLine(c, d);
						break;
					case 2:
						this.drawLine(b, c);
						break;
					case 3:
						this.drawLine(b, d);
						break;
					case 4:
						this.drawLine(a, b);
						break;
					case 5:
						this.drawLine(a, d);
						this.drawLine(b, c);
						break;
					case 6:
						this.drawLine(a, c);
						break;
					case 7:
						this.drawLine(a, d);
						break;
					case 8:
						this.drawLine(a, d);
						break;
					case 9:
						this.drawLine(a, c);
						break;
					case 10:
						this.drawLine(a, b);
						this.drawLine(c, d);
						break;
					case 11:
						this.drawLine(a, b);
						break;
					case 12:
						this.drawLine(b, d);
						break;
					case 13:
						this.drawLine(b, c);
						break;
					case 14:
						this.drawLine(c, d);
						break;
				}
			}
		}
/*
		if(this.bubbles.length === 0){
			player.waypoint = createVector(this.width*1.5+width, this.height/2)
			if(player.position.x > this.width+width/2){
				let newX = -width/2;
				player.position.x = newX;
				if(player.tentacles.main){
					player.tentacles.main.endPos.x -= (width+this.width);
				}
				if(player.tentacles.smallOne){
					player.tentacles.smallOne.endPos.x = (width+this.width);
				}


				player.waypoint = createVector(map2.width/2, map2.height/2);
				this.addBubbles(5)
				this.increment = random(-1, 1);
			}
		}
		*/
	}

	display2() {
		this.displayBorders3();
		let xoff = 0;
		let centerX = this.width / 2;
		let centerY = this.height / 2;
		let radius = Math.min(this.width, this.height) / 2;

		for (let i = 0; i < this.cols; i++) {
			xoff += this.increment;
			let yoff = 0;
			for (let j = 0; j < this.rows; j++) {
				let x = i * this.rez;
				let y = j * this.rez;
				let distanceFromCenter = dist(x, y, centerX, centerY);

				if (distanceFromCenter > radius) {
					continue;
				}

				// Normalize the distance to a range of 0 to 1
				let normalizedDistance = distanceFromCenter / radius;


				// Calculate the value
				//let edgeValue = 255 * normalizedDistance;

				// Ensure the value is within the range of 0 to 255

				// BUBBLE INTERFERENCE
				let sum = 0;
				let charge = 0;
				let bubbleShine = 0;
				for (let b of this.bubbles) {
					bubbleShine += (b.r * b.r) / ((x - b.position.x) * (x - b.position.x) + (y - b.position.y) * (y - b.position.y));
					sum += (b.r * b.r) / ((x - b.position.x) * (x - b.position.x) + (y - b.position.y) * (y - b.position.y));
					if (b.charge > charge && b.r * b.r > ((x - b.position.x) * (x - b.position.x) + (y - b.position.y) * (y - b.position.y))) {
						charge = b.charge;
					}
				}

				// PLAYER INTERFERENCE
				let shadowRadius = player.size * 5;
				let playerShadow = 0;
				if (this.checkpointInElippse(player.position.x, player.position.y, x, y, shadowRadius, shadowRadius) < 1) {
					playerShadow = random(0, 0.6) * (shadowRadius * shadowRadius) / ((x - player.position.x) * (x - player.position.x) + (y - player.position.y) * (y - player.position.y));
				}

				let noiseVal = (float(this.noise.noise3D(xoff, yoff, this.zoff)) + sum - playerShadow);
				noiseVal = constrain(noiseVal, -1, 1);

				let fieldColor = color(
					red(this.color),
					green(this.color),
					blue(this.color),
					min(255 * noiseVal, 255)
				);
				this.field[i][j] = { color: fieldColor, noiseVal: noiseVal };

				yoff += this.increment;
			}
		}
		this.zoff += this.zspeed;

		for (let b of this.bubbles) {
			b.update();
		}

		for (let i = 0; i < this.cols - 1; i++) {
			for (let j = 0; j < this.rows - 1; j++) {
				let x = i * this.rez;
				let y = j * this.rez;
				let distanceFromCenter = dist(x, y, centerX, centerY);

				if (distanceFromCenter > radius) {
					continue;
				}

				let noiseVal = this.field[i][j].noiseVal;

				if (noiseVal > this.backgroundNoiseThreshold) {
					let currentColor = this.field[i][j].color;
					ellipseMode(CORNER);
					this.drawEllipse(x, y, this.rez, currentColor);
				}

				if (!camera.pointInView(x, y)) {
					continue;
				}

				let state = this.getState(
					ceil(this.field[i][j].noiseVal),
					ceil(this.field[i + 1][j].noiseVal),
					ceil(this.field[i + 1][j + 1].noiseVal),
					ceil(this.field[i][j + 1].noiseVal)
				);

				let a_val = this.field[i][j].noiseVal + 1;
				let b_val = this.field[i + 1][j].noiseVal + 1;
				let c_val = this.field[i + 1][j + 1].noiseVal + 1;
				let d_val = this.field[i][j + 1].noiseVal + 1;

				let a = createVector();
				let amt;

				if (this.lerp) {
					amt = (1 - a_val) / (b_val - a_val);
					a.x = lerp(x, x + this.rez, amt);
				} else {
					a.x = x;
				}
				a.y = y;

				let b = createVector();
				if (this.lerp) {
					amt = (1 - b_val) / (c_val - b_val);
					b.y = lerp(y, y + this.rez, amt);
				} else {
					b.y = y;
				}
				b.x = x + this.rez;

				let c = createVector();
				if (this.lerp) {
					amt = (1 - d_val) / (c_val - d_val);
					c.x = lerp(x, x + this.rez, amt);
				} else {
					c.x = x;
				}
				c.y = y + this.rez;

				let d = createVector();
				if (this.lerp) {
					amt = (1 - a_val) / (d_val - a_val);
					d.y = lerp(y, y + this.rez, amt);
				} else {
					d.y = y;
				}
				d.x = x;

				stroke(this.color);
				strokeWeight(2);
				switch (state) {
					case 1:
						this.drawLine(c, d);
						break;
					case 2:
						this.drawLine(b, c);
						break;
					case 3:
						this.drawLine(b, d);
						break;
					case 4:
						this.drawLine(a, b);
						break;
					case 5:
						this.drawLine(a, d);
						this.drawLine(b, c);
						break;
					case 6:
						this.drawLine(a, c);
						break;
					case 7:
						this.drawLine(a, d);
						break;
					case 8:
						this.drawLine(a, d);
						break;
					case 9:
						this.drawLine(a, c);
						break;
					case 10:
						this.drawLine(a, b);
						this.drawLine(c, d);
						break;
					case 11:
						this.drawLine(a, b);
						break;
					case 12:
						this.drawLine(b, d);
						break;
					case 13:
						this.drawLine(b, c);
						break;
					case 14:
						this.drawLine(c, d);
						break;
				}
			}
		}
	}

	checkpointInElippse(h , k , x , y , a , b)
	{
		return Math.pow((x - h), 2) / Math.pow(a, 2) + Math.pow((y - k), 2) / Math.pow(b, 2);
	}

	getState(a, b, c, d) {
		return a * 8 + b * 4 + c * 2 + d * 1;
	}

	getLineCircleIntersections(p1, p2, cpt, r) {
		let x1 = p1.copy().sub(cpt);
		let x2 = p2.copy().sub(cpt);

		let dv = x2.copy().sub(x1)
		let dr = dv.mag();
		let D = x1.x * x2.y - x2.x * x1.y;

		// evaluate if there is an intersection
		let di = r * r * dr * dr - D * D;
		if (di < 0.0) {
			return [];
		}

		let t = sqrt(di);

		let ip = [];
		ip.push(new p5.Vector(D * dv.y + Math.sign(dv.y) * dv.x * t, -D * dv.x + abs(dv.y) * t).div(dr * dr).add(cpt));
		if (di > 0.0) {
			ip.push(new p5.Vector(D * dv.y - Math.sign(dv.y) * dv.x * t, -D * dv.x - abs(dv.y) * t).div(dr * dr).add(cpt));
		}

		push();
		for (let p of ip) {
			stroke('lime');
			strokeWeight(8);
			point(p.x, p.y);
		}
		pop();

		return ip.filter(p => p.x >= p1.x && p.x <= p2.x);
	}

	getCircleCircleIntersections(c1, r1, c2, r2) {
		let d = dist(c1.x, c1.y, c2.x, c2.y);

		// No intersection if the circles are too far apart or one is contained within the other
		if (d > r1 + r2 || d < abs(r1 - r2)) {
			return [];
		}

		let a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
		let h = sqrt(r1 * r1 - a * a);

		let p2 = createVector(
			c1.x + a * (c2.x - c1.x) / d,
			c1.y + a * (c2.y - c1.y) / d
		);

		let intersection1 = createVector(
			p2.x + h * (c2.y - c1.y) / d,
			p2.y - h * (c2.x - c1.x) / d
		);

		let intersection2 = createVector(
			p2.x - h * (c2.y - c1.y) / d,
			p2.y + h * (c2.x - c1.x) / d
		);

		/*
		push();
			stroke('lime');
			strokeWeight(8);
			point(intersection1.x, intersection1.y);
			point(intersection2.x, intersection2.y);
		pop();
		*/
		return [intersection1, intersection2];
	}
}
