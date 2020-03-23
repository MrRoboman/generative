let frame = 0

function drawTentacle(x, y, d, d2, seed) {
    let startX = x
    let w = d
    let h = d
    // stroke(255,165,2, 100)
    stroke(254,1,90, 130)
    fill(255)
    while (d > d2) {
        let _x = x
        let _y = y
        let n = .5
        ellipse(_x, _y, w, h)
        w -= 1
        h -= 1
        _x += v._x
        _y += v._y
        // const angle = (noise(y * .01, frame)) * (PI*2)
        // fast left and right
        const angle = map(noise(y * .01, frame, seed) - 0.5, -0.2, 0.2, 0, 2*PI)
        // slow boring
        // const angle = map(noise(y * .01, frame) - 0.5, -0.2, 0.2, -PI*3/4, -PI/4)
        x += cos(angle)
        y -= 1
        // y += sin(angle)
        d -= .4
        w = d
        h = d
    }
    // fill(0)
    // ellipse(x + (x < startX ? -3 : 3), y, d / 3, d / 2)
}

let seed1
let seed2

function setup() {
    createCanvas(500, 500)
    seed1 = random(Date.now())
    seed2 = random(Date.now())
    seed2 = seed1 + .3
    v.add('framerate', .01, -3)
    v.add('_x', 0, -2)
    v.add('_y', .5, -2)
}

let t = 0
function draw() {
    v.input()
    frame += v.framerate
    background(255)
    drawTentacle(width * .3, height * .8, 60, 1, seed1)
    drawTentacle(width * .7, height * .8, 60, 1, seed1)
    drawTentacle(width * .5, height * .8, 80, 1, seed2)
    // drawTentacle(width * .5, height / 2, min(60, 30 + frame*10), 30, seed2)
    // noLoop()
}