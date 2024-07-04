import React, { useState } from "react";
import { supabase } from "../supabase";
import './Forms.css';
import logo from '../assets/echohomes.png';
import { Button, Form, Input, message } from 'antd';

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

const BuilderRegistration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  // const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (event) => {
    // event.preventDefault();
    setLoading(true);
    const { data: builderData, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log({ builderData });

    const { user } = builderData;

    if (error) {
      setMessage("Error registering builder: " + error.message);
      setLoading(false);
      return;
    }

    const { data, insertError } = await supabase.from("builders").insert([
      {
        builder_id: user.id,
        company_name: companyName,
        contact_email: email,
        phone_number: phoneNumber,
        address: address,
      },
    ]);

    if (insertError) {
      setMessage("Error saving builder details: " + insertError.message);
      setLoading(false);
      return;
    }

    setMessage("Builder registered successfully!");
    setLoading(false);
  };

  return (
    <div className="page-background">
      <Form onFinish={handleRegister} {...layout} className="form-border">
        <div className="center-align">
          <img src={logo} alt="Logo"></img>
        </div>
        <h2 className="form-title">Register as a Builder</h2>
        <Form.Item label="Email" name="email" className="minwidth">
          <Input type="email" placeholder="abc@domain.com" value={email} onChange={event => setEmail(event.target.value)} required></Input>
        </Form.Item>
        <Form.Item label="Password" name="password" className="minwidth">
          <Input.Password placeholder="a-zA-Z0-9(Minimum 6)" value={password} onChange={event => setPassword(event.target.value)} required></Input.Password>
        </Form.Item>
        <Form.Item label="Company Name" name="companyName" className="minwidth">
          <Input type="text" placeholder="Mulberry Homes" value={companyName} onChange={event => setCompanyName(event.target.value)} required></Input>
        </Form.Item>
        <Form.Item label="Phone Number" name="phoneNumber" className="minwidth">
          <Input type="tel" placeholder="+449999999999" value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)} required></Input>
        </Form.Item>
        <Form.Item label="Address" name="address" className="minwidth">
          <Input type="text" placeholder="Jarrom st, Leicester" value={address} onChange={event => setAddress(event.target.value)} required></Input>
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

export default BuilderRegistration;
