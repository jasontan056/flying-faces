import React, { useRef, useEffect } from "react";
import p5 from "p5";

function RecordVideo({ onEdit }) {
  const p5Ref = useRef(null);
  const capturedFrames = useRef([]);
  const capture = useRef(null);
  const recording = useRef(false);

  useEffect(() => {
    const sketch = (p5) => {
      p5.setup = () => {
        p5.createCanvas(640, 480);
        capture.current = p5.createCapture(p5.VIDEO);
        capture.current.size(640, 480);
        capture.current.hide();
      };

      p5.draw = () => {
        p5.image(capture.current.get(), 0, 0);

        if (recording.current) {
          capturedFrames.current.push(capture.current.get());
        }
      };
    };

    const p5Instance = new p5(sketch, p5Ref.current);
    return () => p5Instance.remove();
  }, []);

  const onRecordButtonClicked = () => {
    recording.current = true;
  };

  const onStopButtonClicked = () => {
    recording.current = false;
  };

  const onEditButtonClicked = () => {
    if (capturedFrames.current.length === 0) {
      return;
    }

    onEdit(capturedFrames.current);
  };

  return (
    <div>
      <button onClick={onRecordButtonClicked}>Record</button>
      <button onClick={onStopButtonClicked}>Stop</button>
      <button onClick={onEditButtonClicked}>Edit</button>
      <div ref={p5Ref}></div>
    </div>
  );
}

export default RecordVideo;
