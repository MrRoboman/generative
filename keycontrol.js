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

        const getCurOpt = () => this.vars[this.cur].opt
        const getCurKey = () => this.vars[this.cur].key
        const getCurVal = () => this[getCurKey()]
        const setCurVal = val => (this[getCurKey()] = val)
        const getCurInc = () => this.vars[this.cur].inc
        const getCurIncPow10 = () => parseFloat(Math.pow(10, getCurInc()).toFixed(Math.abs(getCurInc())))
        const setCurInc = inc => (this.vars[this.cur].inc = inc)
        const getOtherVars = () => {
            let str = ''
            const a = this.vars.slice(0, this.cur)
            const b = this.vars.slice(this.cur + 1)
            b.forEach(el => (str += el.key + ' '))
            a.forEach(el => (str += el.key + ' '))
            return str
        }
        const print = () => {
            console.clear()
            console.log(getCurKey(), getCurVal(), ' | ', getOtherVars())
            console.log(`(${getCurIncPow10()})`)
        }
        const printEnteringValue = () => {
            console.clear()
            console.log(`${getCurKey()}: ${this.valueBuffer}`)
        }

        this.add = (key, val, inc = 0, opt = {}) => {
            Object.defineProperty(this, key, { value: val, writable: true })
            this.vars.push({ key, inc, opt })
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

                    switch (keyCode) {
                        case 72: { // h
                            this.cur--
                            if (this.cur < 0) {
                                this.cur = this.vars.length - 1
                            }
                            print()
                            break
                        }
                        case 76: { // l
                            this.cur++
                            if (this.cur >= this.vars.length) {
                                this.cur = 0
                            }
                            print()
                            break
                        }
                        case 74: { // j
                            const curVal = getCurVal()
                            const curInc = getCurInc()
                            let newVal = parseFloat((curVal - Math.pow(10, curInc)).toFixed(Math.abs(curInc)))
                            const { min, max } = getCurOpt()
                            if (min !== undefined) {
                                newVal = Math.max(newVal, min)
                            }
                            if (max !== undefined) {
                                newVal = Math.min(newVal, max)
                            }
                            setCurVal(newVal)
                            print()
                            break
                        }
                        case 75: { // k
                            const curVal = getCurVal()
                            const curInc = getCurInc()
                            let newVal = parseFloat((curVal + Math.pow(10, curInc)).toFixed(Math.abs(curInc)))
                            const { min, max } = getCurOpt()
                            if (min !== undefined) {
                                newVal = Math.max(newVal, min)
                            }
                            if (max !== undefined) {
                                newVal = Math.min(newVal, max)
                            }
                            setCurVal(newVal)
                            print()
                            break
                        }
                        case 48: // 0 - 9
                        case 49:
                        case 50:
                        case 51:
                        case 52:
                        case 53:
                        case 54:
                        case 55:
                        case 56:
                        case 57: {
                            this.valueBuffer += keyCode - 48
                            printEnteringValue()
                            break
                        }
                        case 190: {
                            if (this.valueBuffer.indexOf('.') === -1) {
                                this.valueBuffer += '.'
                            }
                            printEnteringValue()
                            break
                        }
                        case 8: { // backspace
                            const newLength = this.valueBuffer.length - 1
                            this.valueBuffer = this.valueBuffer.substr(0, newLength)
                            printEnteringValue()
                            break
                        }
                        case 13: { // enter
                            if (this.valueBuffer.length) {
                                val = parseFloat(this.valueBuffer)
                                this.valueBuffer = ''
                                setCurVal(val)
                                print()
                            }
                            break
                        }
                        case 69: { // e
                            setCurInc(getCurInc() - 1)
                            print()
                            break
                        }
                        case 82: { // r
                            setCurInc(getCurInc() + 1)
                            print()
                            break
                        }
                        case 87: { // w
                            print()
                            break
                        }
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