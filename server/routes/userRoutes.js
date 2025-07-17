const express = require('express');
const { registerUser, loginUser,getCurrentUser,forgetPassword,resetPassword} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const userRouter = express.Router();

function middleware(req, res, next) {
  // Example middleware function
  console.log('Middleware executed');
  next();
}

// Route to register a new user
userRouter.post('/register', middleware,registerUser);
// Route to login a user
userRouter.post('/login', loginUser);
// Route to get the current user
userRouter.get('/current-user', authMiddleware, getCurrentUser);

userRouter.patch("/forgetpassword", forgetPassword);
userRouter.patch("/resetpassword", resetPassword);


module.exports = userRouter;