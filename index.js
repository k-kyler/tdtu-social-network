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

// Initial cors
const cors = require("cors");

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
app.use(cors());
app.use(express.json()); // Read json
app.use(express.urlencoded({ extended: true })); // Read urlencoded
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
        let postUniqueId = v4UniqueId();

        io.sockets.emit("Rendering new post", post, postUniqueId);
    });

    // Server wait for emitting message from client to allow client to update post
    socket.on("Update post", (updatePost) => {
        io.sockets.emit("Rendering update post", updatePost);
    });

    // Server wait for emitting message from client to allow client to delete post
    socket.on("Delete post", (postUniqueId) => {
        io.sockets.emit("Deleting post", postUniqueId);
    });

    // Server wait for emitting message from client to allow client to render comment
    socket.on("Add new comment", (comment) => {
        let commentUniqueId = v4UniqueId();

        io.sockets.emit("Rendering new comment", comment, commentUniqueId);
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
