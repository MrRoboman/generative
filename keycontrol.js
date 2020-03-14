let v
(function() {
    function V() {
        this.cur = 0
        this.vars = []
        this.cooldown = 0
        this.lastKey = null
        this.firstKeystrokeTime = 300
        this.repeatKeystrokeTime = 32
        this.isEnteringValue = false
        this.valueBuffer = ''
        this.incs = [0.0001, 0.001, 0.01, 0.1, 1, 10, 100, 1000]

        const getCurKey = () => this.vars[this.cur].key
        const getCurVal = () => this[getCurKey()]
        const setCurVal = val => (this[getCurKey()] = val)
        const getCurInc = () => this.vars[this.cur].inc
        const setCurInc = inc => (this.vars[this.cur].inc = inc)

        this.add = (key, val, inc = 1) => {
            Object.defineProperty(this, key, { value: val, writable: true })
            this.vars.push({ key, inc })
        }

        this.input = () => {
            this.cooldown -= deltaTime
            if (keyIsPressed) {
                if (this.cooldown <= 0) {
                    if (keyCode !== this.lastKey) {
                        this.lastKey = keyCode
                        this.cooldown = this.firstKeystrokeTime
                    } else {
                        this.cooldown = this.repeatKeystrokeTime
                    }
                    let key, val, inc
                    let str, barf, front, back
                    switch (keyCode) {
                        case 74: // j
                            this.cur++
                            if (this.cur >= this.vars.length) {
                                this.cur = 0
                            }
                            key = this.vars[this.cur].key
                            val = this[key]
                            console.clear()
                            console.log(key, val)
                            break
                        case 75: // k
                            this.cur--
                            if (this.cur < 0) {
                                this.cur = this.vars.length - 1
                            }
                            key = this.vars[this.cur].key
                            val = this[key]
                            console.clear()
                            console.log(key, val)
                            break
                        case 72: // h
                            setCurVal(getCurVal() - getCurInc())
                            console.clear()
                            console.log(getCurKey(), getCurVal())
                            break
                        case 76: // l
                            setCurVal(getCurVal() + getCurInc())
                            console.clear()
                            console.log(getCurKey(), getCurVal())
                            break
                        case 48: // 0 - 9
                        case 49:
                        case 50:
                        case 51:
                        case 52:
                        case 53:
                        case 54:
                        case 55:
                        case 56:
                        case 57:
                            this.valueBuffer += keyCode - 48
                            console.clear()
                            console.log(`Entering value for ${getCurKey()}`)
                            console.log(this.valueBuffer)
                            break
                        case 190:
                            if (this.valueBuffer.indexOf('.') === -1) {
                                this.valueBuffer += '.'
                            }
                            console.clear()
                            console.log(`Entering value for ${getCurKey()}`)
                            console.log(this.valueBuffer)
                            break
                        case 8: // backspace
                            const newLength = this.valueBuffer.length - 1
                            this.valueBuffer = this.valueBuffer.substr(0, newLength)
                            console.clear()
                            console.log(`Entering value for ${getCurKey()}`)
                            console.log(this.valueBuffer)
                            break
                        case 13: // enter
                            if (this.valueBuffer.length) {
                                val = parseFloat(this.valueBuffer)
                                this.valueBuffer = ''
                                setCurVal(val)
                                console.clear()
                                console.log(getCurKey(), getCurVal())
                            }
                            break
                        case 69: // e
                            str = getCurInc().toString()
                            barf = str.split('.')
                            front = barf[0]
                            back = barf[1]
                            str = front.substr(0, front.length-1) + '.' + front[front.length - 1] + back
                            inc = parseFloat(str)
                            // inc = getCurInc() / 10
                            inc = inc || 1
                            setCurInc(inc)
                            console.clear()
                            console.log(getCurKey(), getCurVal(), getCurInc())
                            break
                        case 82: // r
                            str = getCurInc().toString()
                            barf = str.split('.')
                            front = barf[0]
                            back = barf[1]
                            if (!back) {
                                front += 0
                                back = ''
                            }
                            str = front + back[0] + '.' + back.substr(1, back.length)
                            // str = front.substr(0, front.length-1) + '.' + front[front.length - 1] + back
                            inc = parseFloat(str)
                            // inc = getCurInc() * 10
                            inc = inc || 1
                            setCurInc(inc)
                            console.clear()
                            console.log(getCurKey(), getCurVal(), getCurInc())
                            break
                        case 87: // w
                            console.clear()
                            console.log(getCurKey(), getCurVal(), getCurInc())
                            break
                    }
                }
            } else {
                this.cooldown = 0
                this.lastKey = null
            }
        }
    }

    v = new V()
}())