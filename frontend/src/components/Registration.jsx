import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import supabase from '../supabaseClient';
import './Forms.css';
import logo from '../assets/echohomes.png';
import { Button, Form, Input, Select, message } from 'antd';

const { Option } = Select;
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

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [usertype, setUsertype] = useState('');
  // const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  // const navigate = useNavigate(); // useNavigate hook
  const [form] = Form.useForm();

  // useEffect(() => {
  //   if (message === 'Registration successful! Check your email to verify your account.') {
  //     // Redirect to login after the message is set
  //     setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
  //   }
  // }, [message, history]);

  const handleRegister = async (values) => {
    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values), // Send the form values directly
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      message.success(`Response: ${result.message}`);
    } catch (error) {
      console.error("Error posting data: ", error);
      message.error('Failed to send data. ' + error.message);
    }
  };

  const onUserTypeChange = (value) => {
    switch (value) {
      case 'builder':
        form.setFieldsValue({
          note: 'Hi, Builder!',
        });
        setUsertype(value);
        break;
      case 'supplier':
        form.setFieldsValue({
          note: 'Hi, Supplier!',
        });
        break;
      default:
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
    message.error('Please adjust the form according to the errors.');
  };
  return (
    <Form onFinish={handleRegister} onFinishFailed={onFinishFailed} form={form} {...layout} className="form-border">
      <img src={logo} alt="Logo"></img>
      <h2 className="form-title">Register</h2>
      <Form.Item label="Name" name="name" className="minwidth">
        <Input placeholder='John D' value={name} onChange={event => setName(event.target.value)} required></Input>
      </Form.Item>
      <Form.Item label="Email" name="email" className="minwidth">
        <Input type="email" placeholder='abc@domain.com' value={email} onChange={event => setEmail(event.target.value)} required></Input>
      </Form.Item>
      <Form.Item label="User Type" name="usertype" className="minwidth">
        <Select
          placeholder="Select type of user"
          onChange={onUserTypeChange}
          value={usertype}
          allowClear
        >
          <Option value="builder">Builder</Option>
          <Option value="supplier">Supplier</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Password" name="password" className="minwidth">
        <Input.Password placeholder='a-zA-Z0-9(Minimum 6)' value={password} onChange={event => setPassword(event.target.value)} required></Input.Password>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button block type='primary' htmlType='submit'>Register</Button>
      </Form.Item>
      {message && <p className="form-message">{message}</p>}
      <div className='top-margin'>
        <span style={{color: 'black'}}>Already have an account? </span><a href="/login">Login</a>
      </div>
    </Form>
  );
};

export default RegistrationForm;