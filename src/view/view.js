/**

  To find out if in view use:
    camera.inView(PVector)
  or
    camera.inView(PVector, w, h)

  To apply camera translation use:
    camera.translateToView()


 */

class View {

	location;
	offset;
	width;
	height;

	constructor(x, y, w, h) {
		this.location = createVector(x, y);
		this.width = w;
		this.height = h;
		this.offset = createVector(this.width/2, this.height/2);
}

 update(delta, location, velocity, offsetFactor=1) {
		this.location = location;
		// this.offset.set(this.width/2 - velocity.x * this.width/4, this.height/2 - velocity.y * this.height/4, 0);
	 	this.offset.set(this.width/2 - velocity.x * offsetFactor, this.height/2 - velocity.y * offsetFactor, 0);
	}

	vectorInView(v) {
		return this.pointInView(v.x, v.y);
	}

	pointInView(x,  y) {
		if(x >=  this.location.x - this.offset.x && x <= this.location.x + this.width - this.offset.x) {
			if(y >=  this.location.y - this.offset.y && y <= this.location.y + this.width - this.offset.y) {
				return true;
			}
		}
		return false;
	}


	rectInView(x, y, w,  h) {
		return this.pointInView(x, y) || this.pointInView(x + w, y) || this.pointInView(x, y + h) || this.pointInView(x + w, y + h);
	}


	translateToView() {
		translate(-this.location.x + this.offset.x, -this.location.y + this.offset.y);
	}

}
