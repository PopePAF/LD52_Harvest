class Player{

    constructor(initPos) {
        this.position = createVector(initPos.x, initPos.y);
        this.size = 10
        this.color = color(255, 0, 0)
        this.activeTentacle = null
        this.velocity = createVector()
        this.acc = createVector()
        this.friction = 0.04
        this.range = 150
        this.speedLimit = 600000
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
        let frictionMultiplier = 1;
        if (this.activeTentacle){
            this.applyForce(p5.Vector.sub(this.targetVector , this.position))
            frictionMultiplier = 0.3

        }

        this.velocity.mult(1 - this.friction * frictionMultiplier)



        this.velocity.add(this.acc).limit(this.speedLimit)
        this.position.add(this.velocity)
        this.acc.mult(0)



    }

    shootTentacle(){
        this.targetVector = createVector(mouseX + this.position.x - camera.offset.x, mouseY + this.position.y - camera.offset.y)
        this.activeTentacle = new Tentacle(this.position, this.targetVector, this.range)
        this.targetVector.sub(this.position).limit(this.range)
        this.targetVector.add(this.position)
    }

    releaseTentacle(){
        this.activeTentacle = null
        this.targetVector = this.position
    }

    applyForce(force){
        this.acc.add(force.copy().normalize())
    }


}

class Tentacle{

    constructor(startPos, target, range) {
        this.lengthMultiplier = 0
        this.startPos = startPos
        this.endPos = this.startPos.copy().add(target.copy().sub(this.startPos).limit(range))
        this.color = color(255, 100, 100)
    }

    draw(){
        if (this.lengthMultiplier < 1){
            this.lengthMultiplier += 0.1
        }
        stroke(this.color)
        strokeWeight(4)
        line(this.startPos.x, this.startPos.y, this.startPos.x + ((this.endPos.x - this.startPos.x) * this.lengthMultiplier), this.startPos.y + ((this.endPos.y - this.startPos.y) * this.lengthMultiplier))
    }

}