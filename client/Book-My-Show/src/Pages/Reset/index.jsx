import React, { useEffect } from "react";
import { Button, Form, Input, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { ResetPassword } from "../../apicalls/user";
import { message } from "antd";

function Reset() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  const onFinish = async (values) => {
    try {
      const response = await ResetPassword(values);
      if (response.success) {
        message.success(response.message);
        window.location.href = "/login";
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div>
      <Card
        style={{
          width: 400,
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          backgroundColor: "#ffffff",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
          Reset Password
        </h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="OTP"
            name="otp"
            rules={[{ required: true, message: "OTP is required" }]}
          >
            <Input type="number" placeholder="Enter your OTP" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Enter your new password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              style={{ fontSize: "1rem", fontWeight: "600" }}
            >
              RESET PASSWORD
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Reset;
