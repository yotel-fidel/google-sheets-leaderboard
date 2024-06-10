export function getCurrentWeekAndYear() {
    const today = new Date();
    const currentYear = today.getFullYear();

    const firstDayOfYear = new Date(currentYear, 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear + (24 * 60 * 60 * 1000)) / 86400000;

    const currentWeekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);

    return { currentWeekNumber, currentYear };
}

export function getWeekRange(weekNumber, year) {
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeek = firstDayOfYear.getDay();
    const dayOffset = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Adjust if the first day is Sunday

    const startOfYear = new Date(firstDayOfYear);
    startOfYear.setDate(firstDayOfYear.getDate() - dayOffset);

    const startOfWeek = new Date(startOfYear);
    startOfWeek.setDate(startOfYear.getDate() + (weekNumber - 1) * 7);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const formatDateRange = (start, end) => {
        const options = { month: 'short', day: 'numeric' };
        const startStr = start.toLocaleDateString('en-US', options);
        const endStr = end.toLocaleDateString('en-US', options);
        const yearStr = start.getFullYear();

        return `Week ${weekNumber} - ${startStr} to ${endStr}, ${yearStr}`;
    };

    return formatDateRange(startOfWeek, endOfWeek);
}
