import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RecordVideo from "./RecordVideo";
import Editor from "./Editor";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/editor">
          <Editor />
        </Route>
        <Route path="/">
          <RecordVideo />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
