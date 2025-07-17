import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import MovieList from "./MovieList";
import TheatreTable from "./TheatreTable";
import { Tabs, Card } from "antd";

function Admin() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null && user.role !== "admin") {
      navigate("/");
    }
  }, [user]); 

  const tabItems = [
    {
      key: "1",
      label: "Movies",
      children: <MovieList />,
    },
    {
      key: "2",
      label: "Theatres",
      children: <TheatreTable />,
    },
  ];

  return (
    <div style={{ padding: "100px 20px" }}>
      <h1 style={{ color: "white", fontSize: "48px", textAlign: "center" }}>
        Admin Page
      </h1>

      <Card
  style={{
    width: "1000px",
    height: "1350px", // increase height here
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
    padding: "24px", 
  }}
>
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
}

export default Admin;
