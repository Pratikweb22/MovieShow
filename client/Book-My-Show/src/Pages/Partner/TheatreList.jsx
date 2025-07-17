import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { Button, Table, Card } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TheatreModal from "./theatreForm";
import TheatreDelete from "./theatreDelete";
import { getAllTheatresByOwner } from "../../apicalls/theatre";
import ShowModal from "./showModal";

function TheatreList() {
  const { user } = useSelector((state) => state.user);
  const [theatres, setTheatres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [formType, setFormType] = useState("add");
  const dispatch = useDispatch();

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Phone Number", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, rowObj) => (rowObj.isActive ? "Approved" : "Pending/Blocked"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, rowObj) => (
        <div style={{ display: "flex", gap: "4px" }}>
          <Button
            onClick={() => {
              setIsModalOpen(true);
              setFormType("edit");
              setSelectedTheatre(rowObj);
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            onClick={() => {
              setIsDeleteModalOpen(true);
              setSelectedTheatre(rowObj);
            }}
          >
            <DeleteOutlined />
          </Button>
          {rowObj.isActive && (
            <Button
              style={{ marginLeft: "4px" }}
              onClick={() => {
                setIsShowModalOpen(true);
                setSelectedTheatre(rowObj);
              }}
            >
              Add Shows
            </Button>
          )}
        </div>
      ),
    },
  ];

  const fetchAllTheatres = async () => {
    if (!user._id) return;
    dispatch(showLoading());
    const response = await getAllTheatresByOwner(user._id);
    const allTheatres = response.data.map((theatre) => ({
      ...theatre,
      key: `theatre_${theatre._id}`,
    }));
    setTheatres(allTheatres);
    dispatch(hideLoading());
  };

  useEffect(() => {
    if (user) {
      fetchAllTheatres();
    }
  }, [user]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card
        style={{
          width: "1000px",
          height: "1200px",
          backgroundColor: "white",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
          padding: "24px",
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}
        >
          <h2 style={{ margin: 0 }}>Theatres</h2>
          <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(true);
              setFormType("add");
              setSelectedTheatre(null);
            }}
          >
            Add Theatre
          </Button>
        </div>

        <Table columns={columns} dataSource={theatres} pagination={false} />

        {isModalOpen && (
          <TheatreModal
            isModalOpen={isModalOpen}
            selectedTheatre={selectedTheatre}
            setIsModalOpen={setIsModalOpen}
            formType={formType}
            setSelectedTheatre={setSelectedTheatre}
            getData={fetchAllTheatres}
          />
        )}
        {isDeleteModalOpen && (
          <TheatreDelete
            isDeleteModalOpen={isDeleteModalOpen}
            selectedTheatre={selectedTheatre}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            setSelectedTheatre={setSelectedTheatre}
            getData={fetchAllTheatres}
          />
        )}
        {isShowModalOpen && (
          <ShowModal
            isShowModalOpen={isShowModalOpen}
            selectedTheatre={selectedTheatre}
            setIsShowModalOpen={setIsShowModalOpen}
          />
        )}
      </Card>
    </div>
  );
}

export default TheatreList;
