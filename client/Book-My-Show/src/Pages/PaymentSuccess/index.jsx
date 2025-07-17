// src/pages/PaymentSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { bookShow } from "../../apicalls/bookings";
import { hideLoading, showLoading } from "../../redux/loaderSlice";

function PaymentSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const completeBooking = async () => {
      const bookingData = JSON.parse(localStorage.getItem("bookingData"));

      if (!bookingData) {
        message.error("No booking data found.");
        return navigate("/");
      }

      try {
        dispatch(showLoading());

        const response = await bookShow({
          show: bookingData.showId,
          seats: bookingData.seats,
          user: bookingData.userId,
          transactionId: new Date().getTime().toString(), // temporary txn id
        });

        if (response.success) {
          message.success("Booking successful!");
          localStorage.removeItem("bookingData");
          navigate("/profile");
        } else {
          message.error("Booking failed.");
          navigate("/");
        }

        dispatch(hideLoading());
      } catch (err) {
        console.error("Error completing booking:", err);
        dispatch(hideLoading());
        message.error("Something went wrong.");
        navigate("/");
      }
    };

    completeBooking();
  }, []);

  return null;
}

export default PaymentSuccess;
