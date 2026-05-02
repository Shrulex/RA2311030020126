function knapsackWithSelection(vehicles, maxHours) {
    const n = vehicles.length;

    // Safety check
    if (n === 0 || maxHours <= 0) {
        return { maxScore: 0, selectedVehicles: [] };
    }

    const dp = Array.from({ length: n + 1 }, () =>
        Array(maxHours + 1).fill(0)
    );

    // Fill DP table
    for (let i = 1; i <= n; i++) {
        const v = vehicles[i - 1];

        for (let w = 0; w <= maxHours; w++) {
            if (v.maintenanceTime <= w) {
                dp[i][w] = Math.max(
                    dp[i - 1][w],
                    dp[i - 1][w - v.maintenanceTime] + v.importanceScore
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    // Backtrack
    let w = maxHours;
    const selected = [];

    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selected.push(vehicles[i - 1]);
            w -= vehicles[i - 1].maintenanceTime;
        }
    }

    return {
        maxScore: dp[n][maxHours],
        selectedVehicles: selected.reverse()
    };
}

module.exports = { knapsackWithSelection };