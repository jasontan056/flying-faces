import p5 from "p5";

export function copyImage(src, dest) {
  src.loadPixels();
  dest.loadPixels();
  dest.pixels.set(src.pixels);
  dest.updatePixels();

  return dest;
}

const VELOCITY = 3;

export function animateFaces(p5Instance, framesSrc, masks) {
  const frames = framesSrc.map((frame) =>
    copyImage(frame, p5Instance.createImage(frame.width, frame.height))
  );
  for (const endingIdx in masks) {
    const mask = masks[endingIdx];
    const face = copyImage(
      frames[endingIdx],
      p5Instance.createImage(mask.width, mask.height)
    );
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
      frames[i] = copyImage(
        graphics,
        p5Instance.createImage(graphics.width, graphics.height)
      );

      if (Math.abs(pos.x) > frame.width || Math.abs(pos.y) > frame.height) {
        break;
      }
    }
    graphics.remove();
  }

  return frames;
}
