const template = document.createElement('template')
template.innerHTML = `
    <style>
        div {
            display: inline-block;
        }
        #label {
            width: 100px;
            text-align: right;
            font-family: roboto, sans-serif;
        }
        #input {
            width: 50px;
            text-align: center;
        }
    </style>
    <div class="flow-slider">
        <div id="label"></div>
        <input type="range" min="1" max="100" value="50" class="slider" id="slider">
        <input id="input" type="number" />
    </div>
`
class FlowSlider extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.label = this.shadowRoot.querySelector('#label')
        this.slider = this.shadowRoot.querySelector('#slider')
        this.textInput = this.shadowRoot.querySelector('#input')
    }

    connectedCallback() {
        this.min = this.getAttribute('min')
        this.max = this.getAttribute('max')
        this.value = this.getAttribute('value')
        this.step = this.getAttribute('step')

        this.label.innerText = this.getAttribute('label')

        this.slider.setAttribute('min', this.min)
        this.slider.setAttribute('max', this.max)
        this.slider.setAttribute('value', this.value)
        this.slider.setAttribute('step', this.step)

        this.textInput.setAttribute('value', this.value)

        this.slider.addEventListener('input', this.onSliderInput)
        this.textInput.addEventListener('input', this.onTextInputInput)
        this.textInput.addEventListener('keydown', this.onKeydownTextInput)
        this.textInput.addEventListener('blur', this.onBlurTextInput)
    }

    disconnectedCallback() {
        this.slider.removeEventListener('input', this.onSliderInput)
        this.textInput.removeEventListener('input', this.onTextInputInput)
        this.textInput.removeEventListener('keydown', this.onKeydownTextInput)
        this.textInput.removeEventListener('blur', this.onBlurTextInput)
    }

    onSliderInput = e => {
        this.textInput.value = e.target.value
    }

    onTextInputInput = e => {
        this.value = Math.max(this.min, Math.min(this.max, e.target.value))
        this.slider.value = this.value
    }

    onKeydownTextInput = e => {
        if (e.key === "Enter") {
            this.onBlurTextInput(e)
        }
    }

    onBlurTextInput = e => {
        this.value = Math.max(this.min, Math.min(this.max, e.target.value))
        this.slider.value = this.value
        this.textInput.value = this.value
    }
}
window.customElements.define('flow-slider', FlowSlider)