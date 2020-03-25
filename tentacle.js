let frame = 0
let i
const rings = []
let dir = 0

function drawTentacle(x, y, d, d2, seed) {
    strokeWeight(3)
    stroke(254,1,90, 130)
    fill(255)
    i = 0
    let _dir = dir
    while (d > d2) {
        let ring = rings[i++]
        if (!ring) {
            ring = {
                x,
                y,
                d,
                dir,
            }
            rings.push(ring)
        }
        const length = 3
        _dir += noise(i) - 0.5
        const _x = x + cos(_dir) * (i+1) * length
        const _y = y + sin(_dir) * (i+1) * length
        circle(_x, _y, d)
        d -= 1
    }
}

function setup() {
    createCanvas(500, 500)
    v.add('framerate', .002, -3)
}

function draw() {
    v.input()
    frame += v.framerate
    background(255)
    drawTentacle(width * .5, height * .5, 60, 1)
    noLoop()
}