import React from 'react';
import Konva from 'konva';
import { Wedge } from 'react-konva';

const FRICTION = .001;
// es-lint-disable-next-line
const SPIN_MIN = 3;
const SPIN_MAX = 10;
const FRAME_RATE = 100;

class Spinner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spinAngle: 360,
        };
        this.colors = this.props.items.map(() => Konva.Util.getRandomColor());
        this.sliceAngle = 360 / this.props.items.length;
        this.animationTime = 0;
    }

    handleClick() {
        if(!this.timerID) {
            // calculate index and degrees of item to land on
            const i = Math.floor(Math.random() * this.props.items.length);
            const lowerBound = i * this.sliceAngle;
            const upperBound = (i+1) * this.sliceAngle;
            const spinCount = Math.floor(Math.random() * (SPIN_MAX - SPIN_MIN) + SPIN_MIN);
            const theta = (Math.random() * (upperBound - lowerBound) + lowerBound - this.state.spinAngle) + 360*spinCount;

            const initialV = Math.sqrt(2 * FRICTION * theta);
            const initialSpin = this.state.spinAngle;

            console.log(i);
            console.log(lowerBound);
            console.log(upperBound);
            console.log(spinCount);
            console.log(theta);
            console.log(initialV);

            this.timerID = setInterval(
                () => this.tick(initialV, initialSpin),
                1000/FRAME_RATE
            );
        }
    }

    componentWillUnmount() {
        if(this.timerID)
            clearInterval(this.timerID);
    }

    tick(initialV, initialSpin) {
        this.animationTime += 1000/FRAME_RATE;
        const velocity = initialV - this.animationTime*FRICTION;

        if(velocity <= 0) {
            clearInterval(this.timerID);
            this.timerID = null;
            this.animationTime = 0;
            return;            
        }

        this.setState({
            spinAngle: (initialSpin + initialV*this.animationTime - .5*FRICTION*this.animationTime*this.animationTime) % 360
        });
    }

    render() {
    
        let slices = [];
        let currentRotation = this.state.spinAngle;
        for (let i = 0; i < this.props.items.length; i++) {
            slices.push(<Wedge
                x={this.props.x}
                y={this.props.y}
                radius={this.props.radius} /*TODO: scale with viewport size */
                angle={this.sliceAngle}
                fill={this.colors[i]}
                rotation={currentRotation}
                onClick={() => this.handleClick()}
                key={this.props.items[i]}
            />);

            currentRotation -= this.sliceAngle;
        }

        return slices;
    }
}

export default Spinner;