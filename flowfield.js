let canvas
let inc = 0.01
let scl = 6
let zOff = 0
let cols, rows
let flowfield, flowfield2
let particleCount = 1500

let particles = []

let layers = []

function createLayer() {
    const layer = {}
    layer.xOff = 0.01
    layer.yOff = 0.01
    layer.zOff = 0.0001
    layer.z = 0
    layer.vectorMag = 0.1
    layer.scl = 6
    layer.cols = floor(width / layer.scl)
    layer.rows = floor(height / layer.scl)
    layer.angleMax = TWO_PI * 4
    layer.flowfield = new Array(layer.cols * layer.rows)
    layer.particles = []
    for (let i = 0; i < 1000; i++) {
        layer.particles.push(new Particle(random(width), random(height)))
    }
    layer.color = [160, 0, 0]
    layer.alpha = 10
    layer.strokeWeight = 1

    let sclSlider = createSlider(1, floor(width*.25), layer.scl)
    let sclSpan = createSpan(scl)
    layer.updateValues = () => {
        if (sclSlider.value() !== layer.scl) {
            background(0)
            layer.scl = sclSlider.value()
            sclSpan.elt.innerText = layer.scl
            layer.cols = floor(width / scl)
            layer.rows = floor(height / scl)
            layer.flowfield = new Array(layer.cols * layer.rows)
            layer.particles = []
            for (let i = 0; i < 1000; i++) {
                layer.particles.push(new Particle(random(width), random(height)))
            }
        }
    }

    layer.updateFlowfield = () => {
        for (let y = 0; y < layer.rows; y++) {
            for (let x = 0; x < layer.cols; x++) {
                const angle = noise(
                    x*layer.xOff,
                    y*layer.yOff,
                    layer.z*layer.zOff,
                ) * layer.angleMax
                const vector = p5.Vector.fromAngle(angle)
                vector.setMag(layer.vectorMag)
                const index = x + y * layer.cols
                layer.flowfield[index] = vector
            }
        }
    }
    layer.updateParticles = () => {
        layer.particles.forEach(p => {
            const x = floor(p.pos.x / layer.scl)
            const y = floor(p.pos.y / layer.scl)
            const index = x + y * layer.cols
            const force = layer.flowfield[index]
            p.move(force)
        })
    }
    layer.draw = () => {
        stroke(...layer.color, layer.alpha)
        strokeWeight(layer.strokeWeight)
        layer.particles.forEach(p => p.draw())
    }
    
    layers.push(layer)

    // Setup Control Panel
}

function setup() {
    canvas = createCanvas(500, 500)
    background(0)

    createLayer()
}

function draw() {
    layers.forEach(layer => {
        layer.updateValues()
        layer.updateFlowfield()
        layer.updateParticles()
        layer.draw()
    })
    // noLoop()
}


function Particle(x, y) {
    this.pos = createVector(x, y)
    this.vel = createVector(0, 0)
    this.maxVel = 2
    this.prevPos = this.pos.copy()
    this.endOfLife = Date.now() + random(3000)

    this.updatePrevPos = () => {
        this.prevPos = this.pos.copy()
    }

    this.follow = (field, whatsmyindex) => {
        const x = floor(this.pos.x / scl)
        const y = floor(this.pos.y / scl)
        const index = x + y * cols
        const force = field[index]
        this.move(force)
    }

    this.move = (force) => {
        this.vel.add(force)
        this.vel.limit(this.maxVel)
        this.updatePrevPos()
        this.pos.add(this.vel)
        this.wrap()
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
        // if (Date.now() < this.endOfLife) {
            line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y)
        // }
    }
}