const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const connectDB = require("./db/connect");

const bcrypt = require("bcrypt");
const User = require("./model/schema");

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(cors({ origin: "*" }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/api/changepassword", async (req, res) => {
  const { userNewPassword, userCNewPassword, token } = req.body;
  if (userNewPassword !== userCNewPassword) {
    res.status(404).json({ status: false, msg: "Password does not got matched." });
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const _id = user.id;
    const hashedPass = await bcrypt.hash(userNewPassword, 10);
    const hashedCPass = await bcrypt.hash(userCNewPassword, 10);
    console.log(user);

    await User.updateOne(
      { _id },
      {
        $set: { 
            userPassword: hashedPass,
            userCPassword: hashedCPass
        },
      }
    );
    res.status(200).json({ status: true, msg: "Password changed successfully" });
  } catch (error) {
    res.status(404).json({ status: false, msg: "Failed to respond" });
  }
});

app.post("/api/login", async (req, res) => {
  const { userEmail, userPassword } = req.body;

  const user = await User.findOne({ userEmail });

  if (!user) {
    return res.status(404).json({
      status: false,
      msg: "Invalid User email or/and password",
    });
  }

  if (await bcrypt.compare(userPassword, user.userPassword)) {
    const token = jwt.sign(
      {
        id: user._id,
        userEmail: user.userEmail,
      },
      JWT_SECRET
    );
    return res.status(200).json({ status: true, msg: "User logged-in successfully", token: token });
  }

  res.status(404).json({ status: false, msg: "Invalid User email or/and password" });
}); 

app.post("/api/register", async (req, res) => {
  const { userName, userEmail, userPhone, userPassword, userCPassword } =
    req.body;

  if (
    userName === "" ||
    userEmail === "" ||
    userPhone === "" ||
    userPassword === "" ||
    userCPassword === ""
  ) {
    res.status(404).json({
      status: 500,
      msg: "Please fill all the required fields",
    });
    return;
  } else if (userPassword !== userCPassword) {
    res.status(404).json({
      status: 401,
      msg: "Password does not matches",
    });
    return;
  }

  const userHashedPassword = await bcrypt.hash(userPassword, 10);
  const userHashedCPassword = await bcrypt.hash(userCPassword, 10);

  try {
    const resp = await User.create({
      userName,
      userEmail,
      userPhone,
      userPassword: userHashedPassword,
      userCPassword: userHashedCPassword,
    });
    console.log("resp : ", resp);
    res.status(2000).json({ status: true, msg: "Successfully Registered" });
  } catch (err) {
    res.status(404).json({ status: false, msg: err.message });
  }
});

const start = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
