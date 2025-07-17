const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization header missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    const verifiedToken = jwt.verify(token, process.env.jwt_secret);

    req.user = verifiedToken; // ✅ store decoded token in req.user

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).send({ success: false, message: "Token Invalid" });
  }
};

module.exports = auth;
