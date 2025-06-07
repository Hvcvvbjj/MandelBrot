const canvas = document.getElementById("mandelbrotCanvas");
const ctx = canvas.getContext("2d");
const iterationsInput = document.getElementById("iterations");
const colorSchemeSelect = document.getElementById("colorScheme");
const invertColorsCheckbox = document.getElementById("invertColors");
const startAnimationButton = document.getElementById("startAnimation");
const stopAnimationButton = document.getElementById("stopAnimation");
const resetButton = document.getElementById("reset");
const toggleJuliaButton = document.getElementById("toggleJuliaButton");
const saveButton = document.getElementById("saveButton");

let maxIterations = parseInt(iterationsInput.value);
let zoom = 1;
let offsetX = -0.5;
let offsetY = 0;
let colorScheme = colorSchemeSelect.value;
let invertColors = false;
let animationId;
let isAnimating = false;
let juliaMode = false;
let juliaC = { x: -0.7, y: 0.27015 };

// Initialize Web Worker only once
let worker = new Worker("mandelbrotWorker.js");

function drawMandelbrotWithWorker() {
    if (!canvas || !ctx) {
        console.log("Canvas or context not found");
        return;
    }

    worker.postMessage({
        width: canvas.width,
        height: canvas.height,
        zoom: zoom,
        offsetX: offsetX,
        offsetY: offsetY,
        maxIterations: maxIterations,
        juliaMode: juliaMode,
        juliaC: juliaC,
        colorScheme: colorScheme,
        invertColors: invertColors
    });
}

// Set up worker response handling
worker.addEventListener("message", (e) => {
    const { imageData } = e.data;
    const ctxImageData = new ImageData(new Uint8ClampedArray(imageData), canvas.width, canvas.height);
    ctx.putImageData(ctxImageData, 0, 0);
});

// Handle worker errors
worker.addEventListener("error", (err) => {
    console.error("Web Worker error:", err);
});

// Animation function
function animate() {
    if (isAnimating) {
        zoom *= 1.02; // Smoothly zoom in
        drawMandelbrotWithWorker();
        animationId = requestAnimationFrame(animate);
    }
}

function startAnimation() {
    if (!isAnimating) {
        isAnimating = true;
        animationId = requestAnimationFrame(animate);
        console.log("Animation started");
    }
}

function stopAnimation() {
    if (isAnimating) {
        isAnimating = false;
        cancelAnimationFrame(animationId);
        console.log("Animation stopped");
    }
}

function saveCanvasAsPNG() {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "mandelbrot.png";
    link.click();
}

// Event listeners
iterationsInput.addEventListener("input", () => {
    maxIterations = parseInt(iterationsInput.value);
    drawMandelbrotWithWorker();
});

colorSchemeSelect.addEventListener("change", () => {
    colorScheme = colorSchemeSelect.value;
    drawMandelbrotWithWorker();
});

invertColorsCheckbox.addEventListener("change", () => {
    invertColors = invertColorsCheckbox.checked;
    drawMandelbrotWithWorker();
});

toggleJuliaButton.addEventListener("click", () => {
    stopAnimation();
    juliaMode = !juliaMode;
    drawMandelbrotWithWorker();
});

resetButton.addEventListener("click", () => {
    stopAnimation();
    maxIterations = 200;
    zoom = 1;
    offsetX = -0.5;
    offsetY = 0;
    juliaMode = false;
    drawMandelbrotWithWorker();
});

startAnimationButton.addEventListener("click", startAnimation);
stopAnimationButton.addEventListener("click", stopAnimation);
saveButton.addEventListener("click", saveCanvasAsPNG);

// Initial draw
drawMandelbrotWithWorker();

// Handle canvas resizing
window.addEventListener("resize", () => {
    const { clientWidth, clientHeight } = canvas;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
    drawMandelbrotWithWorker();
});

// Set the initial canvas size based on the current client size
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;