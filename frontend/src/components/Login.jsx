import React, { useState } from "react";
import { supabase } from "../supabase";
import './Forms.css';
import logo from '../assets/echohomes.png';
import { Form, Input, Button } from "antd";

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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (event) => {
    // event.preventDefault();
    setLoading(true);
    const { error, session } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:5173/",
      },
    });

    if (error) {
      setMessage("Login failed: " + error.message);
      setLoading(false);
      return;
    }

    setMessage("Login successful!");
    setLoading(false);
  };

  return (
    <div className="page-background">
      <Form onFinish={handleLogin} {...layout} className='form-border'>
        <div className="center-align">
          <img src={logo} alt="Logo"></img>
        </div>
        <h2 className="form-title">Login</h2>
        <Form.Item label="Email" name="email" className="minwidth">
          <Input type="email" placeholder="abc@domain.com" value={email} onChange={event => setEmail(event.target.value)} required></Input>
        </Form.Item>
        <Form.Item label="Password" name="password" className="minwidth">
          <Input.Password placeholder="a-zA-Z0-9(Minimum 6)" value={password} onChange={event => setPassword(event.target.value)} required></Input.Password>
        </Form.Item>
        <div className="forgot-password">
          <a onClick={() => supabase.auth.resetPasswordForEmail(email)}>Forgot Password ?</a>
        </div>
        <Form.Item {...tailLayout}>
          <Button block type="primary" htmlType="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
        </Form.Item>
        {message && <p className="form-message">{message}</p>}
        <div className="top-margin center-align">
          <span style={{color: "black"}}>Don’t have an account? </span><a href="/register">Register</a>
        </div>
      </Form>
    </div>
  );
}

export default Login;
