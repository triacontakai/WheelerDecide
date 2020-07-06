import React from 'react';
import Konva from 'konva';
import { Wedge } from 'react-konva';

class Spinner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spinAngle: 0,
        };
        this.colors = this.props.items.map(() => Konva.Util.getRandomColor());
    }

    handleClick() {
        if(!this.timerID) {
          this.timerID = setInterval(
            () => this.tick(),
            1
          )
        }
    }

    componentWillUnmount() {
        if(this.timerID)
            clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            spinAngle: this.state.spinAngle + 5
        });
    }

    render() {
        const sliceAngle = 360 / this.props.items.length;
    
        let slices = [];
        let currentRotation = this.state.spinAngle;
        for (let i = 0; i < this.props.items.length; i++) {
            slices.push(<Wedge
                x={this.props.x}
                y={this.props.y}
                radius={this.props.radius} /*TODO: scale with viewport size */
                angle={sliceAngle}
                fill={this.colors[i]}
                rotation={currentRotation}
                onClick={() => this.handleClick()}
            />);

            currentRotation += sliceAngle;
        }

        return slices;
    }
}

export default Spinner;