
class Map {
	width = 0;
	height = 0;

	scale = 0;

	caveThreshold;

	tiles = [];

	constructor(_width, _height, _scale, _caveThreshold) {
		this.width = _width;
		this.height = _height;
		this.scale = _scale;
		this.caveThreshold = _caveThreshold;
		this.refresh();
	}

	refresh(){

		noiseSeed(random(1, 10000));
		this.tiles = [];
		for (let x = 0; x < this.width; x++) {
			this.tiles[x] = [];
			for (let y = 0; y < this.height; y++) {
				let noiseVal = noise(5000 + x / this.scale, 5000 + y / this.scale) * 255;

				let newTile;
				if(noiseVal < this.caveThreshold){
					newTile = new Wall(x, y,this.scale, noiseVal);
				}else{
					newTile = new Empty(x, y, this.scale, noiseVal);
				}

				this.tiles[x][y] = newTile;
			}
		}
		// console.log("refresh", this.tiles);
	}

	render(){
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				// Get the height value at this position
				this.tiles[x][y].render();
			}
		}
	}

}

class Tile {
	location;
	noiseValue;
	scale;

	constructor(x, y, scale, noiseValue) {
		this.location = createVector(x*scale, y*scale);
		this.noiseValue = noiseValue;
		this.scale = scale;
	}

	render(){}
}

class Wall extends Tile {
	render(){
		if(camera.vectorInView(this.location)){
			push();
				camera.translateToView();
				translate(this.location.x, this.location.y);
				noFill();
				rectMode(CENTER)
				// stroke(1)
				rect(0, 0, this.scale, this.scale);
			pop();
			// rect(this.location.x * this.scale, this.location.y * this.scale, this.scale, this.scale);
		}else{

		}

	}
}

class Empty extends Tile {
	render(){
	}
}