const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");
const EmailHelper = require("../util/emailHelper");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ✅ Stripe Checkout Session
const makePayment = async (req, res) => {
  try {
    const { amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Movie Ticket Booking" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://bookmyflicks.netlify.app/payment-success",
      cancel_url: "https://bookmyflicks.netlify.app/book-show/cancel",
    });

    res.send({ success: true, url: session.url });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

// ✅ Book the Show
const bookShow = async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();

    const show = await Show.findById(req.body.show).populate("movie");
    const updatedBookedSeats = [...show.bookedSeats, ...req.body.seats];
    await Show.findByIdAndUpdate(req.body.show, {
      bookedSeats: updatedBookedSeats,
    });

    const populateBooking = await Booking.findById(newBooking._id)
      .populate("user")
      .populate("show")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "movies",
        },
      })
      .populate({
        path: "show",
        populate: {
          path: "theatre",
          model: "theatres",
        },
      });

    await EmailHelper("ticketTemplate.html", populateBooking.user.email, {
      name: populateBooking.user.name,
      movie: populateBooking.show.movie.movieName,
      theatre: populateBooking.show.theatre.name,
      date: populateBooking.show.date,
      time: populateBooking.show.time,
      seats: populateBooking.show.seats,
      amount: populateBooking.seats.length * populateBooking.show.ticketPrice,
      transactionId: populateBooking.transactionId,
    });

    res.send({
      success: true,
      message: "New Booking done",
      data: newBooking,
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate("user")
      .populate("show")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "movies",
        },
      })
      .populate({
        path: "show",
        populate: {
          path: "theatre",
          model: "theatres",
        },
      });

    res.send({
      success: true,
      message: "Bookings fetched",
      data: bookings,
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};
module.exports = {
  makePayment,
  bookShow,
  getAllBookings,
};


