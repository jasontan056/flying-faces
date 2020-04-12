import React, { useState } from "react";
import PropTypes from "prop-types";

function Editor({ frames }) {
  /* const [curFrameIdx, setCurFrameIdx] = useState(0);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(640, 480);
  };

  const draw = (p5) => {
    if (curFrameIdx < frames.length) {
      const pixels = frames[curFrameIdx];
      const image = p5.createImage(640, 480);
      image.pixels = pixels;
      image.updatePixels();
      p5.image(image, 0, 0, 640, 480);

      setCurFrameIdx(curFrameIdx + 1);
    }
  };

  return (
    <div>
      editor
      <Sketch setup={setup} draw={draw} />
    </div>
  );*/
  return <div>editor</div>;
}

//Editor.propTypes = {};

export default Editor;
