// Require variables from .env
require("dotenv").config();

// Initial express
const express = require("express");

// Initial use of body-parser
const bodyParser = require("body-parser");

// Initial use of cookie-parser
const cookieParser = require("cookie-parser");

// Initial mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Require routes
const authRoute = require("./routes/auth.route");
const dashboardRoute = require("./routes/dashboard.route");

// Require custom middlewares
const authMiddleware = require("./middlewares/auth.middleware");
const isAuthMiddleware = require("./middlewares/isAuth.middleware");
const sessionMiddleware = require("./middlewares/session.middleware");

// App setup
const app = express();
const port = process.env.PORT || 5555;

app.set("view engine", "pug");
app.set("views", "./views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET)); // Config secret cookie
app.use(sessionMiddleware);
app.use(express.static("public"));

// Default app endpoint
app.get("/", (req, res) => {
    if (req.signedCookies.userName) {
        res.render("index", {
            userName: req.signedCookies.userName,
        });
    } else {
        res.render("index");
    }
});

// User log out endpoint
app.get("/logout", (req, res) => {
    res.clearCookie("userId");
    res.clearCookie("userName");
    res.redirect("/");
});

// Use routes
app.use("/auth", isAuthMiddleware.preventWhenLogged, authRoute);
app.use("/dashboard", authMiddleware.requireAuth, dashboardRoute);

// Server listen
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
