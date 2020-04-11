// lock cols rows
let canvas
let smallCanvas
let saves
let storage
let savedConfigs
let frame
let frameSpan
let field
let sliders = {}
let particles = []
let __ = {}

let hue

function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}

function setLocalStorage(key, value) {
    return localStorage.setItem(key, JSON.stringify(value))
}

function saveConfig() {
    smallCanvas.context.drawImage(canvas.elt, 0, 0, 100, 100)
    const newConfig = {
        image: smallCanvas.canvas.toDataURL(),
        ...__
    }
    const key = Date.now()
    savedConfigs.push(key)
    setLocalStorage('savedConfigs', savedConfigs)
    setLocalStorage(key, newConfig)
    createConfigImage(newConfig)
}

function loadConfig(config) {
    for (const key in __) {
        update__(key, config[key], false)
    }
    reset()
}

const update__ = (key, value, shouldReset = true) => {
    __[key] = value
    sliders[key].val = value
    if (shouldReset) {
        reset()
    }
}

function createConfigImage(config) {
    const img = createImg(config.image, 'Config Image')
    img.elt.onclick = () => {
        loadConfig(config)
        reset()
    }
}

function initSaveStuff() {
    smallCanvas = {}
    smallCanvas.canvas = document.createElement('canvas')
    smallCanvas.context = smallCanvas.canvas.getContext('2d')
    smallCanvas.canvas.width = 100
    smallCanvas.canvas.height = 100

    savedConfigs = getLocalStorage('savedConfigs')
    if (!savedConfigs) {
        savedConfigs = []
        setLocalStorage('savedConfigs', savedConfigs)
    }
    for (let i = 0; i < savedConfigs.length; i++) {
        const key = savedConfigs[i]
        const config = getLocalStorage(key)
        createConfigImage(config)
    }
}

function createSaveButton() {
    let btn = createButton('Save')
    btn.mousePressed(saveConfig)
    document.getElementById('slider-container').appendChild(btn.elt)

    btn = createButton('Stop')
    btn.mousePressed(() => {
        noLoop()
        frameSpan.elt.innerText = frame
    })
    document.getElementById('slider-container').appendChild(btn.elt)

    btn = createButton('Snap')
    btn.mousePressed(() => {
        noLoop()
        save()
    })
    document.getElementById('slider-container').appendChild(btn.elt)
    
    frameSpan = createSpan()
    document.getElementById('slider-container').appendChild(frameSpan.elt)
}

function createSliders() {
    initialConfig.sliders.forEach(slider => {
        const ff = document.createElement('flow-slider')
        ff.setAttribute('label', slider.label)
        ff.setAttribute('min', slider.min)
        ff.setAttribute('max', slider.max)
        ff.setAttribute('value', slider.value)
        ff.setAttribute('step', slider.step)
        __[slider.label] = slider.value
        ff.inputCallback = update__
        document.getElementById('slider-container').appendChild(ff)
        sliders[slider.label] = ff
    })
}

function reset() {
    frame = 0
    hue = __.hue
    randomSeed(__.seed)
    noiseSeed(__.seed)
    background(0)
    for (let i = 0; i < __.particleCount; i++) {
        const x = random(width)
        const y = random(height)
        if (i === particles.length) {
            particles.push(new Particle(x, y))
        } else {
            particles[i].reset()
        }
    }
    loop()
}

function update() {
    field = {}
    for (let i = 0; i < __.particleCount; i++) {
        const p = particles[i]
        const col = floor(p.pos.x / __.cols)
        const row = floor(p.pos.y / __.rows)
        let vector = field[[col, row]]
        if (!vector) {
            const xNoise = col * __.xNoiseStep
            const yNoise = row * __.yNoiseStep
            const zNoiseStep = (abs(250 - p.pos.x) / 250) * __.zNoiseStep
            const zNoise = frame * zNoiseStep
            const angle = noise(xNoise, yNoise, zNoise) * __.maxAngle
            vector = p5.Vector.fromAngle(angle)
            vector.setMag(__.flowForce)
            field[[col, row]] = vector
        }
        p.move(vector)

        hue += __.hueRate || 0
        if (hue < 0) {
            hue = 360
        } else if (hue > 360) {
            hue = 0
        }
        stroke(hue, __.saturation, __.brightness, __.alpha)
        p.draw()
    }
}

function setup() {
    canvas = createCanvas(500, 500)
    document.getElementById('canvas-container').appendChild(canvas.elt)

    createSaveButton()
    createSliders()
    initSaveStuff()

    update__('seed', floor(random(1000000000)))

    colorMode(HSB)
    hue = __.hue
    reset()
}

function draw() {
    update()
    if (++frame === __.frame) {
        noLoop()
    }
}

function Particle(x, y) {
    this.pos = createVector(x, y)
    this.vel = createVector(0, 0)
    this.prevPos = this.pos.copy()
    this.endOfLife = Date.now() + random(3000)
    this.alive = true

    this.reset = () => {
        // const ratio = ((frame + 100) / __.frame) * width
        // this.pos.x = width/2 - ratio/2 + random(ratio)
        // this.pos.y = height/2 - ratio/2 + random(ratio)
        switch(floor(random(4))) {
            case 0:
                this.pos.x = 0
                this.pos.y = random(height)
                break
            case 1:
                this.pos.x = width
                this.pos.y = random(height)
                break
            case 2:
                this.pos.x = random(width)
                this.pos.y = 0
                break
            case 3:
                this.pos.x = random(width)
                this.pos.y = height
                break
        }
        this.vel.x = 0
        this.vel.y = 0
        this.alive = true
    }

    this.updatePrevPos = () => {
        this.prevPos = this.pos.copy()
    }

    this.move = (force) => {
        this.vel.add(force)
        this.vel.limit(__.maxSpeed)
        this.updatePrevPos()
        this.pos.add(this.vel)
        this.wrap()
    }

    this.wrap = () => {
        if (this.pos.x < 0) {
            this.pos.x += width
            this.reset()
            this.updatePrevPos()
        }
        if (this.pos.x > width) {
            this.pos.x -= width
            this.reset()
            this.updatePrevPos()
        }
        if (this.pos.y < 0) {
            this.pos.y += height
            this.reset()
            this.updatePrevPos()
        }
        if (this.pos.y > height) {
            this.pos.y -= height
            this.reset()
            this.updatePrevPos()
        }
    }

    this.draw = () => {
        if (this.alive) {
            line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y)
        }            
    }
}
