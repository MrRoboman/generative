let frame = 0
let i
// const rings = []
let dir = 0

function drawTentacle(x, y, d, d2, seed) {
    strokeWeight(3)
    stroke(254,1,90, 130)
    fill(255)
    i = 0
    let _x = x
    let _y = y
    let _d = d2
    let _dir = dir
    const length = 3

    let backside = []
    while (_d < d) {
        i++
        _dir += (noise(i, frame) - 0.5) * v.nuzz
        _x = _x + cos(_dir) * length//* (i+1) 
        _y = _y + sin(_dir) * length//* (i+1) 
        circle(_x, _y, _d)
        _d += 1
    }

    // while (d > d2) {
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

        // i++
        // _dir += (noise(i, frame) - 0.5) * v.nuzz
        // _x = _x + cos(_dir) * length//* (i+1) 
        // _y = _y + sin(_dir) * length//* (i+1) 
        // circle(_x, _y, d)
        // d -= 1
    // }
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