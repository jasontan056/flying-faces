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

    const vel = p5.Vector.random2D().setMag(VELOCITY);
    let pos = p5Instance.createVector(0, 0);
    for (let i = endingIdx; i >= 0; i--) {
      const frame = frames[i];
      frame.blend(
        face,
        0,
        0,
        frame.width,
        frame.height,
        pos.x,
        pos.y,
        frame.width,
        frame.height,
        p5.BLEND
      );
      pos.add(vel);

      if (Math.abs(pos.x) > frame.width || Math.abs(pos.y) > frame.height) {
        break;
      }
    }
  }

  return frames;
}
