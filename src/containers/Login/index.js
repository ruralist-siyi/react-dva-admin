import React, {Component} from 'react';
import {Bind} from 'lodash-decorators';
import {Card} from 'antd';
import {connect} from 'dva';
import PropTypes from "prop-types";
import Loading from '../../components/common/Loading';
import verification from "../../utils/verificationCode";
import styles from "../Login/Login.module.less";
import LoginForm from '../../components/Login/LoginForm';

@connect(({loading}) => ({
  loginLoading: loading.effects['user/login']
}))
class Login extends Component {
  static propTypes = {
    loginLoading: PropTypes.bool,
  };

  state = {
    verifyCode: {
      code: null,
      dataURL: null
    }
  };

  loginFormRef = React.createRef();

  componentDidMount() {
    this.createCode();
  }

  /**
   * 创建验证码
   */
  @Bind()
  createCode() {
    this.setState({
      verifyCode: verification.create()
    });
  }

  /**
   * 登陆请求
   * @param params
   */
  @Bind()
  login(params) {
    this.props.dispatch({
      type: 'user/login',
      payload: {
        body: {
          ...params
        }
      }
    })
  }

  /**
   * 登录提交
   * @param event
   */
  @Bind()
  handleLoginSubmit(event) {
    event.preventDefault();
    this.loginFormRef.current.validateFields({}, (errors, values) => {
      if (!errors) {
        this.login(values);
      }
    });
  }

  render() {
    const {loginLoading} = this.props;
    const {verifyCode} = this.state;
    return (
      <Card className={styles['login-form-wrap']}>
        <LoginForm
          ref={this.loginFormRef}
          submit={this.handleLoginSubmit}
          createCode={this.createCode}
          verifyCode={verifyCode}
        />
        <Loading loading={loginLoading} />
      </Card>
    )
  }
}

export default Login;