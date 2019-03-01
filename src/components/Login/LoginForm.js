import React, {Component} from 'react';
import {Card, Form, Icon, Input, Button} from 'antd';
import styles from './LoginForm.module.less';

const LoginForm = React.memo(({form: {getFieldDecorator}, createCode, submit, verifyCode: {code, dataURL}}) => {
  return (
    <Form onSubmit={submit} className={styles['login-form']}>
      <input id="fakeUsername" style={{display: 'none'}} name="username"/>
      <input id="fakePassword" style={{display: 'none'}} type="password" name="password"/>
      <Form.Item className={styles['login-form-item']}>
        {getFieldDecorator('loginAccount', {
          rules: [{required: true, message: '请输入用户名'}],
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
          rules: [{required: true, message: '请输入密码'}],
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
          rules: [{required: true, message: '请输入验证码'}],
        })(
          <Input
            addonBefore="验证码"
            addonAfter={<img className={styles['verify-img']} onClick={createCode} src={dataURL} alt=""/>}
            size='large'
          />
        )}
      </Form.Item>
      <Button type="primary" htmlType="submit" className={styles['login-button']}>
        登录
      </Button>
    </Form>
  )
});

export default Form.create()(LoginForm);