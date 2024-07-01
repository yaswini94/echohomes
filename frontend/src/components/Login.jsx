import React, { useState } from 'react';
import supabase from '../supabaseClient';
import './Forms.css';
import logo from '../assets/echohomes.png';
import { Form, Input, Button } from "antd";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form] = Form.useForm();

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  
  const handleLogin = async (event) => {
    // event?.preventDefault();
    setLoading(true);
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Logged in successfully!');
    setLoading(false);
  };

  return (
    <div className="App">
      <Form onFinish={handleLogin} form={form} {...layout} className='form-border'>
        <img src={logo} alt="Logo"></img>
        <h2 className="form-title">Login</h2>
        <Form.Item label="Email" name="email">
          <Input placeholder='abc@domain.com' value={email} onChange={(event) => setEmail(event.target.value)} required></Input>
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password placeholder='a-zA-Z0-9(Minimum 6)' value={password} onChange={(event) => setPassword(event.target.value)} required></Input.Password>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button block type='primary' htmlType='submit'>Login</Button>
        </Form.Item>
        {message && <p className="form-message">{message}</p>}
        <div className='top-margin'>
          <span style={{color: 'black'}}>Don’t have an account? </span><a href="/register">Register</a>
        </div>
      </Form>
    </div>
  )
}
export default LoginForm;