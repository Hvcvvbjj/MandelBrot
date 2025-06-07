import CanvasManager from './CanvasManager.js';

export default class UIController {
    constructor() {
        this.canvas = document.getElementById('mandelbrotCanvas');
        this.iterationsInput = document.getElementById('iterations');
        this.colorSchemeSelect = document.getElementById('colorScheme');
        this.invertColorsCheckbox = document.getElementById('invertColors');
        this.startAnimationButton = document.getElementById('startAnimation');
        this.stopAnimationButton = document.getElementById('stopAnimation');
        this.resetButton = document.getElementById('reset');
        this.toggleJuliaButton = document.getElementById('toggleJuliaButton');

        this.manager = new CanvasManager(this.canvas);

        // Initial canvas size
        this.manager.resize();
        this.manager.draw();
        this._bindEvents();
    }

    _bindEvents() {
        window.addEventListener('resize', () => this.manager.resize());

        this.iterationsInput.addEventListener('input', () => {
            this.manager.setIterations(this.iterationsInput.value);
        });

        this.colorSchemeSelect.addEventListener('change', () => {
            this.manager.setColorScheme(this.colorSchemeSelect.value);
        });

        this.invertColorsCheckbox.addEventListener('change', () => {
            this.manager.setInvertColors(this.invertColorsCheckbox.checked);
        });

        this.toggleJuliaButton.addEventListener('click', () => {
            this.manager.toggleJuliaMode();
        });

        this.resetButton.addEventListener('click', () => {
            this.manager.reset();
        });

        this.startAnimationButton.addEventListener('click', () => this.manager.startAnimation());
        this.stopAnimationButton.addEventListener('click', () => this.manager.stopAnimation());
    }
}
