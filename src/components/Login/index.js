import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Button,
  Input,
  Alert,
} from 'antd';

import styles from './index.module.less';

const LoginForm = ({form, onSubmit, verifyCode, createCode, errors}) => {
  const {getFieldDecorator} = form;
  return (
    <div className={styles['shadow-wrapper']}>
      <img className={styles['shadow']} src="/static/images/login-form-shadow.png" alt=""/>
      <div className={styles['form-wrapper']}>
        <Form className={styles['form']} onSubmit={onSubmit}>
          <h2 className={styles['form-header']}>
            <img src="/static/images/logo-login.png" alt=""/>
            <p>车贷系统</p>
          </h2>
          {
            errors.length > 0 ? (
              <Alert message={errors.shift()} type="error" showIcon/>
            ) : (
              <div className={styles['placeholder']}></div>
            )
          }
          <Form.Item help="" validateStatus="">
            {
              getFieldDecorator('loginAccount', {
                rules: [
                  {required: true, message: '请输入账号'},
                  // { pattern: accountReg, message: '请输入正确的账号' },
                ],
              })(
                <Input
                  placeholder="请输入账号"
                  maxLength="32"
                  prefix={<i className="iconfont icon-yonghu"></i>}
                  style={{width: '200px'}}
                />
              )
            }
          </Form.Item>
          <Form.Item help="" validateStatus="">
            {
              getFieldDecorator('password', {
                rules: [
                  {required: true, message: '请输入密码'},
                ],
              })(
                <Input
                  type="password"
                  maxLength="32"
                  placeholder="请输入密码"
                  prefix={<i className="iconfont icon-mima"></i>}
                  style={{width: '200px'}}
                />
              )
            }
          </Form.Item>
          <Form.Item help="" validateStatus="">
            {
              getFieldDecorator('code', {
                validateFirst: true,
                rules: [
                  {required: true, message: '请输入验证码'},
                  {
                    validator: (_, value, callback) => {
                      if (value.toUpperCase() !== verifyCode.code.toUpperCase()) {
                        callback('验证码错误');
                        return;
                      }
                      callback();
                    }
                  }
                ],
              })(
                <Input
                  placeholder="验证码"
                  maxLength="4"
                  prefix={<i className="iconfont icon-yanzhengma"></i>}
                  style={{width: '100px'}}
                />
              )
            }
            <img
              className={styles['verify-code']}
              src={verifyCode.dataURL}
              onClick={createCode}
              alt=""
            />
          </Form.Item>
          <Button className={styles['login-btn']} htmlType="submit">登 录</Button>
        </Form>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  createCode: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
};

export default Form.create()(LoginForm);
