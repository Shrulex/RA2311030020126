const { fetchVehicles, fetchDepots } = require("./service");
const { knapsackWithSelection } = require("./utils");
const Log = require("../logging_middleware/logger");

(async () => {
    try {
        await Log("backend", "info", "controller", "start scheduler");

        const vehiclesRes = await fetchVehicles();
        const depotsRes = await fetchDepots();

        await Log("backend", "info", "service", "data fetched");

       
        const vehiclesRaw =
            vehiclesRes.vehicles || vehiclesRes.data || vehiclesRes;

        if (!Array.isArray(vehiclesRaw)) {
            await Log("backend", "error", "service", "invalid vehicles");
            throw new Error("vehicles not array");
        }

        const vehicles = vehiclesRaw.map(v => ({
            maintenanceTime: v.Duration,
            importanceScore: v.Impact
        }));

        const vehiclesFiltered = vehicles.filter(
            v => v.maintenanceTime > 0 && v.importanceScore > 0
        );

        await Log("backend", "info", "service", "vehicles ready");

        const depots = depotsRes.depots;

        if (!depots || depots.length === 0) {
            await Log("backend", "error", "service", "no depot data");
            throw new Error("no depot data");
        }

        const maxHours = depots[0].MechanicHours;

        await Log("backend", "info", "service", "hours ready");

        const result = knapsackWithSelection(vehiclesFiltered, maxHours);

        await Log("backend", "info", "service", "scheduler done");

        console.log("\n===== VEHICLE MAINTENANCE RESULT =====");
        console.log("Total Mechanic Hours:", maxHours);
        console.log("Max Importance Score:", result.maxScore);
        console.log("Number of Vehicles Selected:", result.selectedVehicles.length);

        console.log("\nSelected Vehicles:");
        result.selectedVehicles.forEach((v, index) => {
            console.log(
                `#${index + 1} -> Time: ${v.maintenanceTime}, Score: ${v.importanceScore}`
            );
        });

    } catch (err) {
        await Log("backend", "error", "controller", "scheduler failed");
        console.error("Error:", err.message);
    }
})();
