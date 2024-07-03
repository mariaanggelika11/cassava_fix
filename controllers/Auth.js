import User from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const Login = async (req, res) => {
  try {
    // Cari pengguna berdasarkan email
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    // Jika pengguna tidak ditemukan, kirim respons 404
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    // Verifikasi password menggunakan bcrypt
    const match = await bcrypt.compare(req.body.password, user.password);

    // Jika password tidak cocok, kirim respons 400
    if (!match) {
      return res.status(400).json({ msg: "Password salah" });
    }

    // Simpan userId dalam session
    req.session.userId = user.uuid;

    // Kirim respons sukses dengan informasi pengguna
    const { uuid, name, email, role } = user;
    res.status(200).json({ uuid, name, email, role });
  } catch (error) {
    // Tangani error jika terjadi
    console.error("Error saat login:", error);
    res.status(500).json({ msg: "Terjadi kesalahan saat login" });
  }
};

export const Me = async (req, res) => {
  try {
    // Pastikan user sudah login
    if (!req.session.userId) {
      return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }

    // Cari informasi pengguna berdasarkan userId dari session
    const user = await User.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: {
        uuid: req.session.userId,
      },
    });

    // Jika pengguna tidak ditemukan, kirim respons 404
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    // Kirim informasi pengguna sebagai respons
    res.status(200).json(user);
  } catch (error) {
    // Tangani error jika terjadi
    console.error("Error saat mendapatkan informasi pengguna:", error);
    res.status(500).json({ msg: "Terjadi kesalahan saat memproses permintaan" });
  }
};

export const logOut = (req, res) => {
  try {
    // Hapus session dari server
    req.session.destroy((err) => {
      if (err) {
        console.error("Error saat logout:", err);
        return res.status(400).json({ msg: "Tidak dapat logout" });
      }
      // Kirim respons logout sukses
      res.status(200).json({ msg: "Anda telah logout" });
    });
  } catch (error) {
    // Tangani error jika terjadi
    console.error("Error saat logout:", error);
    res.status(500).json({ msg: "Terjadi kesalahan saat memproses permintaan" });
  }
};
