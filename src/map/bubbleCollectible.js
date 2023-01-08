class BubbleCollectible{
    constructor(position , r) {
        this.r = r;
        this.direction = createVector(random([-1, 1]), random([-1, 1]))
        this.velocity = createVector(1, 1)
        this.position = position;
        this.friction = 0.02
        this.maxSpeed = 40
    }

    update(){
        this.position.add(this.velocity.copy().mult(this.direction.copy()))

        if(this.velocity.x > 1){
            this.velocity.x *= (1-this.friction)
        }

        if(this.velocity.y > 1){
            this.velocity.y *= (1-this.friction)
        }

        for (let bubble of map2.bubbles){
            let distance = p5.Vector.sub(bubble.position, this.position)
            if (distance.mag() <= this.r + bubble.r){
                this.velocity.set(p5.Vector.add(bubble.velocity, this.velocity).div(4).mult(3))
                bubble.velocity.set(p5.Vector.add(bubble.velocity, this.velocity).div(2))
                this.velocity.limit(this.maxSpeed)

                this.direction.set(distance.x / ((Math.abs(distance.x)) * -1), distance.y / ((Math.abs(distance.y)) * -1))
            }
        }

        for (let bubbleC of map2.bubbleCollectibles){
            if(bubbleC !== this){
                let distance = p5.Vector.sub(bubbleC.position, this.position)
                if (distance.mag() <= this.r + bubbleC.r){
                    this.velocity.set(p5.Vector.add(bubbleC.velocity, this.velocity).div(2))
                    bubbleC.velocity.set(p5.Vector.add(bubbleC.velocity, this.velocity).div(2))

                    this.velocity.limit(this.maxSpeed)

                    this.direction.set(distance.x / ((Math.abs(distance.x)) * -1), distance.y / ((Math.abs(distance.y)) * -1))
                }
            }

        }


        if (this.position.x > map2.width - this.r) {
            this.direction.x = -1
        }
        if (this.position.x < this.r){
            this.direction.x = 1
        }
        if (this.position.y > map2.height - this.r) {
            this.direction.y = -1;
        }
        if (this.position.y < this.r){
            this.direction.y = 1
        }
    }
}