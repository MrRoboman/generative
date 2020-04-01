let canvas
let inc = 0.01
let scl = 6
let zOff = 0
let cols, rows
let flowfield, flowfield2
let particleCount = 1500

let particles = []

let layers = []

let seed

function createLayer() {
    const layer = {}
    const num = layers.length.toString()
    const getName = name => `${num}-${name}`
    // v.add(getName('xOff'), 0.01, -2) //.5
    v.add(getName('xOff'), 0.5, -2) //.5
    // v.add(getName('yOff'), 0.01, -2) // .3
    v.add(getName('yOff'), 0.3, -2) // .3
    // v.add(getName('zOff'), 0.0001, -4) // 10.1
    v.add(getName('zOff'), 10.1, -4) // 10.1
    v.add(getName('z'), 0)
    v.add(getName('vectorMag'), 1) // 1
    v.add(getName('scl'), 6)
    v.add(getName('particleCount'), 1000)
    v.add(getName('angleMax'), TWO_PI * 4)
    layer.cols = floor(width / v[getName('scl')])
    layer.rows = floor(height / v[getName('scl')])
    layer.flowfield = new Array(layer.cols * layer.rows)
    layer.particles = []
    for (let i = 0; i < v[getName('particleCount')]; i++) {
        layer.particles.push(new Particle(random(width), random(height)))
    }
    v.add(getName('hue'), 160)
    v.add(getName('saturation'), 50)
    v.add(getName('brightness'), 50)
    v.add(getName('alpha'), .05)
    v.add(getName('strokeWeight'), 1)

    // let sclSlider = createSlider(1, floor(width*.25), layer.scl)
    // let sclSpan = createSpan(scl)
    // layer.updateValues = () => {
    //     if (sclSlider.value() !== layer.scl) {
    //         background(0)
    //         layer.scl = sclSlider.value()
    //         sclSpan.elt.innerText = layer.scl
    //         layer.cols = floor(width / scl)
    //         layer.rows = floor(height / scl)
    //         layer.flowfield = new Array(layer.cols * layer.rows)
    //         layer.particles = []
    //         for (let i = 0; i < 1000; i++) {
    //             layer.particles.push(new Particle(random(width), random(height)))
    //         }
    //     }
    // }
    
    layer.reset = () => {
        background(0)
        randomSeed(seed)
        noiseSeed(seed)
        layer.cols = floor(width / v[getName('scl')])
        layer.rows = floor(height / v[getName('scl')])
        layer.flowfield = new Array(layer.cols * layer.rows)
        layer.particles = []
        for (let i = 0; i < v[getName('particleCount')]; i++) {
            layer.particles.push(new Particle(random(width), random(height)))
        }
    }

    layer.updateFlowfield = () => {
        for (let y = 0; y < layer.rows; y++) {
            for (let x = 0; x < layer.cols; x++) {
                const angle = noise(
                    x*v[getName('xOff')],
                    y*v[getName('yOff')],
                    v[getName('z')]*v[getName('zOff')],
                ) * v[getName('angleMax')]
                const vector = p5.Vector.fromAngle(angle)
                vector.setMag(v[getName('vectorMag')])
                const index = x + y * layer.cols
                layer.flowfield[index] = vector
            }
        }
    }
    layer.updateParticles = () => {
        layer.particles.forEach(p => {
            const x = floor(p.pos.x / v[getName('scl')])
            const y = floor(p.pos.y / v[getName('scl')])
            const index = x + y * layer.cols
            const force = layer.flowfield[index]
            p.move(force)
        })
    }
    layer.draw = () => {
        stroke(v[getName('hue')],v[getName('saturation')],v[getName('brightness')],v[getName('alpha')])
        strokeWeight(v[getName('strokeWeight')])
        layer.particles.forEach(p => p.draw())
    }
    
    layers.push(layer)

    // Setup Control Panel
}

function keyPressed() {
    if (key != 'h' && key != 'l')
    layers.forEach(layer => layer.reset())
}

function setup() {
    canvas = createCanvas(500, 500)
    document.getElementById('canvas').appendChild(canvas.elt)

    // const slider = createSlider(10, 20, 15)
    // document.getElementById('fart').appendChild(slider.elt)

    const ff = document.createElement('flow-slider')
    ff.setAttribute('label', 'a label')
    ff.setAttribute('min', 50)
    ff.setAttribute('max', 100)
    ff.setAttribute('value', 50)
    ff.setAttribute('step', .1)
    // ff.setAttribute('slider', slider)
    document.getElementById('slider-container').appendChild(ff)

    seed = floor(random(10000))
    // seed = 7565
    // seed = 3025
    randomSeed(seed)
    noiseSeed(seed)
    createSpan(seed)
    // v.add('seed', seed)

    colorMode(HSB)

    background(0)

    createLayer()
}

function draw() {
    v.input()
    layers.forEach(layer => {
        // layer.updateValues()
        layer.updateFlowfield()
        layer.updateParticles()
        layer.draw()
    })
    noLoop()
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