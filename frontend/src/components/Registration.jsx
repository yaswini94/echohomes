import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Forms.css";
import logo from "../assets/echohomes.png";
import { Button, Form, Input, Radio } from "antd";
import axiosInstance from "../helpers/axiosInstance";

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

  const navigate = useNavigate();

  // Function to handle register button click
  const handleRegister = async () => {
    setLoading(true);

    try {
      const data = await axiosInstance.post("/register", {
        email: email,
        password: password,
        userType: userType,
        companyName: companyName,
        phoneNumber: phoneNumber,
        name: name,
        address: address,
      });
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      setMessage("Registration failed: " + error.message);
      setLoading(false);
    }
  };

  return (
    // Register page render view with ant design Form template
    <div className="page-background">
      <Form onFinish={handleRegister} {...layout} className="form-border">
        <div className="center-align">
          <img src={logo} alt="Logo"></img>
        </div>
        <h2 className="form-title">Register</h2>
        {/* Form item for the name with validation */}
        <Form.Item label="Name" name="name" className="minwidth">
          <Input
            type="text"
            placeholder="John T"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          ></Input>
        </Form.Item>
        {/* Form item for the email address with validation */}
        <Form.Item
          label="Email"
          name="email"
          className="minwidth"
          rules={[
            {
              // email pattern
              pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email",
            },
          ]}
        >
          <Input
            type="email"
            placeholder="abc@domain.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          ></Input>
        </Form.Item>
        {/* Form item for the password with validation to accept 6 characters minimum with alphabets and numbers */}
        <Form.Item
          label="Password"
          name="password"
          className="minwidth"
          rules={[
            {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
              message: "a-zA-Z0-9(Minimum 6)",
            },
          ]}
        >
          <Input.Password
            placeholder="a-zA-Z0-9(Minimum 6)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          ></Input.Password>
        </Form.Item>
        {/* Form item for the company name with validation */}
        <Form.Item label="Company Name" name="companyName" className="minwidth">
          <Input
            type="text"
            placeholder="Mulberry Homes"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            required
          ></Input>
        </Form.Item>
        {/* Form item for the phone number with validation */}
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          className="minwidth"
          rules={[{ pattern: /^\d{10,11}$/, message: "0-9(10 to 11 digits)" }]}
        >
          <Input
            type="tel"
            placeholder="09999999999"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            required
          ></Input>
        </Form.Item>
        {/* Form item for the address with validation */}
        <Form.Item label="Address" name="address" className="minwidth">
          <Input
            type="text"
            placeholder="Jarrom st, Leicester"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            required
          ></Input>
        </Form.Item>
        {/* Form item for the user type with validation */}
        <Form.Item label="User Type" name="usertype">
          <Radio.Group
            value={userType}
            onChange={(event) => setUserType(event.target.value)}
          >
            <Radio value={1}>Builder</Radio>
            <Radio value={2}>Supplier</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button block type="primary" htmlType="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </Form.Item>
        {message && <p className="form-message">{message}</p>}
        <div className="top-margin center-align">
          <span style={{ color: "black" }}>Already have an account? </span>
          <a href="/login">Login</a>
        </div>
      </Form>
    </div>
  );
};

export default Registration;
