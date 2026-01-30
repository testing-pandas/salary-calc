// Salary calculation utilities
const formatCurrency = (amount) => {
    return '$' + Math.round(amount).toLocaleString('en-US');
};

const calculateSalaries = (hourlyRate, hoursPerDay = 8, daysPerWeek = 5, weeksPerYear = 52) => {
    const hoursPerWeek = hoursPerDay * daysPerWeek;
    const hoursPerYear = hoursPerWeek * weeksPerYear;
    const monthlyHours = hoursPerYear / 12;

    return {
        daily: hourlyRate * hoursPerDay,
        weekly: hourlyRate * hoursPerWeek,
        biweekly: hourlyRate * hoursPerWeek * 2,
        monthly: hourlyRate * monthlyHours,
        yearly: hourlyRate * hoursPerYear
    };
};

// Update results display
const updateResults = (salaries, prefix = 'result') => {
    const elements = {
        daily: document.getElementById(`${prefix}Daily`),
        weekly: document.getElementById(`${prefix}Weekly`),
        biweekly: document.getElementById(`${prefix}Biweekly`),
        monthly: document.getElementById(`${prefix}Monthly`),
        yearly: document.getElementById(`${prefix}Yearly`)
    };

    if (elements.daily) elements.daily.textContent = formatCurrency(salaries.daily);
    if (elements.weekly) elements.weekly.textContent = formatCurrency(salaries.weekly);
    if (elements.biweekly) elements.biweekly.textContent = formatCurrency(salaries.biweekly);
    if (elements.monthly) elements.monthly.textContent = formatCurrency(salaries.monthly);
    if (elements.yearly) elements.yearly.textContent = formatCurrency(salaries.yearly);
};

// Home page quick calculator
const setupQuickCalculator = () => {
    const hourlyInput = document.getElementById('hourlyRate');
    const viewDetailedLink = document.getElementById('viewDetailedCalc');

    if (!hourlyInput) return;

    const updateQuickCalc = () => {
        const rate = parseFloat(hourlyInput.value) || 0;
        const salaries = calculateSalaries(rate);

        document.getElementById('dailyResult').textContent = formatCurrency(salaries.daily);
        document.getElementById('weeklyResult').textContent = formatCurrency(salaries.weekly);
        document.getElementById('monthlyResult').textContent = formatCurrency(salaries.monthly);
        document.getElementById('yearlyResult').textContent = formatCurrency(salaries.yearly);

        // Update view detailed link
        if (viewDetailedLink) {
            const roundedRate = Math.round(rate);
            viewDetailedLink.href = `/salary-calculator/${roundedRate}-dollar-per-hour/`;
        }
    };

    hourlyInput.addEventListener('input', updateQuickCalc);
    updateQuickCalc(); // Initial calculation
};

// Calculator page with settings
const setupDetailedCalculator = () => {
    const hourlyInput = document.getElementById('calcHourlyRate');
    const hoursPerDayInput = document.getElementById('hoursPerDay');
    const daysPerWeekInput = document.getElementById('daysPerWeek');
    const weeksPerYearInput = document.getElementById('weeksPerYear');

    if (!hourlyInput) return;

    const updateDetailedCalc = () => {
        const rate = parseFloat(hourlyInput.value) || 0;
        const hoursPerDay = parseFloat(hoursPerDayInput?.value) || 8;
        const daysPerWeek = parseFloat(daysPerWeekInput?.value) || 5;
        const weeksPerYear = parseFloat(weeksPerYearInput?.value) || 52;

        const salaries = calculateSalaries(rate, hoursPerDay, daysPerWeek, weeksPerYear);
        updateResults(salaries, 'result');
    };

    hourlyInput.addEventListener('input', updateDetailedCalc);
    hoursPerDayInput?.addEventListener('input', updateDetailedCalc);
    daysPerWeekInput?.addEventListener('input', updateDetailedCalc);
    weeksPerYearInput?.addEventListener('input', updateDetailedCalc);
};

// Mobile menu toggle
const setupMobileMenu = () => {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Handle dropdown clicks on mobile
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.dropdown-toggle');
        if (link) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    setupQuickCalculator();
    setupDetailedCalculator();
    setupMobileMenu();
});
