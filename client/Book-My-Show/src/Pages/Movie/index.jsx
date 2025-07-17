import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getMovieById } from "../../apicalls/movie";
import { Input, Divider, Row, Col } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { getAllTheatresByMovie } from "../../apicalls/show";
import moment from "moment";

function Movie() {
  const params = useParams();
  const [movie, setMovie] = useState(null);
  const [searchParams] = useSearchParams();
  const [theatres, setTheatres] = useState([]);
  const [date, setDate] = useState(
    moment(searchParams.get("date")).format("YYYY-MM-DD")
  );
  const navigate = useNavigate();

  const handleDate = (e) => {
    setDate(e.target.value);
    navigate(`/movies/${params.movieId}?date=${e.target.value}`);
  };

  useEffect(() => {
    const getMovie = async () => {
      try {
        const response = await getMovieById(params.movieId);
        if (response.success) {
          setMovie(response.data);
        } else {
          alert(response.message);
        }
      } catch (err) {
        alert(err.message);
      }
    };

    getMovie();
  }, []);

  useEffect(() => {
    const getAllTheatres = async () => {
      try {
        const response = await getAllTheatresByMovie(params.movieId, date);
        if (response.success) {
          setTheatres(response.data);
        } else {
          console.log("No shows available on that date");
        }
      } catch (err) {
        alert(err.message);
      }
    };

    getAllTheatres();
  }, [date]);

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "auto", color: "#000" }}>
      {movie && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <img
              src={movie.poster}
              alt="Movie Poster"
              width={140}
              style={{ borderRadius: "8px" }}
            />
            <div>
              <h2 style={{ marginBottom: 8 }}>{movie.title}</h2>
              <p><strong>Language:</strong> {movie.language}</p>
              <p><strong>Genre:</strong> {movie.genre}</p>
              <p><strong>Release Date:</strong> {moment(movie.date).format("MMM Do YYYY")}</p>
              <p><strong>Duration:</strong> {movie.duration} Minutes</p>
              <div style={{ marginTop: "16px" }}>
                <label><strong>Choose the date:</strong></label>
                <Input
                  type="date"
                  min={moment().format("YYYY-MM-DD")}
                  defaultValue={date}
                  onBlur={handleDate}
                  prefix={<CalendarOutlined />}
                  style={{ maxWidth: "220px", marginTop: "6px" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {theatres.length === 0 && (
        <div style={{ textAlign: "center", color: "#000" }}>
          <h3>No theatres available for this movie on selected date.</h3>
        </div>
      )}

      {theatres.length > 0 && (
        <div>
          <h2 style={{ marginBottom: "16px" }}>Theatres</h2>
          {theatres.map((theatre) => (
            <div
              key={theatre._id}
              style={{
                backgroundColor: "#fff",
                padding: "16px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                marginBottom: "24px",
              }}
            >
              <Row gutter={24}>
                <Col xs={24} lg={8}>
                  <h3>{theatre.name}</h3>
                  <p>{theatre.address}</p>
                </Col>
                <Col xs={24} lg={16}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                    {theatre.shows
                      .sort((a, b) =>
                        moment(a.time, "HH:mm").diff(moment(b.time, "HH:mm"))
                      )
                      .map((singleShow) => (
                        <button
                          key={singleShow._id}
                          onClick={() => navigate(`/book-show/${singleShow._id}`)}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#f9f2e9",
                            border: "1px solid #ffd699",
                            borderRadius: "6px",
                            color: "#000",
                            cursor: "pointer",
                            fontWeight: "500",
                          }}
                        >
                          {moment(singleShow.time, "HH:mm").format("hh:mm A")}
                        </button>
                      ))}
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Movie;
