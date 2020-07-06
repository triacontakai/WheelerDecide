import React from 'react';
//import './App.css';
import { Stage, Layer } from 'react-konva';
import Spinner from './Spinner.js';

function App() {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Spinner x={window.innerWidth/2} y={window.innerHeight/2} radius={400} items={["yep", "cock", "poggers"]} />
      </Layer>
    </Stage>
  );
}

export default App;
