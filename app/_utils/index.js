import { PERIOD_LIST, MONTH_LIST } from "@/lib/constants";

export function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

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

export function getQuarterRange(quarterNumber, year) {
    if (quarterNumber < 1 || quarterNumber > 4) {
        throw new Error("Invalid quarter number. Must be between 1 and 4.");
    }

    const startOfYear = new Date(year, 0, 1);
    const startMonth = (quarterNumber - 1) * 3;
    const startOfQuarter = new Date(year, startMonth, 1);

    const endOfQuarter = new Date(year, startMonth + 3, 0); // Last day of the quarter

    const formatDateRange = (start, end) => {
        const options = { month: 'short', day: 'numeric' };
        const startStr = start.toLocaleDateString('en-US', options);
        const endStr = end.toLocaleDateString('en-US', options);
        const yearStr = start.getFullYear();

        return `Quarter ${quarterNumber} - ${startStr} to ${endStr}, ${yearStr}`;
    };

    return formatDateRange(startOfQuarter, endOfQuarter);
}

export function getMonthRange(monthNumber, year) {
    if (monthNumber < 1 || monthNumber > 12) {
        throw new Error("Invalid month number. Must be between 1 and 12.");
    }

    const startOfMonth = new Date(year, monthNumber - 1, 1);
    const endOfMonth = new Date(year, monthNumber, 0); // Last day of the month

    const formatDateRange = (start, end) => {
        const options = { month: 'short', day: 'numeric' };
        const startStr = start.toLocaleDateString('en-US', options);
        const endStr = end.toLocaleDateString('en-US', options);
        const yearStr = start.getFullYear();

        return `${capitalizeFirstLetter(MONTH_LIST[monthNumber - 1])} - ${startStr} to ${endStr}, ${yearStr}`;
    };

    return formatDateRange(startOfMonth, endOfMonth);
}

export function getDateRange(period, periodNumber, year) {
    period = period.toLowerCase(); // Convert period to lowercase for consistent comparison

    switch (period) {
        case PERIOD_LIST.WEEKLY.toLowerCase():
            return getWeekRange(periodNumber, year);
        case PERIOD_LIST.QUARTERLY.toLowerCase():
            return getQuarterRange(periodNumber, year);
        case PERIOD_LIST.MONTHLY.toLowerCase():
            // const monthNumber = new Date(`${period} 1, ${year}`).getMonth() + 1;
            return getMonthRange(periodNumber, year);
        default:
            throw new Error("Invalid period. Must be 'week', 'quarter', or a month name.");
    }
}

export function parsePeriodString(periodString) {
    // Extract the period (letters) and the number (digits) from the input string
    const match = periodString.match(/([a-zA-Z]+)(\d+)/);

    if (!match) {
        throw new Error("Invalid period string format");
    }

    let period = match[1];
    const number = match[2];

    // Check if the input string is one of the month names (case-insensitive)
    if (MONTH_LIST.includes(period.toLowerCase())) {
        return {
            period: PERIOD_LIST.MONTHLY.toLowerCase(),
            number
        };
    }

    // Add "ly" to the end of the period
    period = `${period.toLowerCase()}ly`;

    return {
        period: period.toLowerCase(),
        number: number
    };
}

export function formatLargeCurrency(value) {
    const currencySymbols = ['$', '£', '€'];
    let removedCurrency = '£';
    let money = value;

    if (currencySymbols.includes(value[0])) {
        removedCurrency = value[0];
        money = value.substring(1).replace(/,/g, '');
    }

    let numericValue = parseFloat(money);

    if (isNaN(numericValue)) {
        numericValue = 0;
    }

    if (numericValue >= 1000) {
        const formattedValue = Math.floor(numericValue / 1000 * 10) / 10; // Round down to 1 decimal place
        return `${removedCurrency}${formattedValue}k`;
    }
    // Ensure the number is always rounded down to two decimal places
    const roundedDownValue = Math.floor(numericValue * 100) / 100;
    return `${removedCurrency}${roundedDownValue.toFixed(2)}`;
};

export function getCurrencyOrScore(data, periodObject, isCurrency) {
    // console.log("PERIOOD:", periodObject.period)
    switch (periodObject.period.toLowerCase()) {
        case PERIOD_LIST.WEEKLY.toLowerCase():
            return isCurrency ? formatLargeCurrency(data.weekly[periodObject.number - 1]) : data.weekly[periodObject.number - 1];
        case PERIOD_LIST.QUARTERLY.toLowerCase():
            return isCurrency ? formatLargeCurrency(data.quarterly[periodObject.number - 1]) : data.quarterly[periodObject.number - 1];
        case PERIOD_LIST.MONTHLY.toLowerCase():
            return isCurrency ? formatLargeCurrency(data.monthly[periodObject.number - 1]) : data.monthly[periodObject.number - 1];
        default:
            throw new Error("There is something wrong with getting the currency or score data.");
    }
}

export function getCurrencyFloatFormat(data, periodObject) {
    switch (periodObject.period.toLowerCase()) {
        case PERIOD_LIST.WEEKLY.toLowerCase():
            return parseFloat(data.weekly[periodObject.number - 1].substring(1).replace(/,/g, ''));
        case PERIOD_LIST.QUARTERLY.toLowerCase():
            return parseFloat(data.quarterly[periodObject.number - 1].substring(1).replace(/,/g, ''));
        case PERIOD_LIST.MONTHLY.toLowerCase():
            return parseFloat(data.monthly[periodObject.number - 1].substring(1).replace(/,/g, ''));
        default:
            throw new Error("There is something wrong. Please try to check the period.");
    }
}

export function getTotalCurrencyOrScore(data, periodObject, isCurrency) {
    // console.log("PERIOOD:", periodObject.period)
    switch (periodObject.period.toLowerCase()) {
        case PERIOD_LIST.WEEKLY.toLowerCase():
            return isCurrency ? formatLargeCurrency(data.weekly[periodObject.number - 1]) : data.weekly[periodObject.number - 1];
        case PERIOD_LIST.QUARTERLY.toLowerCase():
            return isCurrency ? formatLargeCurrency(data.quarterly[periodObject.number - 1]) : data.quarterly[periodObject.number - 1];
        case PERIOD_LIST.MONTHLY.toLowerCase():
            return isCurrency ? formatLargeCurrency(data.monthly[periodObject.number - 1]) : data.monthly[periodObject.number - 1];
        default:
            throw new Error("There is something wrong with getting the currency or score data.");
    }
}


// Helper function to create a deep copy of the array and sort it
export const sortDataBasedOnPeriod = (dataArray, period, periodNumber, isCurrency = false) => {
    return [...dataArray].sort((a, b) => {
        let aValue, bValue;

        if (period.toLowerCase().startsWith(PERIOD_LIST.WEEKLY.toLowerCase())) {
            const weekIndex = periodNumber - 1;
            aValue = isCurrency
                ? parseFloat(a.weekly[weekIndex].substring(1).replace(/,/g, ''))
                : Number(a.weekly[weekIndex]);
            bValue = isCurrency
                ? parseFloat(b.weekly[weekIndex].substring(1).replace(/,/g, ''))
                : Number(b.weekly[weekIndex]);
        } else if (period.toLowerCase().startsWith(PERIOD_LIST.QUARTERLY.toLowerCase())) {
            const quarterIndex = periodNumber - 1;
            aValue = isCurrency
                ? parseFloat(a.quarterly[quarterIndex].substring(1).replace(/,/g, ''))
                : Number(a.quarterly[quarterIndex]);
            bValue = isCurrency
                ? parseFloat(b.quarterly[quarterIndex].substring(1).replace(/,/g, ''))
                : Number(b.quarterly[quarterIndex]);
        } else {
            // NO MINUS 1 (like in weekIndex) AS IT IS CALLING AN OBJECT
            const monthIndex = periodNumber - 1;
            // console.log("MONTH: ", month)
            // console.log("DATA a & b: ", Number(a.monthly[month]), Number(b.monthly[month]))
            aValue = isCurrency
                ? parseFloat(a.monthly[monthIndex].substring(1).replace(/,/g, ''))
                : Number(a.monthly[monthIndex]);
            bValue = isCurrency
                ? parseFloat(b.monthly[monthIndex].substring(1).replace(/,/g, ''))
                : Number(b.monthly[monthIndex]);
        }

        return bValue - aValue;
    });
};

export function addAllValues(...values) {
    return values.reduce((sum, value) => {
        // Convert value to string and remove commas and currency signs (dollar and pound)
        let cleanedValue = value.toString().replace(/[$£€,]/g, '');
        cleanedValue = parseFloat(cleanedValue);

        if (isNaN(cleanedValue)) {
            cleanedValue = 0;
        }

        // Convert the cleaned value to a number and add to the sum
        return sum + cleanedValue;
    }, 0);
}

export function convertToStrMoney(currency, amount) {
    // Ensure the amount is a number and has two decimal places
    let formattedAmount = Number(amount).toFixed(2);

    // Add commas as thousands separators
    formattedAmount = formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return currency + formattedAmount;
}