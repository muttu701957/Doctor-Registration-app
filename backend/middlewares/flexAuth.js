import jwt from "jsonwebtoken";

// Accepts both cookie `token` (user) and header `dtoken` (doctor)
export const flexAuth = (req, res, next) => {
  const token = req.cookies.token || req.headers.dtoken;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
