// Salary calculation utilities
const calculateSalaries = (hourlyRate) => {
    const rate = parseFloat(hourlyRate);
    if (isNaN(rate)) return null;
    return {
        hourly: rate,
        daily: rate * 8,
        weekly: rate * 40,
        biweekly: rate * 80,
        monthly: Math.round(rate * 173.33),
        yearly: rate * 2080
    };
};

/**
 * Calculates hourly rate from a yearly salary
 * @param {number} yearlySalary 
 * @returns {number} hourly rate
 */
const calculateHourlyFromYearly = (yearlySalary) => {
    return yearlySalary / 2080;
};

// Format number with commas
const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '$0';
    return '$' + amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: (amount % 1 === 0) ? 0 : 2
    });
};

// All supported hourly rates (extracted from CSV top-performing pages)
const hourlyRates = [
    10, 11, 12, 13, 13.5, 14, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5,
    20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 26, 26.5, 27, 27.5, 28, 28.5, 29,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
    50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
    70, 72, 74, 75, 76, 77, 78, 80, 83, 85, 90, 95, 100, 110, 115, 120, 130, 140, 150, 200
];

// Get related rates for a given rate (nearby rates)
const getRelatedRates = (rate) => {
    // Find rates close to this one
    const nearby = hourlyRates.filter(r => Math.abs(r - rate) < 10 && r !== rate);
    // Return a subset if too many
    return nearby.sort((a, b) => Math.abs(a - rate) - Math.abs(b - rate)).slice(0, 10);
};

// SEO content for each rate
const getSEOContent = (rate, type = 'hourly') => {
    const salaries = calculateSalaries(rate);
    if (!salaries) return null;

    // Fix: round to 2 decimal places consistently
    const displayRate = rate % 1 === 0 ? rate : parseFloat(rate.toFixed(2));

    let h1 = `At $${displayRate} an hour, what is your weekly, monthly, and yearly salary?`;
    let title = `At $${displayRate} an hour, what is your weekly, monthly, and yearly salary? | SalaryCalc`;

    if (type === 'yearly') {
        const yearlyAmount = salaries.yearly >= 1000 ? `${salaries.yearly / 1000}k` : formatCurrency(salaries.yearly);
        h1 = `${yearlyAmount} a year is how much an hour?`;
        title = `${yearlyAmount} a year is how much an hour? | SalaryCalc`;
    }

    const metaDescription = `$${displayRate}/hour equals ${formatCurrency(salaries.yearly)} per year, ${formatCurrency(salaries.monthly)} per month, ${formatCurrency(salaries.weekly)} per week. Use our free salary calculator to convert hourly wages.`;

    return {
        title,
        metaDescription,
        h1,
        intro: `Break down your income of $${displayRate} into its daily, weekly, bi-weekly, monthly and yearly salary equivalents. Whether you're planning your finances or evaluating job offers, our Salary Calculator has you covered.`,
        sections: {
            yearly: {
                title: `How much is $${displayRate} an hour annually?`,
                content: `If you're earning $${displayRate} per hour, your annual income amounts to ${formatCurrency(salaries.yearly)}. This calculation is based on working 40 hours per week for 52 weeks a year (2,080 hours total). Knowing your yearly salary helps you set savings goals, plan for taxes, and budget effectively for the year ahead.`
            },
            monthly: {
                title: `How much is $${displayRate} an hour monthly?`,
                content: `At $${displayRate} per hour, your monthly income will total approximately ${formatCurrency(salaries.monthly)}. This calculation assumes an average of 173.33 working hours per month (40 hours × 52 weeks ÷ 12 months). Your actual monthly pay may vary slightly based on the number of working days in each month.`
            },
            biweekly: {
                title: `How much is $${displayRate} an hour bi-weekly?`,
                content: `When earning $${displayRate} per hour, your bi-weekly paycheck totals ${formatCurrency(salaries.biweekly)}. This is calculated by multiplying your hourly wage by 80 hours (two 40-hour work weeks). Bi-weekly pay periods are common for many employers and help with consistent budgeting.`
            },
            weekly: {
                title: `How much is $${displayRate} an hour weekly?`,
                content: `At $${displayRate} per hour, your weekly paycheck totals ${formatCurrency(salaries.weekly)}. This is based on a standard 40-hour work week. Understanding your weekly income helps you manage week-to-week expenses and short-term savings goals.`
            },
            daily: {
                title: `How much is $${displayRate} an hour daily?`,
                content: `If you earn $${displayRate} per hour, your daily income is ${formatCurrency(salaries.daily)}. This assumes a standard 8-hour workday. Your daily wage is useful for calculating the value of overtime, time off, or comparing different work arrangements.`
            }
        }
    };
};

// Get Jooble job search URL for a rate
const getJoobleUrl = (rate) => {
    return `https://jooble.org/jobs-${rate}-per-hour`;
};

module.exports = {
    calculateSalaries,
    calculateHourlyFromYearly,
    formatCurrency,
    hourlyRates,
    getRelatedRates,
    getSEOContent,
    getJoobleUrl
};
