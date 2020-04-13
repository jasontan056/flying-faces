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
      p5.setup = () => {
        p5.createCanvas(640, 480);
      };

      p5.draw = () => {
        //p5.background(100);
        const frameIdx = sliderValueRef.current;
        if (frameIdx < frames.length) {
          p5.image(frames[frameIdx], 0, 0);
        }
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
