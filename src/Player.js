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
  const playing = useRef(true);
  const curIdx = useRef(0);

  useEffect(() => {
    const sketch = (p5) => {
      p5.setup = () => {
        p5.createCanvas(640, 480);
      };

      p5.draw = () => {
        if (playing.current && curIdx.current < frames.length) {
          p5.image(frames[curIdx.current], 0, 0);
          curIdx.current++;
        }
      };
    };

    const p5Instance = new p5(sketch, p5Ref.current);

    return () => p5Instance.remove();
  }, [frames]);

  const onPlayButtonClicked = () => {
    playing.current = true;
  };

  const onStopButtonClicked = () => {
    playing.current = false;
    curIdx.current = 0;
  };

  return (
    <div className={classes.root}>
      <button onClick={onPlayButtonClicked}>Play</button>
      <button onClick={onStopButtonClicked}>Stop</button>
      <div ref={p5Ref}></div>
    </div>
  );
}

export default Player;
