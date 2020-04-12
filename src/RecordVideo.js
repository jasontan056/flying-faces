import React, { useRef, useEffect } from "react";
import p5 from "p5";

function RecordVideo({ onEdit }) {
  const p5Ref = useRef(null);

  const sketch = (p5) => {
    p5.setup = () => {
      p5.createCanvas(640, 480);
    };

    p5.draw = () => {
      p5.background(100);
    };
  };

  useEffect(() => {
    new p5(sketch, p5Ref.current);
  }, []);

  return <div ref={p5Ref}></div>;
}

export default RecordVideo;
