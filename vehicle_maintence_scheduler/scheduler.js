const { fetchVehicles, fetchDepots } = require("./service");
const { knapsackWithSelection } = require("./utils");
const Log = require("../logging_middleware/logger");

(async () => {
    try {
        await Log("backend", "info", "controller", "start scheduler");

        const vehiclesRes = await fetchVehicles();
        const depotsRes = await fetchDepots();

        console.log("DEPOTS RESPONSE:", depotsRes);
        console.log("VEHICLES RESPONSE:", vehiclesRes);


        const vehiclesRaw =
            vehiclesRes.vehicles || vehiclesRes.data || vehiclesRes;

        if (!Array.isArray(vehiclesRaw)) {
            throw new Error("vehicles not array");
        }


        const vehicles = vehiclesRaw.map(v => ({
            maintenanceTime: v.maintenanceTime || v.maintenance_time,
            importanceScore: v.importanceScore || v.importance_score
        }));


        const depots = depotsRes.depots;

        if (!depots || depots.length === 0) {
            throw new Error("no depot data");
        }

        const maxHours = depots[0].MechanicHours;

        await Log("backend", "info", "service", "hours ready");

        const result = knapsackWithSelection(vehicles, maxHours);

        await Log("backend", "info", "service", "scheduler done");

        console.log("\n===== FINAL RESULT =====");
        console.log("Max Importance Score:", result.maxScore);
        console.log("Selected Vehicles:", result.selectedVehicles);

    } catch (err) {
        await Log("backend", "error", "controller", "scheduler failed");
        console.error(err.message);
    }
})();