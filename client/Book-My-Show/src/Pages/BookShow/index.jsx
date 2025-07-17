import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { getShowById } from "../../apicalls/show";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Row, Col, Button, message } from "antd";
import moment from "moment";
import { makePayment } from "../../apicalls/bookings";

function BookShow() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        dispatch(showLoading());
        const response = await getShowById(params.showId);
        if (response.success) {
          setShow(response.data);
        } else {
          navigate("/");
        }
        dispatch(hideLoading());
      } catch (err) {
        dispatch(hideLoading());
        navigate("/");
      }
    };

    fetchShowDetails();
  }, [params.showId, dispatch, navigate]);

  const handleSeatClick = (seatNumber) => {
    if (show.bookedSeats.includes(seatNumber)) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handlePayment = async () => {
    if (selectedSeats.length === 0) {
      return message.warning("Please select at least one seat.");
    }

    try {
      dispatch(showLoading());

      // Call backend to get Stripe Checkout URL
      const response = await makePayment({
        amount: selectedSeats.length * show.ticketPrice,
      });

      dispatch(hideLoading());

      if (response.success && response.url) {
        // Store seat and user data in localStorage for use after redirect
        localStorage.setItem("bookingData", JSON.stringify({
          showId: show._id,
          seats: selectedSeats,
          userId: user._id
        }));

        // Redirect to Stripe Checkout
        window.location.href = response.url;
      } else {
        message.error("Payment initiation failed.");
      }
    } catch (err) {
      dispatch(hideLoading());
      message.error("Payment request failed.");
      console.error("Payment Error:", err);
    }
  };

  const getSeatsLayout = () => {
    const columns = 12;
    const totalSeats = show.totalSeats;
    const rows = Math.ceil(totalSeats / columns);

    return (
      <div className="d-flex flex-column align-items-center">
        <div className="w-100 max-width-600 mx-auto mb-25px">
          <p className="text-center mb-10px">
            Screen this side, you will be watching in this direction
          </p>
          <div className="screen-div" />
        </div>

        <ul className="seat-ul justify-content-center">
          {Array.from({ length: rows }).map((_, row) =>
            Array.from({ length: columns }).map((_, col) => {
              const seatNumber = row * columns + col + 1;
              if (seatNumber > totalSeats) return null;

              let seatClass = "seat-btn";
              const isSelected = selectedSeats.includes(seatNumber);
              const isBooked = show.bookedSeats.includes(seatNumber);

              if (isSelected) seatClass += " selected";
              if (isBooked) seatClass += " booked";

              return (
                <li key={seatNumber}>
                  <button
                    style={{
                      color: "black",
                      backgroundColor: isSelected ? "green" : "white",
                      cursor: isBooked ? "not-allowed" : "pointer",
                    }}
                    className={seatClass}
                    disabled={isBooked}
                    onClick={() => handleSeatClick(seatNumber)}
                  >
                    {seatNumber}
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className="d-flex bottom-card justify-content-between w-100 max-width-600 mx-auto mb-25px mt-3">
          <div className="flex-1">
            Selected Seats: <span>{selectedSeats.join(", ")}</span>
          </div>
          <div className="flex-shrink-0 ms-3">
            Total Price: <span>Rs. {selectedSeats.length * show.ticketPrice}</span>
          </div>
        </div>
      </div>
    );
  };

  return show ? (
    <Row gutter={24}>
      <Col span={24}>
        <Card
          title={
            <div className="movie-title-details">
              <h1>{show.movie.movieName}</h1>
              <p>
                Theatre: {show.theatre.name}, {show.theatre.address}
              </p>
            </div>
          }
          extra={
            <div className="show-name py-3">
              <h3>
                <span>Show Name:</span> {show.name}
              </h3>
              <h3>
                <span>Date & Time:</span>{" "}
                {moment(show.date).format("MMM Do YYYY")} at{" "}
                {moment(show.time, "HH:mm").format("hh:mm A")}
              </h3>
              <h3>
                <span>Ticket Price:</span> Rs. {show.ticketPrice}/-
              </h3>
              <h3>
                <span>Total Seats:</span> {show.totalSeats}
                <span> &nbsp;|&nbsp; Available:</span>{" "}
                {show.totalSeats - show.bookedSeats.length}
              </h3>
            </div>
          }
          style={{ width: "100%" }}
        >
          {getSeatsLayout()}

          {selectedSeats.length > 0 && (
            <div className="max-width-600 mx-auto mt-3">
              <Button
                type="primary"
                shape="round"
                size="large"
                block
                onClick={handlePayment}
              >
                Pay Now
              </Button>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  ) : null;
}

export default BookShow;
