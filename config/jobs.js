const User = require("../models/User");
const Food = require("../models/Food");


module.exports = (agenda) => {
    agenda.define("refresh food food", async (job) => {
        await Food.deleteMany({ $or: [ { expiration: { $lt: Date.now() } }, { quantityLeft: 0 } ] });
    });

    agenda.define("reset students daily claimed food", async (job) => {
        await User.updateMany({ type: "student" }, { foodProcessed: 0 });
    });

    (async () => {
        await agenda.start();

        await agenda.every("1 day", [
            "remove expired food",
            "reset students daily claimed food"
        ]);
    })();
};