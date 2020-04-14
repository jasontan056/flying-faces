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

  const p5ElementRef = useRef(null);
  const p5Ref = useRef(null);
  const sliderValueRef = useRef(0);
  const masks = useRef({});

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
        p5Ref.current = p5;
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
          masks.current[lastFrameIdx] = copyImage(p5, maskLayer);
        }

        if (frameIdx in masks.current) {
          // Create a copy of the mask layer to draw the brushed area on the canvas.
          const paintGuide = copyImage(p5, maskLayer);
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

    new p5(sketch, p5ElementRef.current);
  }, [frames]);

  const valueText = useCallback((value) => `Frame ${value}`, []);

  const handleSliderChange = useCallback((event, newValue) => {
    sliderValueRef.current = newValue;
  }, []);

  const onRenderButtonClicked = () => {
    if (!p5Ref.current) {
      return;
    }

    setRenderedFrames(animateFaces(p5Ref.current, frames, masks.current));
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
