const express = require("express");
const model = require("../Models/authendication");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const generateToken = require("../genToken");
const router = express.Router();
const verifyToken = require("../middleware");

router.get("/users", async (req, res) => {
  try {
    const users = await model.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const existingUser = await model.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new model({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await model.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Incorrect email or password" });
    }

    const passwordValidate = await bcrypt.compare(password, user.password);

    if (!passwordValidate) {
      return res.status(404).json({ message: "Incorrect email or password" });
    }

    const token = generateToken(user._id);
    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/verify", verifyToken, async (req, res) => {
  try {
    res.send(true);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
