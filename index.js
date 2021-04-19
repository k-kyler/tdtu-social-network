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

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

io.on("connection", (socket) => {
    // Server wait for emitting message from client to allow client to fetch post
    socket.on("Store new post", (post) => {
        let postUniqueId = v4UniqueId();

        socket.broadcast.emit("Fetching new post", post, postUniqueId);
    });

    // Server wait for emitting message from client to allow client to render post
    socket.on("Add new post", (post) => {
        io.sockets.emit("Rendering new post", post);
    });

    // Server wait for emitting message from client to allow client to update post
    socket.on("Update post", (updatePost) => {
        io.sockets.emit("Rendering update post", updatePost);
    });

    // Server wait for emitting message from client to allow client to delete post
    socket.on("Delete post", (postUniqueId) => {
        io.sockets.emit("Deleting post", postUniqueId);
    });

    // Server wait for emitting message from client to allow client to render back post's image
    socket.on("Update post image", (updatePostImage) => {
        io.sockets.emit("Rendering post image", updatePostImage);
    });

    // Server wait for emitting message from client to allow client to render back edit post's image
    socket.on("Update edit post image", (updateEditPostImage) => {
        io.sockets.emit("Rendering edit post image", updateEditPostImage);
    });

    // Server wait for emitting message from client to allow client to fetch comment
    socket.on("Store new comment", (comment) => {
        let commentUniqueId = v4UniqueId();

        socket.broadcast.emit("Fetching new comment", comment, commentUniqueId);
    });

    // Server wait for emitting message from client to allow client to render comment
    socket.on("Add new comment", (comment) => {
        io.sockets.emit("Rendering new comment", comment);
    });

    // Server wait for emitting message from client to allow client to update comment
    socket.on("Update comment", (updateComment) => {
        io.sockets.emit("Rendering update comment", updateComment);
    });

    // Server wait for emitting message from client to allow client to delete comment
    socket.on("Delete comment", (commentUniqueId) => {
        io.sockets.emit("Deleting comment", commentUniqueId);
    });

    // Server wait for emitting message from client to allow client to see the notification alert
    socket.on("Notification alert", (notification) => {
        io.sockets.emit("Displaying notification alert", notification);
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
