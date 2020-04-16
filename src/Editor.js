import React, { useEffect, useRef, useCallback, useState } from "react";
import p5 from "p5";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import Player from "./Player";
import { copyImage, animateFaces } from "./utilities";

const useStyles = makeStyles({
  root: {
    boxSizing: "content-box",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 800,
  },

  slider: {
    marginTop: 50,
  },
});

function Editor({ frames = [] }) {
  const classes = useStyles();

  const framesRef = useRef(frames);
  framesRef.current = frames;
  const p5ElementRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const sliderValueRef = useRef(0);
  const masksRef = useRef({});

  const [renderedFrames, setRenderedFrames] = useState([]);

  useEffect(() => {
    const sketch = (p5) => {
      let maskLayer;
      let lastFrameIdx;

      const mouseIsPressedAndInCanvas = () => {
        return (
          p5.mouseIsPressed &&
          p5.mouseX >= 0 &&
          p5.mouseX < p5.width &&
          p5.mouseY >= 0 &&
          p5.mouseY < p5.height
        );
      };

      p5.setup = () => {
        p5.createCanvas(640, 480);
        p5.pixelDensity(1);
        maskLayer = p5.createGraphics(640, 480);
        maskLayer.pixelDensity(1);
        maskLayer.clear();
      };

      const copyWithTransparency = (src, dest) => {
        copyImage(src, dest);
        dest.loadPixels();
        for (let i = 0; i < dest.pixels.length; i += 4) {
          const alpha = dest.pixels[i + 3];
          if (alpha > 0) {
            dest.pixels[i + 3] = 50;
          }
        }
        dest.updatePixels();
      };

      let paintGuide;
      p5.draw = () => {
        const frameIdx = sliderValueRef.current;

        if (frameIdx !== lastFrameIdx) {
          // Copy mask layer into the last frame's mask.
          const lastFrameMask = masksRef.current[lastFrameIdx];
          if (lastFrameMask) {
            copyImage(maskLayer, masksRef.current[lastFrameIdx]);
          }

          maskLayer.clear();

          // Load  any existing mask for the new frame into the  mask layer.
          const existingMask = masksRef.current[frameIdx];
          if (existingMask) {
            maskLayer.image(existingMask, 0, 0);
          }

          // Copy the mask layer to the paintGuide with some transparency.
          if (paintGuide) {
            copyWithTransparency(maskLayer, paintGuide);
          }

          lastFrameIdx = frameIdx;
        }

        const frame = framesRef.current[frameIdx];
        p5.image(frame, 0, 0);

        if (mouseIsPressedAndInCanvas()) {
          maskLayer.fill(255, 0, 0, 255);
          maskLayer.noStroke();
          maskLayer.ellipse(p5.mouseX, p5.mouseY, 30);

          // If we don't already have a mask for this frame, create one.
          if (!(frameIdx in masksRef.current)) {
            masksRef.current[frameIdx] = maskLayer.get();
          }

          // Copy mask layer to paintGuide.
          if (!paintGuide) {
            paintGuide = p5.createImage(maskLayer.width, maskLayer.height);
          }
          copyWithTransparency(maskLayer, paintGuide);
        }

        // Draw the paint guide on the canvas
        if (paintGuide) {
          p5.image(paintGuide, 0, 0);
        }
      };
    };

    p5InstanceRef.current = new p5(sketch, p5ElementRef.current);

    return () => p5InstanceRef.current.remove();
  }, []);

  const valueText = useCallback((value) => `Frame ${value}`, []);

  const handleSliderChange = useCallback((event, newValue) => {
    sliderValueRef.current = newValue;
  }, []);

  const onRenderButtonClicked = () => {
    if (!p5InstanceRef.current) {
      return;
    }

    setRenderedFrames(
      animateFaces(p5InstanceRef.current, frames, masksRef.current)
    );
  };

  return (
    <div className={classes.root}>
      <button onClick={onRenderButtonClicked}>Render</button>
      <div ref={p5ElementRef}></div>
      <Slider
        className={classes.slider}
        defaultValue={0}
        getAriaValueText={valueText}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        min={0}
        max={frames.length}
        onChange={handleSliderChange}
      />
      <Player frames={renderedFrames} />
    </div>
  );
}

export default Editor;
