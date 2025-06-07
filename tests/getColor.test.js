const { getColor } = require('../MandelbrotWorker');

describe('getColor', () => {
  test('monochrome without inversion', () => {
    const color = getColor(0.5, 50, 100, 'monochrome', false);
    expect(color).toEqual([127, 127, 127]);
  });

  test('monochrome with inversion', () => {
    const color = getColor(0.5, 50, 100, 'monochrome', true);
    expect(color).toEqual([128, 128, 128]);
  });

  test('rainbow without inversion', () => {
    const color = getColor(0.25, 25, 100, 'rainbow', false);
    const expected = [
      Math.floor(255 * Math.sin(3.14 * 0.25)),
      Math.floor(255 * Math.sin(3.14 * (1 - 0.25))),
      Math.floor(255 * 0.25)
    ];
    expect(color).toEqual(expected);
  });

  test('rainbow with inversion', () => {
    const orig = getColor(0.25, 25, 100, 'rainbow', false);
    const inverted = getColor(0.25, 25, 100, 'rainbow', true);
    expect(inverted).toEqual(orig.map(c => 255 - c));
  });
});
