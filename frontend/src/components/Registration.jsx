import React, { useState } from "react";
import { supabase } from "../supabase";
import axios from 'axios';
import './Forms.css';
import logo from '../assets/echohomes.png';
import { Button, Form, Input, message, Radio } from 'antd';

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

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const serviceRoleKey = import.meta.env.VITE_SERVICE_ROLE_KEY;

  const handleRegister = async (event) => {
    // event.preventDefault();
    setLoading(true);
    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
    });
    console.log({ signUpData });

    const { user } = signUpData;
    if (error) {
      console.log(error);
      return res.status(401).json({ error: error.message });
    }
    const resp = await axios.post(
      'http://localhost:3001/register',
      {
        userId: user?.id,
        email: email,
        userType: userType,
        companyName: companyName,
        phoneNumber: phoneNumber,
        name: name,
        address: address,
      },
      {
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
        }
      }
    );
    if (resp.ok) {
      setMessage(data.message);
    } else {
      setMessage(data.error);
      throw new Error(data.error);
    }
    setLoading(false);
  };

  return (
    <div className="page-background">
      <Form onFinish={handleRegister} {...layout} className="form-border">
        <div className="center-align">
          <img src={logo} alt="Logo"></img>
        </div>
        <h2 className="form-title">Register</h2>
        <Form.Item label="Name" name="name" className="minwidth">
          <Input type="text" placeholder="John T" value={name} onChange={event => setName(event.target.value)} required></Input>
        </Form.Item>
        <Form.Item label="Email" name="email" className="minwidth">
          <Input type="email" placeholder="abc@domain.com" value={email} onChange={event => setEmail(event.target.value)} required></Input>
        </Form.Item>
        <Form.Item label="Password" name="password" className="minwidth">
          <Input.Password placeholder="a-zA-Z0-9(Minimum 6)" value={password} onChange={event => setPassword(event.target.value)} required></Input.Password>
        </Form.Item>
        <Form.Item label="Company Name" name="companyName" className="minwidth">
          <Input type="text" placeholder="Mulberry Homes" value={companyName} onChange={event => setCompanyName(event.target.value)} required></Input>
        </Form.Item>
        <Form.Item label="Phone Number" name="phoneNumber" className="minwidth" rules={[{ pattern: /^\d{10,11}$/, message: '0-9(10 to 11 digits)' }]}>
          <Input type="tel" placeholder="09999999999" value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)} required></Input>
        </Form.Item>
        <Form.Item label="Address" name="address" className="minwidth">
          <Input type="text" placeholder="Jarrom st, Leicester" value={address} onChange={event => setAddress(event.target.value)} required></Input>
        </Form.Item>
        <Form.Item label="User Type" name="usertype">
          <Radio.Group value={userType} onChange={event => setUserType(event.target.value)}>
            <Radio value={1}>Builder</Radio>
            <Radio value={2}>Supplier</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button block type="primary" htmlType="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</Button>
        </Form.Item>
        {message && <p className="form-message">{message}</p>}
        <div className="top-margin center-align">
          <span style={{color: "black"}}>Already have an account? </span><a href="/login">Login</a>
        </div>
      </Form>
    </div>
  );
}

export default Registration;
