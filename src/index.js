import React, { Component } from "react";
import ReactDOM from "react-dom";
import './index.less';
import './index.css';
import styles from './index.module.less';

class Test extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className={styles.test}>
                2222
            </div>
        )
    }
}
ReactDOM.render(<Test />, document.getElementById('app'));
