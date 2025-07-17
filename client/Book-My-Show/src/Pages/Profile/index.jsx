import { Button, Card, Col, Row, message } from "antd";
import { useEffect, useState } from "react";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { getAllBookings } from "../../apicalls/bookings";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";

const Profile = () => {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllBookings();
      if (response.success) {
        setBookings(response.data);
      } else {
        message.error(response.message || "Failed to fetch bookings");
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      message.error("Something went wrong while fetching bookings.");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {bookings.length > 0 ? (
        <Row gutter={[24, 24]}>
          {bookings.map((booking) => (
            <Col key={booking._id} xs={24} lg={12}>
              <Card className="mb-3">
                <div className="d-flex flex-column flex-md-row gap-3 align-items-center">
                  <div className="flex-shrink-0">
                    <img
                      src={booking.show?.movie?.poster}
                      width={100}
                      alt="Poster"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="mt-0 mb-1">{booking.show?.movie?.movieName || "Untitled Movie"}</h3>
                    <p>
                      Theatre: <b>{booking.show?.theatre?.name || "-"}</b>
                    </p>
                    <p>
                      Seats: <b>{booking.seats.join(", ")}</b>
                    </p>
                    <p>
                      Date & Time:{" "}
                      <b>
                        {moment(booking.show.date).format("MMM Do YYYY")}{" "}
                        {moment(booking.show.time, "HH:mm").format("hh:mm A")}
                      </b>
                    </p>
                    <p>
                      Amount:{" "}
                      <b>
                        Rs. {booking.seats.length * booking.show.ticketPrice}
                      </b>
                    </p>
                    <p>
                      Booking ID: <b>{booking.transactionId}</b>
                    </p>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center pt-5">
          <h2>No bookings found yet!</h2>
          <Link to="/">
            <Button type="primary">Start Booking</Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default Profile;
