
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


	bubbles = [];


	constructor(_width, _height, _rez, _lerp) {
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

		for (let i = 0; i < 3; i++) {
			this.bubbles.push(new Bubble());
		}


	}

	drawLine(v1, v2) {
		// console.log("drowing line?")
		if(camera.lineInView(v1.x, v1.y, v2.x, v2.y)){
			// console.log("line in view")
			push();
				camera.translateToView();
				stroke(255)
				strokeWeight(1)
				line(v1.x, v1.y, v2.x, v2.y);
			pop();
		}

	}

	display(){

		let xoff = 0;
		for (let i = 0; i < this.cols; i++) {
			xoff += this.increment;
			let yoff = 0;
			for (let j = 0; j < this.rows; j++) {
				let sum = 0;
				let x = i * this.rez;
				let y = j * this.rez;
				for (let b of this.bubbles) {
					sum += (b.r * b.r) / ((x - b.x) * (x - b.x) + (y - b.y) * (y - b.y));
				}
				this.field[i][j] = float(this.noise.noise3D(xoff, yoff, this.zoff)) - sum;
				yoff += this.increment;
			}
		}
		this.zoff += 0.001;

		for (let b of this.bubbles) {
			b.update();
			b.show();
		}

		for (let i = 0; i < this.cols - 1; i++) {
			for (let j = 0; j < this.rows - 1; j++) {
				let x = i * this.rez;
				let y = j * this.rez;

				if(!camera.pointInView(x, y)){
					continue;
				}

				let state = this.getState(
					ceil(this.field[i][j]),
					ceil(this.field[i + 1][j]),
					ceil(this.field[i + 1][j + 1]),
					ceil(this.field[i][j + 1])
				);

				let a_val = this.field[i][j] + 1;
				let b_val = this.field[i + 1][j] + 1;
				let c_val = this.field[i + 1][j + 1] + 1;
				let d_val = this.field[i][j + 1] + 1;

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

				stroke(255);
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
