import { axiosInstance } from "./index";
// Register
export const RegisterUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/register", payload);
    return response.data;
  } catch (err) {
    // Clean error response
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong",
    };
  }
};

// Login
export const LoginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/login", payload);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong",
    };
  }
};

export const ForgetPassword = async (value) => {
  try {
    const response = await axiosInstance.patch(
      "/api/users/forgetpassword",
      value
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// Reste password
export const ResetPassword = async (value) => {
  try {
    const response = await axiosInstance.patch(
      "/api/users/resetpassword",
      value
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};


export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/users/current-user");
    return {
      success: true,
      data: response.data,
    };
  } catch (err) {
    console.error("GetCurrentUser error:", err);
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong",
    };
  }
};
