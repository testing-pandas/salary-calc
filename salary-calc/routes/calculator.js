const express = require('express');
const router = express.Router();
const {
    calculateSalaries,
    calculateHourlyFromYearly,
    formatCurrency,
    hourlyRates,
    getRelatedRates,
    getSEOContent,
    getJoobleUrl
} = require('../data/rates');

// Home page
router.get('/', (req, res) => {
    const popularRates = [15, 18, 20, 22, 25, 28, 30, 35, 40, 45, 50];

    res.render('index', {
        title: 'Salary Calculator - Convert Hourly Wage to Annual Salary | SalaryCalc',
        metaDescription: 'Free salary calculator to convert hourly wages to yearly, monthly, weekly income. Calculate your annual salary from $10 to $100 per hour.',
        popularRates: popularRates.map(rate => ({
            rate,
            salaries: calculateSalaries(rate),
            url: `/salary-calculator/${rate}-dollar-per-hour/`
        })),
        allRates: hourlyRates,
        formatCurrency
    });
});

// About page (E-E-A-T)
router.get('/about/', (req, res) => {
    res.render('about', {
        title: 'About Us | SalaryCalc - Salary Calculator',
        metaDescription: 'Learn about SalaryCalc - our mission, expertise, and how we help workers understand their earning potential.'
    });
});

// Privacy Policy
router.get('/privacy-policy/', (req, res) => {
    res.render('privacy', {
        title: 'Privacy Policy | SalaryCalc',
        metaDescription: 'SalaryCalc privacy policy - how we collect, use, and protect your information.'
    });
});

// Cookie Policy (GDPR)
router.get('/cookie-policy/', (req, res) => {
    res.render('cookies', {
        title: 'Cookie Policy | SalaryCalc',
        metaDescription: 'SalaryCalc cookie policy - what cookies we use and how to manage them.'
    });
});

/**
 * Handle Salary Calculator Pages Dynamically
 * Patterns from CSV:
 * 1. :rate-dollar-per-hour (e.g. 30-dollar-per-hour)
 * 2. :amountk-a-year-is-how-much-an-hour (e.g. 80k-a-year-is-how-much-an-hour)
 * 3. :amount-dollars-per-year (e.g. 50000-dollars-per-year)
 * 4. :amount-dollars-per-month (e.g. 4000-dollars-per-month)
 * 5. :amount-a-week-is-how-much-a-year (e.g. 1500-a-week-is-how-much-a-year)
 */
router.get('/salary-calculator/:slug/', (req, res, next) => {
    const slug = req.params.slug;
    let hourlyRate = 0;
    let type = 'hourly';

    // 1. :rate-dollar-per-hour
    let match = slug.match(/^([\d.-]+)-dollar-per-hour$/);
    if (match) {
        hourlyRate = parseFloat(match[1]);
    }

    // 2. :amountk-a-year-is-how-much-an-hour
    if (!hourlyRate) {
        match = slug.match(/^(\d+)k-a-year-is-how-much-an-hour$/);
        if (match) {
            hourlyRate = calculateHourlyFromYearly(parseInt(match[1]) * 1000);
            type = 'yearly';
        }
    }

    // 3. :amount-dollars-per-year
    if (!hourlyRate) {
        match = slug.match(/^(\d+)-dollars-per-year$/);
        if (match) {
            hourlyRate = calculateHourlyFromYearly(parseInt(match[1]));
            type = 'yearly';
        }
    }

    // 4. :amount-dollars-per-month
    if (!hourlyRate) {
        match = slug.match(/^(\d+)-dollars-per-month$/);
        if (match) {
            hourlyRate = parseInt(match[1]) / 173.33;
        }
    }

    // 5. :amount-a-week-is-how-much-a-year
    if (!hourlyRate) {
        match = slug.match(/^(\d+)-a-week-is-how-much-a-year$/);
        if (match) {
            hourlyRate = (parseInt(match[1]) * 52) / 2080;
        }
    }

    // Fallback/Generic: handle other formats if needed
    if (!hourlyRate) {
        return next();
    }

    const salaries = calculateSalaries(hourlyRate);
    const seoContent = getSEOContent(hourlyRate, type);
    const relatedRates = getRelatedRates(hourlyRate);
    const joobleUrl = getJoobleUrl(Math.round(hourlyRate));

    const displayRate = hourlyRate % 1 === 0 ? hourlyRate : hourlyRate.toFixed(2);

    res.render('calculator', {
        rate: displayRate,
        salaries,
        seoContent,
        relatedRates,
        joobleUrl,
        formatCurrency,
        title: seoContent.title,
        metaDescription: seoContent.metaDescription
    });
});

// Redirect without trailing slash
router.get('/salary-calculator/:slug', (req, res) => {
    res.redirect(301, `/salary-calculator/${req.params.slug}/`);
});

module.exports = router;
