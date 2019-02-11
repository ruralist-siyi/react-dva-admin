import React, {Component} from 'react';
import {Card} from 'antd';
import styles from './LoginForm.module.less';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <>
        <Card className={styles['login-form-wrap']}>

        </Card>
      </>
    )
  }
}

export default LoginForm;