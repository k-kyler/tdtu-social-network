// Require variables from .env
require("dotenv").config();

// Initial express
const express = require("express");

// Initial cookie-parser
const cookieParser = require("cookie-parser");

// Initial mongoose
const mongoose = require("mongoose");

// Initial express flash
const flash = require("express-flash");

// Initial express session
const session = require("express-session");

// Initial uuid
const { v4: v4UniqueId } = require("uuid");

// Require routes
const authRoute = require("./routes/auth.route");
const dashboardRoute = require("./routes/dashboard.route");

// Require custom middlewares
const authMiddleware = require("./middlewares/auth.middleware");
const isAuthMiddleware = require("./middlewares/isAuth.middleware");

// App setup
const app = express();
const port = process.env.PORT || 5555;
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer); // Initial socket.io

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET)); // Config secret cookie
app.use(express.static("public"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

io.on("connection", (socket) => {
    // Server wait for emitting message from client to allow client to render post
    socket.on("Add new post", (post) => {
        postUniqueId = v4UniqueId();
        io.sockets.emit("Rendering new post", post, postUniqueId);
    });

    // Server wait for emitting message from client to allow client to render comment
    socket.on("New post", (comment) => {
        io.sockets.emit("Rendering new comment", comment);
    });
});

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

// User sign out endpoint
app.get("/logout", (req, res) => {
    res.clearCookie("userId");
    res.clearCookie("userName");
    res.clearCookie("token");
    res.redirect("/");
});

// Use routes
app.use("/auth", isAuthMiddleware.preventWhenLogged, authRoute);
app.use("/dashboard", authMiddleware.requireAuth, dashboardRoute);

// Server listen
httpServer.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
