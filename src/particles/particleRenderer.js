class ParticleRenderer{

    constructor(maxAmount, maxAge, drawAmount, delay) {
        this.maxAmount = maxAmount
        this.maxAge = maxAge
        this.drawAmount = drawAmount
        this.delay = delay
        this.delayCount = millis() - this.startDelayCount
        this.startDelayCount = millis()
        this.particles = []
    }

    drawParticles(){
        if (this.delayCount >= this.delay){
            console.log('dwad')
            this.particles.push(new FleshParticles())
            this.startDelayCount = millis()
        }
        for (x of this.particles){
            x.draw()
        }
    }

}
class FleshParticles extends ParticleRenderer{

    constructor(maxAmount, maxAge, drawAmount, delay, origin, maxOffsetX, maxOffsetY) {
        super(maxAmount, maxAge, drawAmount, delay)
        this.origin = origin
        this.maxOffsetX = maxOffsetX
        this.maxOffsetY = maxOffsetY
        this.age = millis() - this.startAge
        this.startAge = millis()
        this.randomX = Math.random()
        this.randomY = Math.random()
    }

    draw(){
        fill(255, 100, 100)
        rectMode(CENTER)
        square((this.origin.x + Math.floor(this.randomX * (this.maxOffsetX * 2)) - this.maxOffsetX), (this.origin.y + Math.floor(this.randomY * (this.maxOffsetY * 2)) - this.maxOffsetY), 10)
    }
}