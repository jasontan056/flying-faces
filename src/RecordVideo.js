import React, { useState } from "react";
import PropTypes from "prop-types";
import Sketch from "react-p5";

function RecordVideo(props) {
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(500, 500).parent(canvasParentRef); // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
  };
  const draw = (p5) => {
    p5.background(0);
    p5.ellipse(x, y, 70, 70);
    // NOTE: Do not use setState in draw function or in functions that is executed in draw function... pls use normal variables or class properties for this purposes
    setX(x + 1);
  };

  return <Sketch setup={setup} draw={draw} />;
}

RecordVideo.propTypes = {};

export default RecordVideo;
