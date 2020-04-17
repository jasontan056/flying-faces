import React, { useEffect, useRef, useCallback } from "react";
import p5 from "p5";
import { makeStyles } from "@material-ui/core/styles";
const createCanvasRecorder = require("canvas-record");

const useStyles = makeStyles({
  root: {
    boxSizing: "content-box",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 800,
  },
});

const CANVAS_ID = "PLAYER_CANVAS";

function Player({ frames = [] }) {
  const classes = useStyles();

  const p5Ref = useRef(null);
  const playingRef = useRef(true);
  const curIdxRef = useRef(0);
  const recorderRef = useRef(null);

  useEffect(() => {
    const sketch = (p5) => {
      p5.setup = () => {
        const canvas = p5.createCanvas(640, 480);
        canvas.id(CANVAS_ID);
      };

      p5.draw = () => {
        if (!playingRef.current) {
          return;
        }
        if (curIdxRef.current < frames.length) {
          p5.image(frames[curIdxRef.current], 0, 0);
          curIdxRef.current++;
        } else {
          playingRef.current = false;
          if (recorderRef.current) {
            recorderRef.current.stop();
            recorderRef.current.dispose();
            recorderRef.current = null;
          }
        }
      };
    };

    const p5Instance = new p5(sketch, p5Ref.current);

    return () => p5Instance.remove();
  }, [frames]);

  const onPlayButtonClicked = () => {
    playingRef.current = true;
  };

  const onStopButtonClicked = () => {
    playingRef.current = false;
    curIdxRef.current = 0;
  };

  const onExportButtonClicked = () => {
    curIdxRef.current = 0;
    recorderRef.current = createCanvasRecorder(
      document.getElementById(CANVAS_ID)
    );
    recorderRef.current.start();
    playingRef.current = true;
  };

  return (
    <div className={classes.root}>
      <button onClick={onPlayButtonClicked}>Play</button>
      <button onClick={onStopButtonClicked}>Stop</button>
      <button onClick={onExportButtonClicked}>Export</button>
      <div ref={p5Ref}></div>
    </div>
  );
}

export default Player;
