import { useState } from "react";
import { Form, Input, Button, message } from "antd";
// import { useParams, useSearchParams } from 'react-router-dom';
import axios from "axios";
import { useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  // const [searchParams] = useSearchParams();

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const queryParams = useQuery();

  // Function to handle update password click
  const onFinish = async (values) => {
    // const email = searchParams.get('email');
    const { password } = values;
    // const { email } = useParams();
    setLoading(true);

    const email = queryParams.get("email");
    try {
      const resp = await axios.post("http://localhost:3001/updatePassword", {
        email,
        password,
      });
      setLoading(false);
      console.log("Password has been reset successfully.");
    } catch (error) {
      message.error(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    // Form template from Antdesign components
    <Form
      name="reset_password"
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}
      disabled={loading}
    >
      {/* Form item for the new password */}
      <Form.Item
        label="New Password"
        name="password"
        rules={[
          { required: true, message: "Please input your new password!" },
          { min: 6, message: "Password must be at least 6 characters long!" },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      {/* Form item for the confirm password */}
      <Form.Item
        label="Confirm Password"
        name="confirm"
        dependencies={["password"]}
        hasFeedback
        rules={[
          { required: true, message: "Please confirm your password!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          data-testloading={!!loading}
        >
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ResetPassword;
