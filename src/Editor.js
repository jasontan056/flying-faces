import React, { useEffect, useRef, useCallback } from "react";
import p5 from "p5";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    boxSizing: "content-box",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 800,
  },
});

function Editor({ frames = [] }) {
  const classes = useStyles();

  const p5Ref = useRef(null);
  const sliderValueRef = useRef(0);
  const masks = useRef({});

  useEffect(() => {
    const sketch = (p5) => {
      let maskLayer;
      let lastFrameIdx;

      const copyImage = (src) => {
        const copy = p5.createImage(src.width, src.height);
        copy.copy(
          src,
          0,
          0,
          src.width,
          src.height,
          0,
          0,
          src.width,
          src.height
        );

        return copy;
      };

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
        maskLayer = p5.createGraphics(640, 480);
        maskLayer.clear();
      };

      p5.draw = () => {
        const frameIdx = sliderValueRef.current;

        if (frameIdx !== lastFrameIdx) {
          maskLayer.clear();
          const existingMask = masks.current[frameIdx];
          if (existingMask) {
            maskLayer.image(existingMask, 0, 0);
          }

          lastFrameIdx = frameIdx;
        }

        const frame = frames[frameIdx];
        p5.image(frame, 0, 0);

        if (mouseIsPressedAndInCanvas()) {
          maskLayer.fill(255, 0, 0, 255);
          maskLayer.noStroke();
          maskLayer.ellipse(p5.mouseX, p5.mouseY, 30);
          masks.current[lastFrameIdx] = copyImage(maskLayer);
        }

        if (frameIdx in masks.current) {
          // Create a copy of the mask layer to draw the brushed area on the canvas.
          const paintGuide = copyImage(maskLayer);
          paintGuide.loadPixels();
          for (let i = 0; i < paintGuide.pixels.length; i += 4) {
            const alpha = paintGuide.pixels[i + 3];
            if (alpha > 0) {
              paintGuide.pixels[i + 3] = 50;
            }
          }
          paintGuide.updatePixels();
          p5.image(paintGuide, 0, 0);
        }
      };
    };

    new p5(sketch, p5Ref.current);
  }, [frames]);

  const valueText = useCallback((value) => `Frame ${value}`, []);

  const handleSliderChange = useCallback((event, newValue) => {
    sliderValueRef.current = newValue;
  }, []);

  return (
    <div className={classes.root}>
      <div ref={p5Ref}></div>
      <Slider
        defaultValue={0}
        getAriaValueText={valueText}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        min={0}
        max={frames.length}
        onChange={handleSliderChange}
      />
    </div>
  );
}

export default Editor;
