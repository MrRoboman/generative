let seed = Date.now()

let rows = 16
let cols = 16
let t = 1

v.add('rate', 0.08, -3)
v.add('particles', 20)
v.add('force', 1)
v.add('radius', 40)

let parts = []
let colWidth, rowHeight

let imgs = []
let diameter

function preload() {
    imgs.push(loadImage('assets/ooo.png'))
    imgs.push(loadImage('assets/troll.png'))
    imgs.push(loadImage('assets/tongue.png'))
}

function setup() {
    createCanvas(500, 500)
    background(255)

    colWidth = width / cols
    rowHeight = height / rows

    for (let i = 0; i < v.particles; i++) {
        parts.push(createVector(0, 0))
    }
}
let l = 1
function draw() {
    v.input()

    seed = Date.now()

    randomSeed(seed)
    noiseSeed(seed)

    diameter = 60

    for (let i = 0; i < v.particles; i++) {
        let x = random(width) + width
        let y = random(height)
        parts[i].x = x
        parts[i].y = y
        parts[i].radius = random(4, diameter) //diameter // random(diameter)
        parts[i].alpha = random(60, 200)
        parts[i].face = imgs[floor(random(imgs.length))]
        parts[i].dead = false
        diameter -= 2
    }

    background(255)
    console.log('ooooookay')
    while (parts.some(p => p.dead === false)) {
        t += v.rate
        for (let i = 0; i < v.particles; i++) {
            const part = parts[i]
            if (part.dead) continue
            const col = floor((part.x / width) * cols)
            const row = floor((part.y / height) * rows)
            const angle = map(
                noise((col << 8) | row, i * 2, t),
                0,
                1,
                0,
                2 * PI
            )
            const vec = p5.Vector.fromAngle(angle)
            vec.mult(v.force)
            part.add(vec)

            stroke(0, 0, 0, part.alpha)
            // part.radius -= .05
            if (part.radius <= 0 || part.x - part.radius < 0) part.dead = true
            circle(part.x, part.y, part.radius)
            // image(
            //   part.face,
            //   part.x - part.radius / 2 + 2,
            //   part.y - part.radius / 2 + 2,
            //   part.radius - 2,
            //   part.radius - 2,
            // )
        }
    }
    console.log('hellloooo')
    saveCanvas(`${seed}`, 'png')
    noLoop()
    setTimeout(() => loop(), 1000)
    l++
}

function keyPressed() {
    if (key === 's') {
        // saveCanvas(`${seed}`, 'png')
        noLoop()
    }
}
