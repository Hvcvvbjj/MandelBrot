# Mandelbrot Set Visualizer

This project provides an interactive Mandelbrot Set visualizer implemented with HTML5 Canvas and JavaScript. A Web Worker is used to offload heavy calculations from the main UI thread, keeping interactions responsive while exploring the fractal.

## Project Setup

1. Clone the repository or download its contents.
2. Because the files use a Web Worker, they must be served over HTTP rather than opened directly from the file system. Any static server will work.

Example using Python 3:

```bash
python3 -m http.server
```

This command serves the current directory at `http://localhost:8000/`. Navigate to that address in a browser and open `Index.html`.

## Usage

- Use the **Iterations** slider to control how many iterations are calculated for each pixel.
- Choose a **Color Scheme** from the drop-down menu.
- Enable **Invert Colors** to swap the color palette.
- Use the buttons to start/stop animation, reset the view, toggle Julia mode, enter full screen, or switch between dark and light themes.

Zooming occurs automatically during animation. You can resize the browser window, and the canvas will adapt to the new size.

Enjoy exploring the Mandelbrot set!
