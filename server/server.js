const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
require('./config/db');
const userRouter = require('./routes/userRoutes');
const movieRouter = require('./routes/MovieRoutes');
const theatreRouter = require('./routes/theatreRoutes');
const showRouter = require('./routes/showRoutes');
const bookingRouter = require('./routes/bookingRoutes'); // Uncomment if booking routes are needed

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));


app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/movies', movieRouter);
app.use('/api/theatres', theatreRouter);
app.use("/api/shows", showRouter);
app.use('/api/booking', bookingRouter); 

app.get("/health",(req,res) => {
  res.status(200).json({
    success: true,
    message: "ha backend chalu hai thik se...!! tension mat le"
  });
})

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
