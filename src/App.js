import React from 'react';
import './App.css';
import { Stage, Layer } from 'react-konva';
import Spinner from './Spinner.js';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      stageHeight: 1
    }
    this.stageContainer = React.createRef();
  }

  checkSize = () => {

    const height = this.stageContainer.current.offsetHeight;
    this.setState({
      stageHeight: height
    });

  }
  
  componentDidMount() {

    this.checkSize();
    window.addEventListener("resize", this.checkSize);

  }

  componentWillUnmount() {

    window.removeEventListener("resize", this.checkSize);

  }

  render() {

    return (

      <div className="box">

        <div className="bar">

          <p>Wheeler Decide</p>

        </div>

        <div className="main" ref={this.stageContainer}>

          <Stage width={window.innerWidth} height={this.state.stageHeight}>
            <Layer>
              <Spinner x={window.innerWidth*(1/3)} y={this.state.stageHeight/2} radius={400} items={["yep", "aeiouaeiou", "poggers", "another", "AGANE"]} />
            </Layer>
          </Stage>

          <div className="options">

            <label htmlFor="urmom">Options:</label>
            <textarea id="urmom" name="urmom" rows="5" cols="50" placeholder="type here loser"></textarea>

          </div>

        </div>


      </div>

    );
  }
}

export default App;
