const checkAdminAuth = (req, res, next) => {
  const adminSecretKey = req.headers["x-admin-secret"];

  if (!adminSecretKey) {
    return res.status(401).json({ message: "Admin secret key is required" });
  }

  if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ message: "Invalid admin secret key" });
  }

  next();
};

module.exports = {
  checkAdminAuth,
};
