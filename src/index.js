import React, { Component } from "react";
import ReactDOM from "react-dom";
import './index.css';

class Test extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="test">
                2222
            </div>
        )
    }
}
ReactDOM.render(<Test />, document.getElementById('app'));
