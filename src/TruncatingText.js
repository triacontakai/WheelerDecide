import React from 'react';
import { Text } from 'react-konva';

/**
 * Truncating Text
 * Wrapper for Konva text class with maxWidth prop
 * Automatically truncates text if it exceeds maxWidth
 */
class TruncatingText extends React.PureComponent {
    constructor(props) {
        super(props);
        this.internalText = React.createRef();
    }

    truncateText() {
        let width = this.internalText.current.getTextWidth();
        let text = this.internalText.current.getText();


        while (width > this.props.maxWidth) {
            console.log("INITIAL: "+ width);
            console.log(text);
            this.internalText.current.text(text.substring(0, text.length-3) + '...')
            
            text = this.internalText.current.getText();
            text = text.substring(0, text.length-3)
            
            width = this.internalText.current.getTextWidth();
            console.log("FINAL: "+ width);
            console.log(text);
        }
    }

    componentDidMount() {
        this.truncateText();
    }

    componentDidUpdate() {
        this.truncateText();
    }

    render() {
        const {maxWidth, text, ...other} = this.props;

        return (
            <Text
                text={text}
                ref={this.internalText}
                {...other}
            />
        )
    }
}

export default TruncatingText;