import React, { useState, useRef } from "react";
import Sketch from "react-p5";

function RecordVideo({ onEdit }) {
  const capturedFramesRef = useRef([]);
  const captureRef = useRef(null);
  const [recording, setRecording] = useState(false);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(640, 480);
    const capture = p5.createCapture(p5.VIDEO);
    capture.size(640, 480);
    //!!!capture.hide();
    captureRef.current = capture;
  };
  const draw = (p5) => {
    p5.background(255);
    const capture = captureRef.current;
    p5.image(capture, 0, 0, 320, 240);

    if (recording) {
      capture.loadPixels();
      capturedFramesRef.current.push([...capture.pixels]);
    }
  };

  const onRecordButtonClicked = () => {
    setRecording(true);
  };

  const onStopButtonClicked = () => {
    setRecording(false);
  };

  const onEditButtonClicked = () => {
    onEdit(capturedFramesRef.current);
  };

  return (
    <div>
      <Sketch setup={setup} draw={draw} />
      <button onClick={onRecordButtonClicked}>Record</button>
      <button onClick={onStopButtonClicked}>Stop</button>
      <button onClick={onEditButtonClicked}>Edit</button>
    </div>
  );
}

export default RecordVideo;
