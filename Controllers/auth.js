import { where } from "sequelize";
import User from "../Models/user.js";
import bcrypt from "bcrypt";

import { sendOTP } from "../Utils/sendOTP.js";

export const authenticate = async (req, res) => {
  const { phone_no } = req.body;
  console.log(phone_no);
  if (!phone_no) {
    return res.status(404).json({ message: "Phone number is missing" });
  }
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const sent_otp = await sendOTP(phone_no, otp);

    if (!sent_otp) {
      return res.status(500).json({ error: "Failed to send OTP" });
    }

    // store otp and user data in memory as http is stateless , session in express allows to persist user's state.
    req.session = req.session || {};
    req.session.otp = otp;
    req.session.phone_no = phone_no;

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body();

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      res.status(404).json({ message: `Invalid credentials` });
      return;
    }

    const ismatch = await bcrypt.compare(password, user.password);

    if (!ismatch) {
      res.status(404).json({ message: `Invalid credentials` });
      return;
    }

    return res.status(200).json({ message: `Login successful` });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verify_otp = async (req, res) => {
  const { otp, phone } = req.body;
  console.log(otp,phone)
  try {
    if (!req.session || !req.session.otp || !req.session.phone_no) {
      return res.status(400).json({ message: "Session expired " });
    }

    if (req.session.otp === otp && req.session.phone_no === phone) {
      delete req.session.otp;
      delete req.session.phone_no;

      // search user in the database based on phone number
      let user = await User.findOne({ where: { phone: phone } });
      console.log(user);
      if (!user) {
        // is user does not exist create an user
        user = await User.create({ phone });
      }

      return res.status(200).json({ message: "OTP verified successfully" });
    } else {
      return res.status(401).json({ message: "Invalid OTP or phone number" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
