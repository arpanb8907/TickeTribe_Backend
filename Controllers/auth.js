import { where } from "sequelize";
import User from "../Models/user.js";
import bcrypt from "bcrypt.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password) {
      res.status(400).json("Bad request");
      return;
    }

    const userExists = await User.count({ where: { username } });

    if (userExists > 0) {
      res.status(400).json({ message: " User is already registerd" });
      return;
    } else {
      const hashedpwd = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        name,
        email,
        password: hashedpwd,
      });

      return res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
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
