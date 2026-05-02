const Log = require("./logging_middleware/logger");

(async () => {
    await Log(
        "backend",
        "info",
        "service",
        "test log working"
    );
})();