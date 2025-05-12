import React from 'react';
import SpiderCursor from './SpiderCursor';
import './App.css';

function App() {
  return (
    <div className="App">
      <SpiderCursor />
      <div className="content">
        <h1>Spider Cursor</h1>
        <p>Move your mouse to interact with the web-like cursor!</p>
      </div>
    </div>
  );
}

export default App;