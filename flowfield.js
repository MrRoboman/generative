let canvas
let inc = 0.1
let scl = 4
let zOff = 0
let cols, rows
let flowfield
let particleCount = 10000
let origin

let particles = []

let eye

function preload() {
    eye = loadImage('./eye copy.png')
}

function setup() {
    canvas = createCanvas(500, 500)

    origin = createVector(width/2, height/2)

    cols = floor(width / scl)
    rows = floor(height / scl)
    flowfield = new Array(cols * rows)


    for (let i = 0; i < particleCount; i++) {
        let particle = new Particle(random(width), random(height))
        // if (particle.pos.dist(origin) < 100) {
        //     particle.pos 
        // }
        particles.push(particle)
    }

}

let f = 0
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

    // stroke(0)
    // noStroke()
    // fill(200)
    // const midX = width/2
    // const midY = height/2
    // circle(midX, midY, 100)

    // randomSeed(100000)
    // let points = []
    // for (let i = 0; i < TWO_PI; i += random(.01, .2)) {
    //     let r = 36 + (noise(i * 4) - 0.5) * 20
    //     // r = max(r, 30)
    //     stroke(0, random(100, 200))
    //     strokeWeight(random(.5,1.5))
    //     let point = {x: midX + cos(i) * r, y: midY + sin(i) * r}
    //     line(midX, midY, point.x, point.y)
    //     points.push(point)
    // }

    // stroke(0, 180)
    // strokeWeight(1)
    // noStroke()
    // fill(255, 150)
    // beginShape()
    // for (let i = 0; i < points.length; i++) {
    //     // line(points[i-1].x, points[i-1].y, points[i].x, points[i].y)
    //     curveVertex(points[i].x, points[i].y)
    // }
    // // line(points[points.length-1].x, points[points.length-1].y, points[0].x, points[0].y)
    // curveVertex(points[0].x, points[0].y)
    // curveVertex(points[1].x, points[1].y)
    // curveVertex(points[2].x, points[2].y)
    // endShape()

    // fill(0)
    // circle(midX, midY, 23)

    // for (let i = 0; i < particleCount; i++) {
    //     const particle = new Particle(width/2, height/2)
    //     particle.vel.x = 1
    //     particle.vel.rotate(random(TWO_PI))
    //     particles.push(particle)
    // }

    image(eye, origin.x - eye.width / 2, origin.y - eye.height / 2)
    
    strokeWeight(500)
    stroke(0, 10)
    noFill()
    if (f++ < 65) circle(origin.x, origin.y, 250)
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
            vector.rotate((noise(xOff, yOff) - 0.5) * dist)
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
    this.endOfLife = Date.now() + random(5000)

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
        strokeWeight(1)
        const dist = this.pos.dist(origin)
        const thresh = 130
        if (dist > thresh) {
            strokeWeight((dist - thresh + 2) * .02)
        }
        line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y)
    }
}