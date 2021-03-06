import React from 'react';
import Konva from 'konva';
import { Wedge, Line} from 'react-konva';
import TruncatingText from './TruncatingText.js';

const FRICTION = .0001;
const SPIN_MIN = 5;
const SPIN_MAX = 10;
const FONT_SIZE = 22;

class Spinner extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            spinAngle: 360,
        };
        this.sliceAngle = [];
        this.animationStartTime = null;

        this.colors = [];
    }

    handleClick() {
        if(!this.animationID) {

            // calculate index and degrees of item to land on
            // TODO: make theta generation more dramatic (i.e. more likely to land near edge of a wedge)
            const i = Math.floor(Math.random() * this.props.items.length);
            const lowerBound = i * this.sliceAngle;
            const upperBound = (i+1) * this.sliceAngle;
            const spinCount = Math.floor(Math.random() * (SPIN_MAX+1 - SPIN_MIN) + SPIN_MIN);
            const theta = (Math.random() * (upperBound - lowerBound) + lowerBound - this.state.spinAngle) + 360*spinCount + 180;

            const initialV = Math.sqrt(2 * FRICTION * theta);
            const initialSpin = this.state.spinAngle;

            console.log(this.props.items[i]);

            /*
            this.timerID = setInterval(
                () => this.tick(initialV, initialSpin),
                1000/FRAME_RATE
            );
            */
           this.animationID = window.requestAnimationFrame((ts) => this.tick(ts, initialV, initialSpin));
        }
    }

    componentWillUnmount() {
        if(this.animationID)
            window.cancelAnimationFrame(this.animationID);
    }

    tick(timestamp, initialV, initialSpin, lastVelocity) {
        // this creates problems at high FRICTION values on the last frame
        // TODO: think of some way to avoid that, maybe special case for last frame here?
        if(lastVelocity <= 0) {
            this.animationID = false;
            this.animationStartTime = null;
            return;
        }

        if(this.animationStartTime === null)
            this.animationStartTime = timestamp
        const animationTime = timestamp - this.animationStartTime;
        const velocity = initialV - animationTime*FRICTION;

        this.previousFrameTime = performance.now();

        this.setState({
            spinAngle: (initialSpin + initialV*animationTime - .5*FRICTION*animationTime*animationTime) % 360
        }, () => window.requestAnimationFrame((ts) => this.tick(ts, initialV, initialSpin, velocity)));
    }

    render() {
    
        const colors = this.props.items.map((item, i) => {
            return this.props.colors[i % this.props.colors.length];
        });
        this.sliceAngle = 360 / this.props.items.length;

        let elements = [];
        let currentRotation = this.state.spinAngle;
        for (let i = 0; i < this.props.items.length; i++) {
            currentRotation -= this.sliceAngle;
            const middleAngle = currentRotation + this.sliceAngle/2;
            elements.push(
                <Wedge
                    x={this.props.x}
                    y={this.props.y}
                    radius={this.props.radius} /*TODO: scale with viewport size */
                    angle={this.sliceAngle}
                    fill={colors[i]}
                    rotation={currentRotation}
                    onClick={() => this.handleClick()}
                    key={i +"-wedge"}
                    stroke="black"
                    strokeWidth={1}
                    perfectDrawEnabled={false}
                    listening={!this.animationID}
                />
            );

            // calculate text contrast
            // TODO: move to constructor since we don't need to recalculate this every time
            const rgb = Konva.Util.getRGB(colors[i]);
            let textColor;
            if((rgb.r*0.299 + rgb.g*0.587 + rgb.b*0.114) > 186)
                textColor = "#000000";
            else
                textColor = "#ffffff";

            // dude these are literally just random numbers i tried
            // TODO: should probably improve them some time

            elements.push(
                <TruncatingText
                    width={this.props.radius}
                    text={this.props.items[i]}
                    rotation={middleAngle + 180}
                    x={this.props.x + Math.cos(middleAngle * Math.PI/180) * this.props.radius*.95}
                    y={this.props.y + Math.sin(middleAngle * Math.PI/180) * this.props.radius*.95}
                    offsetY={FONT_SIZE/2}
                    fontSize={FONT_SIZE}
                    fill={textColor}
                    key={i + "-text"}
                    onClick={() => this.handleClick()}
                    maxWidth={this.props.radius*.70} // TODO: base this off of the slice angle for smaller slices
                    perfectDrawEnabled={false}
                    listening={!this.animationID}
                />
            );
        }

        elements.push(
            <Line
                points={[
                    this.props.x - this.props.radius*.93, this.props.y,
                    this.props.x - this.props.radius*1.15, this.props.y + this.props.radius*.03,
                    this.props.x - this.props.radius*1.15, this.props.y - this.props.radius*.03,
                ]}
                fill="#6abfcc"
                closed={true}
            />
        );

        return elements;
    }
}

export default Spinner;