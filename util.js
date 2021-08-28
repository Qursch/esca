module.exports = {
    isASchool: (req, res, next) => {
        if (req.isAuthenticated() && req.user.type == "school") {
            return next();
        }
        res.json({ error: "Invalid authentication." });
    },

    isAProvider: (req, res, next) => {
        if (req.isAuthenticated() && req.user.type == "provider") {
            return next();
        }
        res.json({ error: "Invalid authentication." });
    }
}