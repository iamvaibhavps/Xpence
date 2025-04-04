const mongoose = require('mongoose');

// Schema for financial data
const DataSchema = new mongoose.Schema({
    // Financial Tracking
    totalIncome: { type: Number, default: 0 },
    totalExpenses: { type: Number, default: 0 },
    totalSavings: { type: Number, default: 0 },
    totalInvestments: { type: Number, default: 0 },

    // Expense Breakdown by Category
    expenseCategories: {
        food: { type: Number, default: 0 },
        rent: { type: Number, default: 0 },
        shopping: { type: Number, default: 0 },
        travel: { type: Number, default: 0 },
        miscellaneous: { type: Number, default: 0 }
    },

    // Investment Distribution
    investmentCategories: {
        stocks: { type: Number, default: 0 },
        mutualFunds: { type: Number, default: 0 },
        realEstate: { type: Number, default: 0 },
        gold: { type: Number, default: 0 },
        fixedDeposits: { type: Number, default: 0 },
        crypto: { type: Number, default: 0 }
    },

    // AI Insights
    spendingEfficiencyScore: { type: Number, min: 0, max: 100 },
    investmentGrowth: { type: Number, default: 0 }, // % increase/decrease

    // Group Expense Contributions
    groupExpenses: {
        family: { type: Number, default: 0 },
        friends: { type: Number, default: 0 },
        work: { type: Number, default: 0 },
        travel: { type: Number, default: 0 }
    },
    groupContributions: { type: Number, default: 0 }
});

// Helper function to initialize all fields with 0
const initializeData = () => {
    const data = {};
    Object.keys(DataSchema.obj).forEach((key) => {
        data[key] = 0;
    });
    return data;
};

// Schema for weekly data
const WeeklyDataSchema = new mongoose.Schema({
    startOfCurrentWeek: { type: Object, default: initializeData },
    days: {
        Sunday: { type: Object, default: initializeData },
        Monday: { type: Object, default: initializeData },
        Tuesday: { type: Object, default: initializeData },
        Wednesday: { type: Object, default: initializeData },
        Thursday: { type: Object, default: initializeData },
        Friday: { type: Object, default: initializeData },
        Saturday: { type: Object, default: initializeData },
    },
});

// Schema for yearly data
const YearlyDataSchema = new mongoose.Schema({
    financialYear: {
        type: String,
        required: true,
    }, // E.g., 2025, 2026, etc.
    months: {
        April: { type: Object, default: initializeData },
        May: { type: Object, default: initializeData },
        June: { type: Object, default: initializeData },
        July: { type: Object, default: initializeData },
        August: { type: Object, default: initializeData },
        September: { type: Object, default: initializeData },
        October: { type: Object, default: initializeData },
        November: { type: Object, default: initializeData },
        December: { type: Object, default: initializeData },
        January: { type: Object, default: initializeData },
        February: { type: Object, default: initializeData },
        March: { type: Object, default: initializeData },
    },
});

// Main schema for performance data
const UserPerformanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    financialYears: {
        type: [YearlyDataSchema],
        default: () => [],
    },
    weekly: {
        type: WeeklyDataSchema,
        default: () => ({
            startOfCurrentWeek: initializeData(),
            days: {
                Sunday: initializeData(),
                Monday: initializeData(),
                Tuesday: initializeData(),
                Wednesday: initializeData(),
                Thursday: initializeData(),
                Friday: initializeData(),
                Saturday: initializeData(),
            },
        }),
    },
});

UserPerformanceSchema.methods.addYearIfMissing = async function (financialYear) {
    let yearExists = this.financialYears.find((y) => y.financialYear === financialYear);

    if (!yearExists) {
        console.log(`Adding new financial year: ${financialYear}`);

        // Create a new year object with all months initialized with default values
        const defaultData = Object.keys(DataSchema.obj).reduce((acc, key) => {
            if (key === 'overallRank' || key === 'taskRank' || key === 'goalRank') {
                acc[key] = 999;
            } else {
                acc[key] = 0;
            }
            return acc;
        }, {});

        const newYear = {
            financialYear,
            months: {
                April: { ...defaultData },
                May: { ...defaultData },
                June: { ...defaultData },
                July: { ...defaultData },
                August: { ...defaultData },
                September: { ...defaultData },
                October: { ...defaultData },
                November: { ...defaultData },
                December: { ...defaultData },
                January: { ...defaultData },
                February: { ...defaultData },
                March: { ...defaultData },
            }
        };

        this.financialYears.push(newYear);
        await this.save(); // Ensure the changes are saved
        console.log(`Financial year ${financialYear} added successfully.`);
    } else {
        console.log(`Financial year ${financialYear} already exists.`);
    }
};


// Create the model
const UserPerformance = mongoose.model('UserPerformance', UserPerformanceSchema);

module.exports = UserPerformance;
