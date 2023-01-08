class Player{

    constructor(initPos) {
        this.position = createVector(initPos.x, initPos.y);
        this.size = 10
        this.color = color(255, 0, 0)
        this.velocity = createVector()
        this.acc = createVector()
        this.friction = 0.04
        this.range = 150
        this.speedLimit = 600000
        this.targetVector = createVector(initPos.x, initPos.y)
        this.tentacles = {main: null, smallOne: null}
        this.targetVectorSmallOne = createVector(initPos.x, initPos.y)
        this.particleRenderer = new FleshParticles(10, 5000, 1, 500, this.position, this.size/2, this.size/2)
    }

    draw(){

        push()
            camera.translateToView()
            //translate(this.position.x, this.position.y);
            this.particleRenderer.drawParticles()
            fill(this.color)
            noStroke();
            // stroke(this.color);
            // rectMode(CENTER)
            ellipse(this.position.x, this.position.y, this.size)
            // square(this.position.x, this.position.y, this.size)
            if (this.tentacles.main){
                this.tentacles.main.draw()
            }
            if (this.tentacles.smallOne){
                this.tentacles.smallOne.draw()
            }
        pop()
    }

    update(){
        let frictionMultiplier = 1;
        if (this.tentacles.main && this.tentacles.main.ready){
            this.applyForce(p5.Vector.sub(this.targetVector , this.position), 1)
            frictionMultiplier = 0.3
        }
        if (this.tentacles.smallOne){
            this.applyForce(p5.Vector.sub(this.targetVectorSmallOne , this.position), 0.05)
        }

        this.velocity.mult(1 - this.friction * frictionMultiplier)

        this.velocity.add(this.acc).limit(this.speedLimit)
        this.position.add(this.velocity)
        this.acc.mult(0)

        if (p5.Vector.sub(this.targetVectorSmallOne , this.position).mag() > 60){
            this.releaseSmallTentacle()
        }
    }

    applyForce(force, multiplier){
        this.acc.add(force.copy().normalize().mult(multiplier))
    }

    shootTentacle(){
        this.targetVector = createVector(mouseX + this.position.x - camera.offset.x, mouseY + this.position.y - camera.offset.y)
        this.tentacles.main = new Tentacle(this.position, this.targetVector, this.range)
        this.targetVector.sub(this.position).limit(this.range)
        this.targetVector.add(this.position)
    }

    releaseTentacle(){
        this.tentacles.main = null
        this.targetVector = this.position
    }

    shootSmallTentacle(){
        this.targetVectorSmallOne = this.position.copy().add(p5.Vector.fromAngle(radians(Math.floor(Math.random() * 361)), 30))
        this.tentacles.smallOne = new Tentacle(this.position, this.targetVectorSmallOne, 30)
    }

    releaseSmallTentacle(){
        this.tentacles.smallOne = null
        this.targetVectorSmallOne = this.position
    }




}

class Tentacle{

    constructor(startPos, target, range) {
        this.lengthMultiplier = 0
        this.range = range
        this.target = target
        this.ready = false
        this.startPos = startPos
        this.endPos = this.startPos.copy().add(target.copy().sub(this.startPos).limit(range))
        this.color = color(255, 100, 100)
    }

    draw(){
        if (this.lengthMultiplier < 1){
            this.lengthMultiplier += 0.15 + ((1 / this.target.copy().sub(this.startPos).limit(this.range).mag()) * 3)
        }
        else{
            this.ready = true
        }
        stroke(this.color)
        strokeWeight(4)
        line(this.startPos.x, this.startPos.y, this.startPos.x + ((this.endPos.x - this.startPos.x) * this.lengthMultiplier), this.startPos.y + ((this.endPos.y - this.startPos.y) * this.lengthMultiplier))
    }

}
