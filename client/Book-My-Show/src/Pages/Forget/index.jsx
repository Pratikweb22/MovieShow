import React, { useEffect } from "react";
import { Button, Form, Input, Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ForgetPassword } from "../../apicalls/user";
import { message } from "antd";

function Forget() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  const onFinish = async (values) => {
    console.log(values);
    try {
      const response = await ForgetPassword(values);
      if (response.status === "success") {
        message.success(response.message);
        alert("OTP sent to your email");
        window.location.href = "/reset";
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
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Forget Password</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input placeholder="Enter your Email" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              style={{ fontSize: "1rem", fontWeight: "600" }}
            >
              SEND OTP
            </Button>
          </Form.Item>
        </Form>

        <p style={{ textAlign: "center" }}>
          Existing User? <Link to="/login">Login Here</Link>
        </p>
      </Card>
    </div>
  );
}

export default Forget;
