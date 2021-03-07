// Custom middleware to prevent user from accessing back to log in route if logged in
module.exports.preventWhenLogged = (req, res, next) => {
    if (req.signedCookies.userId) {
        res.redirect("/dashboard");
    } else {
        next();
    }
};
