class Player{

    waypoint;

    constructor(initPos, color) {
        this.position = createVector(initPos.x, initPos.y);
        this.size = 30
        this.auraSize = 50
        this.speed = 0.8
        this.speedLimit = 8
        this.velocity = createVector()
        this.acc = createVector()
        this.friction = 0;
        this.range = 300
        this.targetVector = createVector(initPos.x, initPos.y)
        this.targetVectorSmallOne = createVector(initPos.x, initPos.y)
        this.healthPerc = 1
        this.waypoint = createVector(map2.width/2, map2.height/2);
        this.lostHealth = 0.01;
        this.gainedHealth = 0.05;
        this.color = color;
    }

    setColor(color){
        this.color = color;
    }

    drawWaypoint(){
        if(!player.checkInBounds() || map2.bubbles.length === 0){
            if(frameCount % 77 === 0){
                stroke(this.color)
                strokeWeight(2);
                line(player.position.x, player.position.y, this.waypoint.x, this.waypoint.y)
            }
        }
    }

    draw(){

        push()
            camera.translateToView()
            this.drawWaypoint();

            fill(this.color)
            noStroke()
            ellipseMode(CENTER)

            noFill()
            fill(0, 0, 0, 255)
            stroke(this.color)
            strokeWeight(2)
            circle(this.position.x, this.position.y, this.size)
            //circle(this.position.x, this.position.y, this.auraSize*2)
            this.drawPlayerHealth()

            line(this.position.x, this.position.y, this.position.x + this.velocity.x*2, this.position.y + this.velocity.y*2)
        pop()
    }

    drawPlayerHealth() {
        // Draw an arc around the player
        let arcRadius = this.size - 5; // Adjust the radius as needed
        let angle = this.velocity.heading();

        let healthAngle = TWO_PI * this.healthPerc

        push();
        translate(this.position.x, this.position.y);
        rotate(angle - healthAngle/2 + PI);

        noFill();
        stroke(this.color); // Set the stroke color
        strokeWeight(2); // Set the stroke weight
        arc(0, 0, arcRadius, arcRadius, 0, healthAngle, OPEN); // Draw the arc

        pop();
    }

    update(){
        this.checkHealth();

        let surfaceFriction = 0;
        if(!this.checkInBounds()){
            //surfaceFriction = 0.00025;
            surfaceFriction = 0;
            if(gravityOn) {
                this.applyForce(p5.Vector.sub(this.waypoint, this.position).setMag(0.2), delta)
            }
        }else{
            surfaceFriction = 0.05;
        }

        this.velocity.add(this.acc).limit(this.speedLimit)
        this.velocity.mult(1 - (this.friction+surfaceFriction) * delta)

        this.position.add(this.velocity)

        this.acc.mult(0)

        this.checkForBubbleCollision()
        this.wasdMovement();
        if(autoMode){
            this.autoMovement();
        }

    }

    checkHealth(){
        if (frameCount % 10 === 0 && this.healthPerc > 0 && gameRunning && !godMode){
            this.healthPerc -= this.lostHealth*delta;
        }

        if(this.healthPerc <= 0){
            gameRunning = false;
        }
    }

    autoMovement() {
        if (map2.bubbles.length === 0) {
            let direction = p5.Vector.sub(this.waypoint, this.position).setMag(this.speed/2);
            this.applyForce(direction, delta);
            return;
        }

        let closestBubble = null;
        let minDist = Infinity;

        for (let bubble of map2.bubbles) {
            let distance = p5.Vector.dist(this.position, bubble.position);
            if (distance < minDist) {
                minDist = distance;
                closestBubble = bubble;
            }
        }

        if (closestBubble) {
            let direction = p5.Vector.sub(closestBubble.position, this.position).setMag(this.speed/2);
            this.applyForce(direction, delta);
        }
    }

    wasdMovement(){
        if (keyIsDown(87) || keyIsDown(UP_ARROW)){
            this.applyForce(createVector(0, -1).setMag(this.speed), delta)
        }
        if (keyIsDown(83) || keyIsDown(DOWN_ARROW)){
            this.applyForce(createVector(0, 1).setMag(this.speed), delta)
        }
        if (keyIsDown(65) || keyIsDown(LEFT_ARROW)){
            this.applyForce(createVector(-1, 0).setMag(this.speed), delta)
        }
        if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
            this.applyForce(createVector(1, 0).setMag(this.speed), delta)
        }
    }

    applyForce(force, multiplier){
        this.acc.add(force.copy().mult(multiplier))
    }

    checkInBounds() {
        let centerX = map2.width / 2;
        let centerY = map2.height / 2;
        let radius = Math.min(map2.width, map2.height) / 2;
        let distanceFromCenter = dist(this.position.x, this.position.y, centerX, centerY);
        return distanceFromCenter <= radius;
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
                    if (bubble.charge > 0 && gameRunning){
                        if(this.healthPerc <= 1 - this.gainedHealth){
                            this.healthPerc += this.gainedHealth
                        }else if (this.healthPerc < 1){
                            this.healthPerc += (1 - this.healthPerc)
                        }
                        score += 200
                    }
                    bubble.charge -= 0.2
                    bubble.disChargeReady = false
                }
            }
        }
    }
}
