import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/userSlice";
import { GetCurrentUser } from "../apicalls/user";
import { useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import { hideLoading, showLoading } from "../redux/loaderSlice";

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        dispatch(showLoading());
        const response = await GetCurrentUser();

        if (response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          const fetchedUser = response.data.data;
          dispatch(SetUser(fetchedUser));

          const role = fetchedUser.role;
          const currentPath = window.location.pathname;

          // Redirect based on role if user is on root or profile
          if (currentPath === "/" || currentPath === "/profile") {
            if (role === "admin") {
              navigate("/admin");
            } else if (role === "partner") {
              navigate("/partner");
            } else {
              navigate("/profile");
            }
          }
        }
      } catch (err) {
        dispatch(SetUser(null));
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        dispatch(hideLoading());
      }
    };

    if (localStorage.getItem("token")) {
      getData();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      {user && (
        <>
          <Header
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              backgroundColor: "#001529",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 24px",
            }}
          >
            {/* Logo */}
            <img
              src="/my-logo.jpg"
              alt="Book My Show"
              style={{ height: "70px", objectFit: "contain" }}
            />

            {/* Menu */}
            <Menu theme="dark" mode="horizontal" style={{ backgroundColor: "#001529" }}>
              <Menu.Item
                key="home"
                icon={<HomeOutlined />}
                onClick={() => navigate("/")}
              >
                Home
              </Menu.Item>

              <Menu.SubMenu
                key="user"
                title={
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <UserOutlined />
                    {user?.name || "Profile"}
                  </span>
                }
              >
                <Menu.Item
                  key="profile"
                  icon={<ProfileOutlined />}
                  onClick={() => {
                    if (user?.role === "admin") navigate("/admin");
                    else if (user?.role === "partner") navigate("/partner");
                    else navigate("/profile");
                  }}
                >
                  My Profile
                </Menu.Item>

                <Menu.Item
                  key="logout"
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    dispatch(SetUser(null));
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                >
                  Logout
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Header>

          {/* Page Content */}
          <div style={{ paddingTop: 64 }}>{children}</div>
        </>
      )}
    </div>
  );
}

export default ProtectedRoute;
