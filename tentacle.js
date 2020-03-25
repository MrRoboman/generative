let frame = 0
let dir = 0
let ground = []

function drawWorm() {
    let x = width / 2
    let y = height / 2
    let d = 50
    let rings = []

    let _x = x
    let _y = y
    let _d = d
    for (let i = d; i > 0; i--) {
        rings.push({
            x: x + cos(-PI/5) * (d - i) * 3,
            y: y + sin(-PI/5) * (d - i) * 3,
            d: i,
        })
        ground.push(y + sin(-PI/5) * (d - i) * 3)
    }

    rings = rings.reverse()
    ground = ground.reverse()

    for (let i = d; i > 0; i--) {
        rings.push({
            x: x + cos(PI-(PI/8)) * (d - i) * 3,
            y: y + sin(PI-(PI/8)) * (d - i) * 4,
            d: i,
        })
        ground.push(y + sin(PI-(PI/8)) * (d - i) * 4)
    }

    // for (let i = 0; i < rings.length; i++) {
    //     const {x, y, d} = rings[i]
    //     circle(x, y, d)
    // }
}

function drawTentacle(x, y, d, d2, seed) {
    let i = 0
    let backside = []
    let _x = x
    let _y = y
    let _d = d
    let _dir = dir
    const length = 3

    while (_d > d2) {
        i++
        _dir += (noise(i, frame) - 0.5) * v.nuzz
        _x = _x + cos(_dir) * length//* (i+1) 
        _y = _y + sin(_dir) * length//* (i+1) 
        // circle(_x, _y, d)
        backside.push({_x, _y, _d})
        _d -= 1
    }

    backside = backside.reverse()

    _x = x + 3
    _y = y
    _d = d
    _dir = dir + PI
    // i += 1000


    while (_d > d2) {
        i++
        _dir += (noise(i+1000, frame) - 0.5) * v.nuzz
        _x = _x + cos(_dir) * length//* (i+1) 
        _y = _y + sin(_dir) * length//* (i+1) 
        backside.push({_x, _y, _d})
        // circle(_x, _y, _d)
        _d -= 1
    }

    let highestY = 0
    const start = floor(backside.length * 0)
    const end = floor(backside.length * 1)
    for (let n = start; n < end; n++) {
        const c = backside[n]
        // circle(c._x, c._y, c._d)
        highestY = max(highestY, c._y)
    }

    let yDiff = highestY - y
    for (let n = 0; n < backside.length; n++) {
        const c = backside[n]
        let Y = min(c._y, ground[n])
        console.log(Y)
        circle(c._x, Y, c._d)
    }
}

function setup() {
    createCanvas(500, 500)
    strokeWeight(3)
    stroke(254,1,90, 130)
    fill(255)
    v.add('nuzz', 1.7, -2)
    v.add('framerate', .01, -3)
    drawWorm()
}

function draw() {
    v.input()
    frame += v.framerate
    background(255)
    drawTentacle(width * .5, height * .5, 60, 1)
    // noLoop()
}
