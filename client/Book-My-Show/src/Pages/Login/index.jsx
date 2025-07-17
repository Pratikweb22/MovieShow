import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../apicalls/user";

const Login = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
  try {
    const response = await LoginUser(values);
    console.log("LoginUser response:", response);

    if (response?.success) {
      messageApi.open({
        type: "success",
        content: response.message,
      });
      localStorage.setItem("token", response.data);
      navigate("/");
    } else {
      messageApi.open({
        type: "error",
        content: response?.message || "Login failed",
      });
    }
  } catch (err) {
    console.error("Login error:", err);
    messageApi.open({
      type: "error",
      content: err?.response?.data?.message || err.message || "Something went wrong",
    });
  }
};

  return (
    <div>
      {contextHolder}
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          borderRadius: "10px",
          background: "#fff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "black" }}>
          Login to Book My Show
        </h1>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            htmlFor="email"
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input id="email" type="email" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            htmlFor="password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              id="password"
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              style={{ fontSize: "1rem", fontWeight: "600" }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: "1rem", color: "black" }}>
          <p>
            New User? <Link to="/register">Register Here</Link>
          </p>
          <p>
            Forgot Password? <Link to="/forget">Click Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
