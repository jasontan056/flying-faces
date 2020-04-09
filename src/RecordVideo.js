import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import Sketch from "react-p5";

function RecordVideo(props) {
  const capturedFramesRef = useRef([]);
  const captureRef = useRef(null);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(640, 480);
    const capture = p5.createCapture(p5.VIDEO);
    capture.size(640, 480);
    capture.hide();
    captureRef.current = capture;
  };
  const draw = (p5) => {
    p5.background(255);
    const capture = captureRef.current;
    p5.image(capture, 0, 0, 320, 240);
  };

  return <Sketch setup={setup} draw={draw} />;
}

RecordVideo.propTypes = {};

export default RecordVideo;
