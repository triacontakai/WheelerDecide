import React from 'react';
import Konva from 'konva';
import { Wedge, Text } from 'react-konva';

const FRICTION = .0001;
const SPIN_MIN = 3;
const SPIN_MAX = 10;
const FRAME_RATE = 50;

class Spinner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spinAngle: 360,
        };
        this.colors = this.props.items.map(() => Konva.Util.getRandomColor());
        this.sliceAngle = 360 / this.props.items.length;
        this.animationTime = 0;
        this.previousFrameTime = 0;
    }

    handleClick() {
        if(!this.timerID) {
            this.previousFrameTime = performance.now()

            // calculate index and degrees of item to land on
            const i = Math.floor(Math.random() * this.props.items.length);
            const lowerBound = i * this.sliceAngle;
            const upperBound = (i+1) * this.sliceAngle;
            const spinCount = Math.floor(Math.random() * (SPIN_MAX - SPIN_MIN) + SPIN_MIN);
            const theta = (Math.random() * (upperBound - lowerBound) + lowerBound - this.state.spinAngle) + 360*spinCount + 180;

            const initialV = Math.sqrt(2 * FRICTION * theta);
            const initialSpin = this.state.spinAngle;

            console.log(this.props.items[i]);

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
        this.animationTime += performance.now() - this.previousFrameTime;
        const velocity = initialV - this.animationTime*FRICTION;

        this.previousFrameTime = performance.now();

        // this creates problems at high FRICTION values on the last frame
        // TODO: think of some way to avoid that, maybe special case for last frame here?
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
            currentRotation -= this.sliceAngle;
            const middleAngle = currentRotation + this.sliceAngle/2;
            slices.push(
                <Wedge
                    x={this.props.x}
                    y={this.props.y}
                    radius={this.props.radius} /*TODO: scale with viewport size */
                    angle={this.sliceAngle}
                    fill={this.colors[i]}
                    rotation={currentRotation}
                    onClick={() => this.handleClick()}
                    key={this.props.items[i] +"-wedge"}
                    stroke="black"
                    strokeWidth={1}
                />
            );
            slices.push(
                <Text
                    width={this.props.radius}
                    text={this.props.items[i]}
                    rotation={middleAngle + 180}
                    x={this.props.x + Math.cos(middleAngle * Math.PI/180) * this.props.radius*.90}
                    y={this.props.y + Math.sin(middleAngle * Math.PI/180) * this.props.radius*.90}
                    fontSize={24}
                    key={this.props.items[i] + "-text"}
                    onClick={() => this.handleClick()}
                />
            );
        }

        return slices;
    }
}

export default Spinner;