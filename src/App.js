import React, { useState } from "react";
import RecordVideo from "./RecordVideo";
import Editor from "./Editor";

const Mode = {
  RECORD: "RECORD",
  EDIT: "EDIT",
};

function App() {
  const [mode, setMode] = useState(Mode.RECORD);
  const [capturedFrames, setCapturedFrames] = useState([]);

  const onEdit = (captureFrames) => {
    setMode(Mode.EDIT);
    setCapturedFrames(captureFrames);
  };

  if (mode === Mode.RECORD) {
    return <RecordVideo onEdit={onEdit} />;
  } else {
    return <Editor frames={capturedFrames} />;
  }
}

export default App;
