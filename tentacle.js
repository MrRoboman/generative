let frame = 0
let i
// const rings = []
let dir = 0
// let frontseed = random(Date.now())
// let backseed = random(Date.now())

function drawTentacle(x, y, d, d2, seed) {
    strokeWeight(3)
    stroke(254,1,90, 130)
    fill(255)
    i = 0
    let backside = []
    let _x = x
    let _y = y
    let _d = d
    let _dir = dir
    const length = 3

    // while (_d < d) {
    //     i++
    //     _dir += (noise(i, frame) - 0.5) * v.nuzz
    //     _x = _x + cos(_dir) * length//* (i+1) 
    //     _y = _y + sin(_dir) * length//* (i+1) 
    //     circle(_x, _y, _d)
    //     _d += 1
    // }

    while (_d > d2) {
        // let ring = rings[i++]
        // if (!ring) {
        //     ring = {
        //         x,
        //         y,
        //         d,
        //         dir,
        //     }
        //     rings.push(ring)
        // }

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
    i += 1000


    while (_d > d2) {
        i++
        _dir += (noise(i, frame) - 0.5) * v.nuzz
        _x = _x + cos(_dir) * length//* (i+1) 
        _y = _y + sin(_dir) * length//* (i+1) 
        backside.push({_x, _y, _d})
        // circle(_x, _y, _d)
        _d -= 1
    }

    let highestY = 0
    const start = floor(backside.length * .4)
    const end = floor(backside.length * .6)
    for (let n = start; n < end; n++) {
        const c = backside[n]
        // circle(c._x, c._y, c._d)
        highestY = max(highestY, c._y)
    }

    let yDiff = highestY - y
    for (let n = 0; n < backside.length; n++) {
        const c = backside[n]
        circle(c._x, c._y - yDiff, c._d)
    }
}

function setup() {
    createCanvas(500, 500)
    v.add('nuzz', 1.7, -2)
    v.add('framerate', .01, -3)
    
}

function draw() {
    v.input()
    frame += v.framerate
    background(255)
    drawTentacle(width * .5, height * .5, 60, 1)
    // noLoop()
}
