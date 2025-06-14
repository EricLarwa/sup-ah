
//hooks for glucose and notes input

export function getGlucoseCategory(value: number): 'low' | 'normal' | 'high' {
    if (value < 70) return 'low';
    if (value > 180) return 'high';
    return 'normal';
}

export function calculateStats(readings: Reading[]) {
    if (readings.length === 0) {
        return {
            latestReading: null,
            avgReading: null,
            readingsCount: 0,
            normalPercent: 0,
            highPercent: 0,
            lowPercent: 0,
            avgGlucose: 0
        };
    }

    const totalReadings = readings.length;
    const normal = readings.filter(r => r.category === 'normal').length;
    const high = readings.filter(r => r.category === 'high').length;
    const low = readings.filter(r => r.category === 'low').length;

    const previousSevenDays = new Date();
    previousSevenDays.setDate(previousSevenDays.getDate() - 7);

    const recentReadings = readings.filter(r => r.timestamp >= previousSevenDays);
    const avgReadings = recentReadings.length > 0
        ? recentReadings.reduce((sum, r) => sum + r.glucose, 0) / recentReadings.length
        : null;

    const avgGlucose = readings.reduce((sum, r) => sum + r.glucose, 0) / totalReadings;

    return {
        latestReading: readings[0]?.glucose || null,
        avgReading: avgReadings ? Math.round(avgReadings) : null,
        readingsCount: totalReadings,
        normalPercent: Math.round((normal / totalReadings) * 100),
        highPercent: Math.round((high / totalReadings) * 100),
        lowPercent: Math.round((low / totalReadings) * 100),
        avgGlucose: Math.round(avgGlucose)
    };
}