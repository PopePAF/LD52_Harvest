
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

	solidBorder(){
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				if(x === 0 || y === 0 || x === this.width-1 || y === this.height-1){
					this.tiles[x][y] = new Wall(x, y,this.scale, 255);
				}
			}
		}
	}

	refresh(){

		noiseSeed(random(1, 10000));
		this.tiles = [];
		for (let x = 0; x < this.width; x++) {
			this.tiles[x] = [];
			for (let y = 0; y < this.height; y++) {
				let noiseVal = noise.noise2D(5000 + x / this.scale, 5000 + y / this.scale) * 255;
				// let noiseVal = noise(5000 + x / this.scale, 5000 + y / this.scale) * 255;

				let newTile;
				if(noiseVal < this.caveThreshold){
					newTile = new Wall(x, y,this.scale, noiseVal);
				}else{
					newTile = new Empty(x, y, this.scale, noiseVal);
				}

				this.tiles[x][y] = newTile;
			}
		}
		this.solidBorder();
		this.genCollectibles();
		// console.log("refresh", this.tiles);
	}

	render(){
		// for (let x = 0; x < this.width; x++) {
		// 	for (let y = 0; y < this.height; y++) {
		// 		// Get the height value at this position
		// 		let tile = this.tiles[x][y];
		// 		if(tile instanceof Wall){
		// 			tile.render();
		// 		}
		//
		// 	}
		// }

		let walls = this.getWalls();
		let collectibles = this.getCollectibles();
		for(let i = 0; i < walls.length; i++){
			walls[i].render();
		}
		for (let i=0; i < collectibles.length; i++){
			collectibles[i].render()
		}
	}

	getWalls(){
		let walls = [];
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				// Get the height value at this position
				let tile = this.tiles[x][y];
				if(tile instanceof Wall){
					walls.push(tile);
				}
			}
		}

		return walls;
	}

	getCollectibles(){
		let collectibles = [];
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				// Get the height value at this position
				let tile = this.tiles[x][y];
				if(tile instanceof FleshPlant){
					collectibles.push(tile);
				}
			}
		}
		//console.log(collectibles)
		return collectibles;
	}

	genCollectibles(){
		let empties = [];
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				// Get the height value at this position
				let tile = this.tiles[x][y];
				if(tile instanceof Empty){
					empties.push(tile);
				}
			}
		}

		for (let i=0; i<100; i++){
			let randomEmpty = empties[Math.floor(Math.random() * empties.length)]
			this.tiles[randomEmpty.location.x / randomEmpty.scale][randomEmpty.location.y / randomEmpty.scale] = new FleshPlant(randomEmpty.location.x / randomEmpty.scale, randomEmpty.location.y / randomEmpty.scale, this.scale, randomEmpty.noiseValue)
			empties.splice(empties.indexOf(randomEmpty), 1)
			console.log(this.tiles[randomEmpty.location.x / randomEmpty.scale][randomEmpty.location.y / randomEmpty.scale])
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
		if(camera.rectInView(this.location.x, this.location.y, this.scale, this.scale)){
			push();
				camera.translateToView();
				translate(this.location.x, this.location.y);
				noStroke();
				fill(0,0,0)
				rect(0, 0, this.scale, this.scale);
			pop();
		}
	}
}

class Empty extends Tile {
	render(){}
}
