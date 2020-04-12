import React, { useEffect, useRef } from "react";
import p5 from "p5";

function Editor({ frames }) {
  const p5Ref = useRef(null);

  useEffect(() => {
    let i = 0;
    const sketch = (p5) => {
      p5.setup = () => {
        p5.createCanvas(640, 480);
      };

      p5.draw = () => {
        p5.background(100);
        p5.image(frames[i], 0, 0);
        if (i < frames.length - 1) {
          i++;
        }
      };
    };

    new p5(sketch, p5Ref.current);
  }, [frames]);
  return (
    <div>
      <div ref={p5Ref}></div>
    </div>
  );
}

export default Editor;
