if (typeof self !== "undefined" && self.addEventListener) {
    self.addEventListener("message", (e) => {
        const { width, height, zoom, offsetX, offsetY, maxIterations, juliaMode, juliaC, colorScheme, invertColors } = e.data;
        const imageData = new Uint8ClampedArray(width * height * 4);

        for (let px = 0; px < width; px++) {
            for (let py = 0; py < height; py++) {
                let x0 = (px / width - 0.5) * 4 / zoom + offsetX;
                let y0 = (py / height - 0.5) * 4 / zoom + offsetY;

            let x = x0;
            let y = y0;
            let iteration = 0;

            if (juliaMode) {
                // Use Julia constant
                x0 = juliaC.x;
                y0 = juliaC.y;
            }

            while (x * x + y * y <= 4 && iteration < maxIterations) {
                const tempX = x * x - y * y + x0;
                y = 2 * x * y + y0;
                x = tempX;
                iteration++;
            }

                const pixelIndex = (px + py * width) * 4;
                const ratio = iteration / maxIterations;
                const color = getColor(ratio, iteration, maxIterations, colorScheme, invertColors);
                imageData[pixelIndex] = color[0];
                imageData[pixelIndex + 1] = color[1];
                imageData[pixelIndex + 2] = color[2];
                imageData[pixelIndex + 3] = 255; // Alpha channel
            }
        }

        self.postMessage({ imageData });
    });
}

function getColor(ratio, iteration, maxIterations, colorScheme, invertColors) {
    let r, g, b;
    if (iteration === maxIterations) {
        // Point is in the Mandelbrot or Julia set
        r = 0;
        g = 0;
        b = 0;
    } else {
        // Apply different color schemes
        switch (colorScheme) {
            case 'rainbow':
                r = Math.floor(255 * Math.sin(3.14 * ratio));
                g = Math.floor(255 * Math.sin(3.14 * (1 - ratio)));
                b = Math.floor(255 * ratio);
                break;
            case 'cool':
                r = 0;
                g = Math.floor(255 * ratio);
                b = Math.floor(255 * (1 - ratio));
                break;
            case 'fire':
                r = Math.floor(255 * Math.pow(ratio, 0.3));
                g = Math.floor(255 * Math.pow(ratio, 0.5));
                b = Math.floor(255 * Math.pow(ratio, 0.1));
                break;
            case 'ocean':
                r = Math.floor(255 * (1 - ratio));
                g = Math.floor(255 * Math.pow(ratio, 0.3));
                b = Math.floor(255 * ratio);
                break;
            case 'monochrome':
            default:
                const shade = Math.floor(255 * ratio);
                r = shade;
                g = shade;
                b = shade;
                break;
        }
    }

    // Invert colors if the option is enabled
    if (invertColors) {
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
    }

    return [r, g, b];
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getColor };
}
