const User = require("../models/User");
const Food = require("../models/Food");


module.exports = (agenda) => {
    agenda.define("remove expired food", async (job) => {
        await Food.deleteMany({ expiration: { $lt: Date.now() }});
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