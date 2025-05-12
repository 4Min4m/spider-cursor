import React from 'react';
import './App.css';
import SpiderCursor from './SpiderCursor';

function App() {
  return (
    <div className="App">
      <SpiderCursor />
      <div className="content">
        <h1>Interactive Spider Cursor</h1>
        <p>Move your cursor to interact with the spiders!</p>
        <p className="credit">Meowish</p>
      </div>
    </div>
  );
}

export default App;