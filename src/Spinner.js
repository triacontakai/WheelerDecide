import React from 'react';
import Konva from 'konva';
import { Wedge } from 'react-konva';

class Spinner extends React.Component {
    render() {
        const sliceAngle = 360 / this.props.items.length;
    
        let slices = [];
        let currentRotation = 0;
        for (let i = 0; i < this.props.items.length; i++) {
            slices.push(<Wedge
                x={this.props.x}
                y={this.props.y}
                radius={this.props.radius}
                angle={sliceAngle}
                fill={Konva.Util.getRandomColor()}
                rotation={currentRotation}
            />);

            currentRotation += sliceAngle;
        }

        return slices;
    }
}

export default Spinner;