const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
    console.log(req);
    const { userName, userEmail, userPhone, userPassword, userCPassword } = req.body;
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
}