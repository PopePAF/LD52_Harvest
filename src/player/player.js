class Player{

    constructor(initPos) {
        this.position = createVector(initPos.x, initPos.y);
        this.size = 5
        this.color = color(255, 0, 0)
        this.activeTentacle = null
        this.velocity = createVector()
        this.acc = createVector()
        this.friction = 0.92
        this.range = 50
        this.speedLimit = 1
        this.targetVector = createVector(initPos.x, initPos.y)
    }

    draw(){
        push()
            camera.translateToView()
            //translate(this.position.x, this.position.y);
            fill(this.color)
            rectMode(CENTER)
            square(this.position.x, this.position.y, this.size)
            if (this.activeTentacle){
                this.activeTentacle.draw()
            }
        pop()
    }

    update(){
        if (this.activeTentacle){
            this.applyForce(p5.Vector.sub(this.targetVector , this.position))
        }

        this.velocity.mult(this.friction)


        this.velocity.add(this.acc).limit(this.speedLimit)
        this.position.add(this.velocity)
        console.log(this.velocity)
        this.acc.mult(0)



    }

    shootTentacle(){
        this.targetVector = createVector(mouseX, mouseY)
        this.activeTentacle = new Tentacle(this.position, this.targetVector, this.range)
        this.targetVector.sub(this.position).limit(this.range)
        this.targetVector.add(this.position)
    }

    releaseTentacle(){
        this.activeTentacle = null
        this.targetVector = this.position
    }

    applyForce(force){
        this.acc = force.copy().normalize()
    }


}

class Tentacle{

    constructor(startPos, target, range) {
        this.startPos = startPos
        this.endPos = this.startPos.copy().add(target.copy().sub(this.startPos).limit(range))
        this.color = color(255, 100, 100)
    }

    draw(){
        fill(this.color)
        line(this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y)
    }

}