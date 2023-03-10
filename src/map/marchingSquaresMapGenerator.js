
class MarchingSquaresMapGenerator{
	width;
	height;
	 field = [];
	 rez = 5;
	cols;
	rows;
	 increment = 0.1;
	zoff = 0;
	noise;

	lerp = true;

	bubbleCount;


	bubbles = [];


	constructor(_width, _height, _rez, _lerp, _bubbleCount) {
		this.bubbleCount = _bubbleCount;
		this.width = _width;
		this.height = _height;
		this.rez = _rez;
		this.lerp = _lerp;

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
				position = createVector(random(r, width - r), random(r, height - r));
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
	display(){
		this.displayBorders();
		let xoff = 0;
		for (let i = 0; i < this.cols; i++) {
			xoff += this.increment;
			let yoff = 0;
			for (let j = 0; j < this.rows; j++) {
				let sum = 0;
				let charge = 0;
				let x = i * this.rez;
				let y = j * this.rez;
				let bubbleShine = 0;
				for (let b of this.bubbles) {
					bubbleShine += (b.r * b.r) / ((x - b.position.x) * (x - b.position.x) + (y - b.position.y) * (y - b.position.y));
					sum += (b.r * b.r) / ((x - b.position.x) * (x - b.position.x) + (y - b.position.y) * (y - b.position.y));
					if (b.charge > charge && b.r * b.r > ((x - b.position.x) * (x - b.position.x) + (y - b.position.y) * (y - b.position.y))){
						charge = b.charge
					}
				}

				let shadowRadius = player.size * 5;
				let playerShadow = 0;
				if(this.checkpointInElippse(player.position.x, player.position.y, x, y, shadowRadius, shadowRadius) < 1){

					 playerShadow = random(0, 0.6) * (shadowRadius * shadowRadius) / ((x - player.position.x) * (x - player.position.x) + (y - player.position.y) * (y - player.position.y));

				}
				// let noiseValue = float(this.noise.noise3D(xoff, yoff, this.zoff))-playerShadow+bubbleShine


				// this.field[i][j] = float(this.noise.noise3D(xoff, yoff, this.zoff)) + bubbleShine - playerShadow;
				let noiseVal = float(this.noise.noise3D(xoff, yoff, this.zoff)) + sum - playerShadow;
				noiseVal = constrain(noiseVal, -1, 1)
				this.field[i][j] = {color: color((noiseVal * 255), charge * (noiseVal * 255), charge * (noiseVal * 150), 255*noiseVal), noiseVal: noiseVal}


				//this.field[i][j] = {noiseVal: float(this.noise.noise3D(xoff, yoff, this.zoff)) + sum, charge: charge}


				yoff += this.increment;
			}
		}
		this.zoff += 0.001;

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

				if(noiseVal > 0.3){
					let currentColor = this.field[i][j].color
					currentColor.alpha = noiseVal*255;
					ellipseMode(CORNER)
					this.drawEllipse(x, y, this.rez,currentColor);
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

				stroke(255, 0, 0);
				strokeWeight(2);
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
			}
		}
	}

	checkpointInElippse(h , k , x , y , a , b)
	{

		// checking the equation of
		// ellipse with the given point
		let p = Math.pow((x - h), 2) / Math.pow(a, 2)
			+ Math.pow((y - k), 2) / Math.pow(b, 2);

		return p;
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
}
