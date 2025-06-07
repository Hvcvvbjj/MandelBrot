export default class CanvasManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.worker = new Worker('mandelbrotWorker.js');

        this.maxIterations = 200;
        this.zoom = 1;
        this.offsetX = -0.5;
        this.offsetY = 0;
        this.colorScheme = 'monochrome';
        this.invertColors = false;
        this.isAnimating = false;
        this.animationId = null;
        this.juliaMode = false;
        this.juliaC = { x: -0.7, y: 0.27015 };

        this.worker.addEventListener('message', (e) => {
            const { imageData } = e.data;
            const ctxImageData = new ImageData(new Uint8ClampedArray(imageData), this.canvas.width, this.canvas.height);
            this.ctx.putImageData(ctxImageData, 0, 0);
        });

        this.worker.addEventListener('error', (err) => {
            console.error('Web Worker error:', err);
        });
    }

    draw() {
        this.worker.postMessage({
            width: this.canvas.width,
            height: this.canvas.height,
            zoom: this.zoom,
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            maxIterations: this.maxIterations,
            juliaMode: this.juliaMode,
            juliaC: this.juliaC,
            colorScheme: this.colorScheme,
            invertColors: this.invertColors
        });
    }

    _animate() {
        if (this.isAnimating) {
            this.zoom *= 1.02;
            this.draw();
            this.animationId = requestAnimationFrame(this._animate.bind(this));
        }
    }

    startAnimation() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animationId = requestAnimationFrame(this._animate.bind(this));
        }
    }

    stopAnimation() {
        if (this.isAnimating) {
            this.isAnimating = false;
            cancelAnimationFrame(this.animationId);
        }
    }

    reset() {
        this.stopAnimation();
        this.maxIterations = 200;
        this.zoom = 1;
        this.offsetX = -0.5;
        this.offsetY = 0;
        this.juliaMode = false;
        this.draw();
    }

    setIterations(value) {
        this.maxIterations = parseInt(value, 10);
        this.draw();
    }

    setColorScheme(value) {
        this.colorScheme = value;
        this.draw();
    }

    setInvertColors(value) {
        this.invertColors = value;
        this.draw();
    }

    toggleJuliaMode() {
        this.stopAnimation();
        this.juliaMode = !this.juliaMode;
        this.draw();
    }

    resize() {
        const { clientWidth, clientHeight } = this.canvas;
        this.canvas.width = clientWidth;
        this.canvas.height = clientHeight;
        this.draw();
    }
}
