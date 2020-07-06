import React from 'react';
import Konva from 'konva';
import { Wedge } from 'react-konva';

class Spinner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spinAngle: 200,
        };
        this.colors = this.props.items.map(() => Konva.Util.getRandomColor());
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1
        )
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            spinAngle: this.state.spinAngle + 3
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
                radius={this.props.radius}
                angle={sliceAngle}
                fill={this.colors[i]}
                rotation={currentRotation}
            />);

            currentRotation += sliceAngle;
        }

        return slices;
    }
}

export default Spinner;