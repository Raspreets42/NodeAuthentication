const User = require("../model/schema");

module.exports = (req, res, next) => {
    const { userName, userEmail, userPhone, userPassword, userCPassword } = req.body;
    if (userName === '' || userEmail === '' || userPhone === '' || userPassword === '' || userCPassword === ''){
        res.status(400).send({ status: false , msg: "Please provide the form fields properly." });
    }
    if(userPassword !== userCPassword){
        res.status(400).send({ status: false , msg: "Password doesn't matched." });
    }

    User.findOne({
        userEmail
      }).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
    
        if (user) {
          res.status(400).send({ message: "Failed! user-Email is already registered." });
          return;
        }

        User.findOne({
            userPhone
          }).exec((err, user) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
        
            if (user) {
              res.status(400).send({ message: "Failed! user-Phone is already registered." });
              return;
            }
            next();
        })
    })
}