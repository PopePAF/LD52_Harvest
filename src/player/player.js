class Player{

    waypoint;

    constructor(initPos, color) {
        this.position = createVector(initPos.x, initPos.y);
        this.size = 15
        this.velocity = createVector()
        this.acc = createVector()
        this.friction = 0;
        this.range = 300
        this.speedLimit = 15
        this.targetVector = createVector(initPos.x, initPos.y)
        this.tentacles = {main: null, smallOne: null}
        this.targetVectorSmallOne = createVector(initPos.x, initPos.y)
        this.healthPerc = 1
        this.lastSecond = 0
        this.hitBubbleColorMult = 0;
        this.waypoint = createVector(map2.width/2, map2.height/2);
        this.lostHealth = 0.005;
        this.gainedHealth = 0.05;
        this.color = color;
    }

    setColor(color){
        this.color = color;
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
            fill(this.color)
            noStroke()
            ellipseMode(CENTER)
            let angle = this.velocity.heading();
            circle(this.position.x, this.position.y, this.size)
            //noFill();
            //stroke(this.color)
            //circle(this.position.x, this.position.y, this.size*5*2)
            this.drawPlayerHealth()

            stroke(this.color)
            line(this.position.x, this.position.y, this.position.x + this.velocity.x*2, this.position.y + this.velocity.y*2)
        pop()
    }

    drawPlayerHealth() {
        // Draw an arc around the player
        let arcRadius = this.size + 5; // Adjust the radius as needed
        let angle = this.velocity.heading();

        let healthAngle = TWO_PI * this.healthPerc

        push();
        translate(this.position.x, this.position.y);
        rotate(angle - healthAngle/2 + PI);

        noFill();
        stroke(this.color); // Set the stroke color
        strokeWeight(2); // Set the stroke weight
        arc(0, 0, arcRadius, arcRadius, 0, healthAngle, OPEN); // Draw the arc
        strokeWeight(1);
        //ellipse(0, 0, arcRadius-5, arcRadius-5); // Draw a circle in the middle to cover the center of the arc
        ellipse(0, 0, arcRadius+5, arcRadius+5);
        pop();
    }

    update(){
        if (this.hitBubbleColorMult > 0){
            this.hitBubbleColorMult -= 0.1 * deltaTime;
        }

        /*
        if (this.tentacles.main && this.tentacles.main.ready){
            this.applyForce(p5.Vector.sub(this.targetVector , this.position).limit(this.speedLimit), 0.3*deltaTime)
        }
        if (this.tentacles.smallOne){
            this.applyForce(p5.Vector.sub(this.targetVectorSmallOne , this.position), 0.05*deltaTime)
        }
        */


        this.velocity.add(this.acc).limit(this.speedLimit)
        this.velocity.mult(1 - this.friction * deltaTime)

        this.position.add(this.velocity)

        if(!this.checkInBounds2()){
            this.friction = 0.0025;
            //this.collideWithRoundMap();
            //this.velocity.y *= -1;
            //this.velocity.x *= -1;
        }else{
            this.friction = 0.005;
            if (this.position.x > map2.width - this.size/2 || this.position.x < this.size/2) {
                //this.velocity.x *= -1;
            }
            if (this.position.y > map2.height - this.size/2 || this.position.y < this.size/2) {
                //this.velocity.y *= -1;
            }
        }

        this.acc.mult(0)

        if (p5.Vector.sub(this.targetVectorSmallOne , this.position).mag() > 60){
            this.releaseSmallTentacle()
        }

        this.checkForBubbleCollision()

        if (frameCount % 10 === 0 && this.healthPerc > 0 && gameStarted){
            let mult = 0.08;
            if(!this.checkInBounds()){
                mult = 0.08;
            }
            this.healthPerc -= this.lostHealth*mult*deltaTime// TODO: add delta to calculation
        }

        this.wasdMovement();

    }

    collideWithRoundMap(){
        let centerX = map2.width / 2;
        let centerY = map2.height / 2;
        let radius = Math.min(map2.width, map2.height) / 2;
        let distanceFromCenter = dist(this.position.x, this.position.y, centerX, centerY);
        let overlap = distanceFromCenter - (radius - this.size / 2);

        if (overlap > 0) {
            let direction = p5.Vector.sub(this.position, createVector(centerX, centerY)).normalize();
            this.position.sub(direction.mult(overlap));
            this.velocity.mult(-1);
        }
    }

    wasdMovement(){
        let speed = 0.03 * deltaTime;

        if (keyIsDown(87) || keyIsDown(UP_ARROW)){
            this.applyForce(createVector(0, -1), speed)
        }
        if (keyIsDown(83) || keyIsDown(DOWN_ARROW)){
            this.applyForce(createVector(0, 1), speed)
        }
        if (keyIsDown(65) || keyIsDown(LEFT_ARROW)){
            this.applyForce(createVector(-1, 0), speed)
        }
        if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
            this.applyForce(createVector(1, 0), speed)
        }
    }

    applyForce(force, multiplier){
        this.acc.add(force.copy().mult(multiplier))
        //this.acc.add(force.copy().normalize().mult(multiplier))
    }

    checkInBounds(){
        //return this.checkInBounds2();
        return this.position.x < map2.width && this.position.x > 0 && this.position.y < map2.height && this.position.y > 0;
    }

    checkInBounds2() {
        let centerX = map2.width / 2;
        let centerY = map2.height / 2;
        let radius = Math.min(map2.width, map2.height) / 2;
        let distanceFromCenter = dist(this.position.x, this.position.y, centerX, centerY);
        return distanceFromCenter <= radius;
    }

    shootTentacle(){
        this.targetVector = createVector(mouseX + this.position.x - camera.offset.x, mouseY + this.position.y - camera.offset.y)
        this.tentacles.main = new Tentacle(this.position, this.targetVector, this.range, this.color)
        this.targetVector.sub(this.position).limit(this.range)
        this.targetVector.add(this.position)
    }

    releaseTentacle(){
        this.tentacles.main = null
        this.targetVector = this.position
    }

    shootSmallTentacle(){
        this.targetVectorSmallOne = this.position.copy().add(p5.Vector.fromAngle(radians(Math.floor(Math.random() * 361)), 30))
        this.tentacles.smallOne = new Tentacle(this.position, this.targetVectorSmallOne, 30, this.color)
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

    constructor(startPos, target, range, color) {
        this.lengthMultiplier = 0
        this.range = range
        this.target = target
        this.ready = false
        this.startPos = startPos
        this.endPos = this.startPos.copy().add(target.copy().sub(this.startPos).limit(range))
        this.color = color;
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
