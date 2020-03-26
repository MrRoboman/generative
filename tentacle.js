let frame = 0
let dir = 0
let ground = []

function drawWorm() {
    let x = width * 0.75
    let y = height * 0.25
    let maxDiameter = 50

    for (let i = 0.04; i < PI - 0.04; i += v.n) {
        const _y = (noise(i, frame) - 0.5)
        circle(x + i * v.x, y + i * v.y + _y * 300, sin(i) * maxDiameter)
    }
}

function drawTentacle(x, y, d, d2, seed) {
    let i = 0
    let backside = []
    let _x = x
    let _y = y
    let _d = d
    let _g
    let _dir = dir
    const length = 3

    while (_d > d2) {
        i++
        _dir += (noise(i, frame) - 0.5) * v.nuzz
        _x = _x + cos(_dir) * length//* (i+1) 
        _y = _y + sin(_dir) * length//* (i+1) 
        _g = y - i * v.g
        backside.push({_x, _y, _d, _g})
        _d -= 1
    }

    backside = backside.reverse()

    _x = x + 3
    _y = y
    _d = d
    i = 0
    _dir = dir + PI


    while (_d > d2) {
        i++
        _dir += (noise(i+1000, frame) - 0.5) * v.nuzz
        _x = _x + cos(_dir) * length//* (i+1) 
        _y = _y + sin(_dir) * length//* (i+1) 
        _g = y + i * v.g
        backside.push({_x, _y, _d, _g})
        _d -= 1
    }

    let furthestDown = {i: -1, diff: 0}
    const start = floor(backside.length * 0.3)
    const end = floor(backside.length * 0.7)
    for (let n = start; n < end; n++) {
        const c = backside[n]
        if (furthestDown.diff < c._y - c._g) {
            furthestDown.i = n
            furthestDown.diff = c._y - c._g
        }
    }

    for (let n = 0; n < backside.length; n++) {
        const c = backside[n]
        circle(c._x, min(c._y, c._g), c._d)
    }
}

function setup() {
    createCanvas(500, 500)
    strokeWeight(3)
    stroke(254,1,90, 130)
    fill(255)
    v.add('x', -75)
    v.add('y', 45)
    v.add('n', .04, -3, {min: .001})
    v.add('g', 1, -3)
    v.add('nuzz', 1.7, -2)
    v.add('framerate', .01, -3)
    drawWorm()
}

function draw() {
    v.input()
    frame += v.framerate
    background(255)
    drawWorm()
    // drawTentacle(width * .5, height * .5, 60, 1)
    // noLoop()
}
