const signupMiddleware =  require("../middlewares/signup.middleware");
const controller = require("../controllers/auth.controller");

module.exports = (app) => {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post('/api/register' , signupMiddleware, controller.signup);
}