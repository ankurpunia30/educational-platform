const rateLimit = require("express-rate-limit");
// Rate limit for sensitive routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: "Too many login attempts, please try again later.",
});

module.exports = authLimiter;
