class Player{

    waypoint;

    constructor(initPos) {
        this.position = createVector(initPos.x, initPos.y);
        this.size = 15
        this.velocity = createVector()
        this.acc = createVector()
        this.friction = 0.04
        this.range = 300
        this.speedLimit = 600000
        this.targetVector = createVector(initPos.x, initPos.y)
        this.tentacles = {main: null, smallOne: null}
        this.targetVectorSmallOne = createVector(initPos.x, initPos.y)
        this.healthPerc = 1
        this.lastSecond = 0
        this.hitBubbleColorMult = 0;
        this.waypoint = createVector(map2.width/2, map2.height/2);
        this.lostHealth = 0.005;
        this.gainedHealth = 0.05;
    }

    drawWaypoint(){
        if(!player.checkInBounds() || map2.bubbles.length === 0){
            if(frameCount % 45 === 0){
                strokeWeight(2);
                line(player.position.x, player.position.y, this.waypoint.x, this.waypoint.y)
            }
        }
    }

    draw(){

        push()
            camera.translateToView()
            this.drawWaypoint();
            //translate(this.position.x, this.position.y);
            if (this.tentacles.main){
                this.tentacles.main.draw()
            }
            if (this.tentacles.smallOne){
                this.tentacles.smallOne.draw()
            }
            //translate(this.position.x, this.position.y);
            // this.particleRenderer.drawParticles()
            fill(color(255, this.hitBubbleColorMult * 255, 0))
            noStroke()
            ellipseMode(CENTER)
            circle(this.position.x, this.position.y, this.size)
        pop()
    }

    update(){
        if (this.hitBubbleColorMult > 0){
            this.hitBubbleColorMult -= 0.1
        }
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

        if(!this.checkInBounds()){
            this.velocity.y *= -1;
            this.velocity.x *= -1;
        }else{
            if (this.position.x > map2.width - this.size/2 || this.position.x < this.size/2) {
                this.velocity.x *= -1;
            }
            if (this.position.y > map2.height - this.size/2 || this.position.y < this.size/2) {
                this.velocity.y *= -1;
            }
        }

        this.acc.mult(0)

        if (p5.Vector.sub(this.targetVectorSmallOne , this.position).mag() > 60){
            this.releaseSmallTentacle()
        }

        this.checkForBubbleCollision()

        if (frameCount % 10 === 0 && this.healthPerc > 0 && gameStarted){
            let mult = 1;
            if(!this.checkInBounds()){
                mult = 0.2;
            }
            this.healthPerc -= this.lostHealth*mult
        }

    }

    applyForce(force, multiplier){
        this.acc.add(force.copy().normalize().mult(multiplier))
    }

    checkInBounds(){
        return this.position.x < map2.width && this.position.x > 0 && this.position.y < map2.height && this.position.y > 0;
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

    checkForBubbleCollision(){
        for (let bubble of map2.bubbles){
            let distance = p5.Vector.sub(this.position, bubble.position).mag()
            if (distance <= bubble.r){
                bubble.direction.set(this.velocity.x / Math.abs(this.velocity.x), this.velocity.y / Math.abs(this.velocity.y))
                bubble.velocity.add(Math.abs(this.velocity.x), Math.abs(this.velocity.y))
                bubble.velocity.limit(bubble.maxSpeed)
                bubble.direction.set(this.velocity.copy().normalize())
                if (bubble.velocity.mag() > 5 && bubble.disChargeReady){
                    if (bubble.charge > 0 && gameStarted){
                        if(this.healthPerc <= 1 - this.gainedHealth){
                            this.healthPerc += this.gainedHealth
                        }else if (this.healthPerc < 1){
                            this.healthPerc += (1 - this.healthPerc)
                        }
                        this.hitBubbleColorMult = 1;
                        score += 200
                    }
                    bubble.charge -= 0.2
                    bubble.disChargeReady = false
                }

            }
        }
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
        this.color = color(255, 0, 0)
    }

    draw(){
        if (this.lengthMultiplier < 1){
            this.lengthMultiplier += 0.15 + ((1 / this.target.copy().sub(this.startPos).limit(this.range).mag()) * 3)
        }
        else{
            this.ready = true
        }
        stroke(this.color)
        strokeWeight(12-this.lengthMultiplier*10)
        line(this.startPos.x, this.startPos.y, this.startPos.x + ((this.endPos.x - this.startPos.x) * this.lengthMultiplier), this.startPos.y + ((this.endPos.y - this.startPos.y) * this.lengthMultiplier))
    }

}
