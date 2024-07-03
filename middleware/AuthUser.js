import User from "../models/UserModel.js";
// Middleware otorisasi dengan logging
export const verifyUser = async (req, res, next) => {
  console.log("Session:", req.session);
  if (!req.session.userId) {
    console.log("Unauthorized access attempt");
    return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
  }
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  req.userId = user.id;
  req.role = user.role;
  next();
};

export const adminOnly = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  if (user.role !== "admin") return res.status(403).json({ msg: "Akses terlarang, anda bukan admin!" });
  next();
};
