class UI {
	scaleSlider;
	caveSlider;

	refreshButton;


	constructor() {
		this.scaleSlider = createSlider(5, 50, 5);
		this.scaleSlider.position(10, 25);
		this.scaleSlider.style('width', '80px');

		this.caveSlider = createSlider(0, 255, 100);
		this.caveSlider.position(10, 50);
		this.caveSlider.style('width', '80px');

		this.refreshButton = createButton('refresh');
		this.refreshButton.position(0, 0);
		this.refreshButton.mousePressed(refreshMap);
	}

	getScaleValue(){
		return this.scaleSlider.value();
	}

	getCaveThresholdValue(){
		return this.caveSlider.value();
	}
}
