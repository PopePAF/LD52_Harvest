class FleshPlant extends Tile{

    render(){
        if(camera.rectInView(this.location.x, this.location.y, this.scale, this.scale)){
            push();
            camera.translateToView();
            //translate(this.location.x, this.location.y);
            noStroke();
            fill(255,100,100)
            circle(this.location.x, this.location.y, this.scale)
            pop();
        }

    }
}