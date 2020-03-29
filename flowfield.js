let canvas
let inc = 0.1
let scl = 4
let zOff = 0
let cols, rows
let flowfield
let particleCount = 10000
let origin

let particles = []

function setup() {
    canvas = createCanvas(500, 500)

    origin = createVector(width/2, height/2)

    cols = floor(width / scl)
    rows = floor(height / scl)
    flowfield = new Array(cols * rows)


    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(random(width), random(height)))
    }

    // for (let i = 0; i < particleCount; i++) {
    //     const particle = new Particle(width/2, height/2)
    //     particle.vel.x = 1
    //     particle.vel.rotate(random(TWO_PI))
    //     particles.push(particle)
    // }
}

function draw() {
    phase1()
    // stroke(0, 80, 13, 10)
    // strokeWeight(1)
    // noFill()
    // // circle(250, 250, 20)
    // particles.forEach(p => {
    //     p.move(createVector(0,0))
    //     if (p.pos.dist(origin) >= 80) {
    //         p.alive = false
    //     }
    // })
    // particles.forEach(p => p.draw())
}

function phase1() {
    stroke(160, 0, 0, 10)
    strokeWeight(1)
    let yOff = 0
    for (let y = 0; y < rows; y++) {
        let xOff = 0
        for (let x = 0; x < cols; x++) {
            // const angle = noise(xOff, yOff, zOff) * TWO_PI * 4
            // const angle = createVector(x * scl, y * scl).angleBetween(createVector(width/2, height/2))
            // const vector = p5.Vector.fromAngle(angle)
            const vec = createVector(x*scl, y*scl)
            const vector = createVector(origin.x - vec.x, origin.y - vec.y)
            const dist = vec.dist(origin) * .1
            vector.setMag(dist)
            vector.rotate((noise(xOff, yOff, zOff) - 0.5) * dist)
            const angle = vector.heading()
            // vector.setMag(1)
            const index = x + y * cols
            flowfield[index] = vector
            xOff += inc
            // push()
            // stroke(0)
            // translate(x * scl, y * scl)
            // rotate(angle)
            // line(0, 0, scl, 0)
            // pop()
        }
        yOff += inc
    }
    zOff += 0.003
    particles.forEach(p => {
        // angle = 2*PI * noise(floor(p.pos.x / scl), floor(p.pos.y / scl))
        // p.move(p5.Vector.fromAngle(angle) * 0.01)
        p.follow(flowfield)
    })
    particles.forEach(p => p.draw())

}

function Particle(x, y) {
    this.pos = createVector(x, y)
    this.vel = createVector(0, 0)
    this.maxVel = 2
    this.prevPos = this.pos.copy()
    this.alive = true
    this.endOfLife = Date.now() + random(2000)

    this.updatePrevPos = () => {
        this.prevPos = this.pos.copy()
    }

    this.follow = (field) => {
        const x = floor(this.pos.x / scl)
        const y = floor(this.pos.y / scl)
        const index = x + y * cols
        const force = field[index]
        this.move(force)
    }

    this.move = (force) => {
        if (!this.alive) {
            return
        }
        this.vel.add(force)
        this.vel.limit(this.maxVel)
        this.updatePrevPos()
        this.pos.add(this.vel)
        this.wrap()
        if (Date.now() >= this.endOfLife) {
            this.alive = false
        }
    }

    this.wrap = () => {
        if (this.pos.x < 0) {
            this.pos.x += width
            this.updatePrevPos()
        }
        if (this.pos.x > width) {
            this.pos.x -= width
            this.updatePrevPos()
        }
        if (this.pos.y < 0) {
            this.pos.y += height
            this.updatePrevPos()
        }
        if (this.pos.y > height) {
            this.pos.y -= height
            this.updatePrevPos()
        }
    }

    this.draw = () => {
        // circle(this.pos.x, this.pos.y, 1)
        if (!this.alive) {
            return
        }
        line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y)
    }
}