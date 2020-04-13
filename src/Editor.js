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

  useEffect(() => {
    const sketch = (p5) => {
      let maskLayer;

      p5.setup = () => {
        p5.createCanvas(640, 480);
        maskLayer = p5.createGraphics(640, 480);
        maskLayer.clear();
      };

      p5.draw = () => {
        const frameIdx = sliderValueRef.current;
        const frame = frames[frameIdx];
        p5.image(frame, 0, 0);

        if (p5.mouseIsPressed) {
          maskLayer.fill(255, 0, 0, 255);
          maskLayer.noStroke();
          maskLayer.ellipse(p5.mouseX, p5.mouseY, 30);
        }

        // Create a copy of the mask layer to draw the brushed area on the canvas.
        const paintGuide = p5.createImage(maskLayer.width, maskLayer.height);
        paintGuide.copy(
          maskLayer,
          0,
          0,
          maskLayer.width,
          maskLayer.height,
          0,
          0,
          maskLayer.width,
          maskLayer.height
        );
        paintGuide.loadPixels();
        for (let i = 0; i < paintGuide.pixels.length; i += 4) {
          const alpha = paintGuide.pixels[i + 3];
          if (alpha > 0) {
            paintGuide.pixels[i + 3] = 50;
          }
        }
        paintGuide.updatePixels();
        p5.image(paintGuide, 0, 0);

        // Build masked frame.
        const maskedFrame = p5.createImage(frame.width, frame.height);
        maskedFrame.copy(
          frame,
          0,
          0,
          frame.width,
          frame.height,
          0,
          0,
          frame.width,
          frame.height
        );
        maskedFrame.mask(maskLayer);
      };
    };

    new p5(sketch, p5Ref.current);
  }, [frames]);

  const valueText = useCallback((value) => `Frame ${value}`, []);

  const handleSliderChange = useCallback((event, newValue) => {
    console.log(newValue);
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
