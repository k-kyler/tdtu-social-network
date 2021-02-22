const shortid = require("shortid");
const Session = require("../models/session.model");

// Custom middleware to generate user's session when user has logged in
module.exports = (req, res, next) => {
    if (!req.signedCookies.sessionId) {
        let sessionId = shortid.generate();

        res.cookie("sessionId", sessionId, {
            signed: true,
        });

        let s = new Session({
            sessionId: sessionId,
        });

        s.save();
    }

    next();
};
