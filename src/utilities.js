import p5 from "p5";

export function copyImage(p5Instance, src) {
  const copy = p5Instance.createImage(src.width, src.height);
  copy.copy(src, 0, 0, src.width, src.height, 0, 0, src.width, src.height);

  return copy;
}

const VELOCITY = 3;

export function animateFaces(p5Instance, framesSrc, masks) {
  const frames = framesSrc.map((frame) => copyImage(p5Instance, frame));
  for (const endingIdx in masks) {
    const mask = masks[endingIdx];
    const face = copyImage(p5Instance, frames[endingIdx]);
    face.mask(mask);

    const graphics = p5Instance.createGraphics(mask.width, mask.height);
    const vel = p5.Vector.random2D().setMag(VELOCITY);
    let pos = p5Instance.createVector(0, 0);
    for (let i = endingIdx; i >= 0; i--) {
      const frame = frames[i];
      graphics.clear();
      // Apply both the original frame as well as the face to the graphics buffer.
      graphics.image(frame, 0, 0);
      graphics.image(face, pos.x, pos.y);
      pos.add(vel);

      // Save resulting combination back into the frame array.
      frames[i] = copyImage(p5Instance, graphics);

      if (Math.abs(pos.x) > frame.width || Math.abs(pos.y) > frame.height) {
        break;
      }
    }
    graphics.remove();
  }

  return frames;
}
