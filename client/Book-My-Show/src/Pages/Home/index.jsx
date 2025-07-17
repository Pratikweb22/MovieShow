import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllMovies } from "../../apicalls/movie";
import { Col, Row, Input, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";

const { Title } = Typography;

function Home() {
  const [movies, setMovies] = useState(null);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getAllMovies();
        if (response.success) {
          setMovies(response.data);
        } else {
          setMovies(null);
        }
      } catch (err) {
        console.log("Error:", err);
      }
    };

    getData();
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const redirectToMoviesPage = (movieId) => {
    navigate(`/movies/${movieId}?date=${moment().format("YYYY-MM-DD")}`);
  };

  if (!movies) return <h1 style={{ textAlign: "center", marginTop: "100px" }}>Loading...</h1>;

  return (
    <div style={{ padding: "20px" }}>
      <Row justify="center" style={{ marginBottom: "40px" }}>
        <Col span={24} style={{ textAlign: "center", marginBottom: "20px" }}>
          <Title level={2} style={{ color: "white" }}>🎬 Explore Movies</Title>
        </Col>
        <Col xs={22} sm={18} md={12} lg={10}>
          <Input
            placeholder="Search for movies..."
            onChange={handleSearch}
            prefix={<SearchOutlined />}
            style={{
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          />
        </Col>
      </Row>

      <Row justify="center" gutter={[30, 40]}>
        {movies
          .filter((movie) =>
            movie.movieName.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((movie) => (
            <Col
              key={movie._id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={4}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div
                onClick={() => redirectToMoviesPage(movie._id)}
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  padding: "6px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease",
                  backgroundColor: "#fff",
                  width: "100%",
                  maxWidth: "220px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <img
                  src={movie.poster}
                  alt="Movie Poster"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "12px"
                  }}
                />
                <h3 style={{ fontWeight: "500", fontSize: "16px", color:"blue"}}>{movie.movieName}</h3>
              </div>
            </Col>
          ))}
      </Row>
    </div>
  );
}

export default Home;
