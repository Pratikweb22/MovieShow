import { Button, Form, Input, Radio, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser } from "../../apicalls/user";

const Register = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    console.log(values);
    try {
      const response = await RegisterUser(values);
      console.log(response);
      if (response.success) {
        messageApi.open({
          type: "success",
          content: response.message,
        });
        navigate("/");
      } else {
        messageApi.open({
          type: "error",
          content: response.message,
        });
      }
    } catch (err) {
      messageApi.open({
        type: "error",
        content: err,
      });
    }
  };

  return (
    <div>
      {contextHolder}
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "2rem",
          borderRadius: "10px",
          background: "#fff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "2rem" , color: "black" }}>
          Register to Book My Show
        </h1>

         <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Name"
                htmlFor="name"
                name="name"
                className="d-block"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                ></Input>
              </Form.Item>

              <Form.Item
                label="Email"
                htmlFor="email"
                name="email"
                className="d-block"
                rules={[{ required: true, message: "Email is required" }]}
              >
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                ></Input>
              </Form.Item>

              <Form.Item
                label="Password"
                htmlFor="password"
                name="password"
                className="d-block"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                ></Input>
              </Form.Item>

              <Form.Item className="d-block">
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  style={{ fontSize: "1rem", fontWeight: "600" }}
                >
                  Register
                </Button>
              </Form.Item>

              <Form.Item
                label="Register as a Partner"
                htmlFor="role"
                name="role"
                className="d-block text-center"
                initialValue={"user"}
              >
                <div style={{ display: "flex", justifyContent: "start" }}>
                  <Radio.Group name="radiogroup" className="flex-start">
                    <Radio value={"partner"}>Yes</Radio>
                    <Radio value={"user"}>No</Radio>
                  </Radio.Group>
                </div>
              </Form.Item>
            </Form>


        <div style={{ textAlign: "center", marginTop: "1rem" , color: "black" }}>
          <p>
            Already a user? <Link to="/login">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
 