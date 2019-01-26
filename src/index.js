import React, { Component } from "react";
import ReactDOM from "react-dom";
import './index.less';
import './index.css';
import styles from './index.module.less';
// import _ from 'lodash'; 
// import {message} from 'antd';

class Test extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className={styles.test}>
                2222233333
                <img src="/static/images/logo-login.png"  alt="上海鲜花港 - 郁金香" />
            </div>
        )
    }
}
ReactDOM.render(<Test />, document.getElementById('app'));
