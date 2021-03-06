const User = require("../models/user.model");
const md5 = require("md5");
const { OAuth2Client } = require("google-auth-library");

const clientId = process.env.CLIENT_ID;
const client = new OAuth2Client(clientId);

module.exports.login = (req, res) => {
    let error = req.flash("errorSignIn")[0];

    if (error) {
        res.render("auth/login", {
            error: error.error,
            loginInput: error.loginInput,
        });
    } else {
        res.render("auth/login");
    }
};

module.exports.postLogin = async (req, res) => {
    // Get form input data
    let email = req.body.email;
    let password = req.body.password;

    // Get google token
    let googleIdToken = req.body.googleIdToken;

    // Variable to store google email of user
    let userGoogleEmail = "";

    // Normal log in processing
    if (email && password) {
        // Hashed input password
        let hashedPassword = md5(password);

        // Find user info by input email
        let user = await User.findOne({ email: email });

        // Check user info
        if (!user) {
            req.flash("errorSignIn", {
                error: "Account does not exist",
                loginInput: {
                    email,
                    password,
                },
            });
            res.redirect("/auth/login");
            return;
        }

        // Check if email is not TDTU type
        if (!email.includes("@tdtu.edu.vn")) {
            req.flash("errorSignIn", {
                error: "Email is not TDTU type",
                loginInput: {
                    email,
                    password,
                },
            });
            res.redirect("/auth/login");
            return;
        }

        // Check user input password
        if (user.password !== hashedPassword) {
            req.flash("errorSignIn", {
                error: "Wrong password",
                loginInput: {
                    email,
                    password,
                },
            });
            res.redirect("/auth/login");
            return;
        }

        // If login success then generating user's cookie
        res.cookie("userId", user._id, {
            signed: true,
        });

        res.cookie("userName", user.name, {
            signed: true,
        });

        // Redirect user to dashboard
        res.redirect("/dashboard");
    }

    // Google log in processing
    else if (googleIdToken) {
        googleVerifyHandler = async () => {
            const ticket = await client.verifyIdToken({
                idToken: googleIdToken,
                audience: clientId,
            });
            const payload = ticket.getPayload();

            // Check if student is not in db then add to db
            let checkUser = await User.findOne({ email: payload.email });
            let u = new User();

            if (!checkUser && payload.email.includes("@student.tdtu.edu.vn")) {
                u.userId = payload.email.split("@student.tdtu.edu.vn")[0];
                u.name = payload.name;
                u.email = payload.email;
                u.avatar = payload.picture;
                u.password = "";
                u.phone = "";
                u.permission = [];
                u.class = "";
                u.faculty = "";
                u.workplace = "";
                u.type = "Student";
                u.save();
            }

            // Add user google email
            userGoogleEmail = payload.email;
        };
        googleVerifyHandler()
            .then(async () => {
                // Find user info by google email
                let user = await User.findOne({ email: userGoogleEmail });

                // Check if email is not Student TDTU type
                if (!userGoogleEmail.includes("@student.tdtu.edu.vn")) {
                    res.send("Your email is not for TDTU Student");
                    return;
                }

                // If login success then generating user's cookie
                res.cookie("token", googleIdToken, {
                    signed: true,
                });

                res.cookie("userId", user._id, {
                    signed: true,
                });

                res.cookie("userName", user.name, {
                    signed: true,
                });

                // Send request to Front-end to redirect to dashboard
                res.send("Sign in successful with Google");
            })
            .catch((error) => {
                res.redirect("/auth/login");
            });
    }
};
