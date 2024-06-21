export const PERIOD_LIST = {
    WEEKLY: "WEEKLY",
    MONTHLY: "MONTHLY",
    QUARTERLY: "QUARTERLY",
    YEARLY: "YEARLY"
}

// List of month names
export const MONTH_LIST = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
];

export const DATA_OPTION_LIST = [
    {
        value: "default",
        label: "Default",
    },
    ...Array.from({ length: 52 }, (v, i) => ({
        value: `week${i + 1}`,
        label: `Week ${i + 1}`,
    })),
    ...[
        { value: "january1", label: "January" },
        { value: "february2", label: "February" },
        { value: "march3", label: "March" },
        { value: "april4", label: "April" },
        { value: "may5", label: "May" },
        { value: "june6", label: "June" },
        { value: "july7", label: "July" },
        { value: "august8", label: "August" },
        { value: "september9", label: "September" },
        { value: "october10", label: "October" },
        { value: "november11", label: "November" },
        { value: "december12", label: "December" }
    ],
    ...[
        { value: "quarter1", label: "Quarter 1" },
        { value: "quarter2", label: "Quarter 2" },
        { value: "quarter3", label: "Quarter 3" },
        { value: "quarter4", label: "Quarter 4" },
    ]
];
