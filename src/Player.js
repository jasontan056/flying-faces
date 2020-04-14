import React, { useEffect, useRef, useCallback } from "react";
import p5 from "p5";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    boxSizing: "content-box",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 800,
  },
});

function Player({ frames = [] }) {
  const classes = useStyles();

  const p5Ref = useRef(null);

  useEffect(() => {
    const sketch = (p5) => {
      let frameIdx = 0;
      p5.setup = () => {
        p5.createCanvas(640, 480);
      };

      p5.draw = () => {
        if (frameIdx < frames.length) {
          p5.image(frames[frameIdx], 0, 0);
          frameIdx++;
        }
      };
    };

    new p5(sketch, p5Ref.current);
  }, [frames]);

  return (
    <div className={classes.root}>
      <div ref={p5Ref}></div>
    </div>
  );
}

export default Player;
