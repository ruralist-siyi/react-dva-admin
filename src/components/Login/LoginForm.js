import React, {Component} from 'react';
import {Bind} from 'lodash-decorators';
import {Card, Form, Icon, Input, Button} from 'antd';
import verification from '../../utils/verificationCode';
import styles from './LoginForm.module.less';

@Form.create()
class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyCode: {
        code: '',
        dataURL: '',
      },
    }
  }


  componentDidMount() {
    this.createCode();
  }


  // 创建验证码
  @Bind()
  createCode() {
    this.setState({
      verifyCode: verification.create()
    });
  }

  // 登录提交
  @Bind()
  handleLoginSubmit(event) {
    event.preventDefault();
  }

  // 渲染登录表单
  @Bind()
  renderForm() {
    const {code, dataURL} = this.state.verifyCode;
    const {getFieldDecorator} = this.props.form;
    console.log(code, dataURL);
    return (
      <Form onSubmit={this.handleLoginSubmit} className={styles['login-form']}>
        <input id="fakeUsername" style={{display: 'none'}} name="username"/>
        <input id="fakePassword" style={{display: 'none'}} type="password" name="password"/>
        <Form.Item className={styles['login-form-item']}>
          {getFieldDecorator('userName', {
            rules: [{required: true, message: '请输入用户名!'}],
          })(
            <Input
              addonBefore={<Icon type="user" style={{color: '#909399'}}/>}
              placeholder="用户名"
              autocomplete="nope"
              size='large'
            />
          )}
        </Form.Item>
        <Form.Item className={styles['login-form-item']}>
          {getFieldDecorator('password', {
            rules: [{required: true, message: '请输入密码!'}],
          })(
            <Input.Password
              addonBefore={<Icon type="lock" style={{color: '#909399'}}/>}
              placeholder="密码"
              size='large'
              autoComplete='new-password'
              data-lpignore="true"
            />
          )}
        </Form.Item>
        <Form.Item className={styles['login-form-item']}>
          {getFieldDecorator('code', {
            rules: [{required: true, message: '请输入用户名!'}],
          })(
            <Input
              addonBefore="验证码"
              addonAfter={<img className={styles['verify-img']} onClick={this.createCode} src={dataURL} alt=""/>}
              size='large'
            />
          )}
        </Form.Item>
        <Button type="primary" htmlType="submit" className={styles['login-button']}>
          登录
        </Button>
      </Form>
    )
  }

  render() {
    return (
      <>
        <Card className={styles['login-form-wrap']}>
          {this.renderForm()}
        </Card>
      </>
    )
  }
}

export default LoginForm;