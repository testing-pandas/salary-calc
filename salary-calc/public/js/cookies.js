// Cookie consent management
const COOKIE_CONSENT_KEY = 'cookie_consent';

// Get saved consent
const getConsent = () => {
    try {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        return consent ? JSON.parse(consent) : null;
    } catch {
        return null;
    }
};

// Save consent
const saveConsent = (consent) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
        ...consent,
        timestamp: new Date().toISOString()
    }));
};

// Show/hide banner
const showBanner = () => {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.add('visible');
};

const hideBanner = () => {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.remove('visible');
};

// Show/hide modal
const showModal = () => {
    const modal = document.getElementById('cookieSettingsModal');
    if (modal) modal.classList.add('visible');
};

const hideModal = () => {
    const modal = document.getElementById('cookieSettingsModal');
    if (modal) modal.classList.remove('visible');
};

// Accept all cookies
const acceptAll = () => {
    saveConsent({
        essential: true,
        analytics: true,
        functional: true,
        accepted: true
    });
    hideBanner();
    hideModal();
};

// Accept essential only
const acceptEssentialOnly = () => {
    saveConsent({
        essential: true,
        analytics: false,
        functional: false,
        accepted: true
    });
    hideBanner();
    hideModal();
};

// Save custom settings
const saveCustomSettings = () => {
    const analytics = document.getElementById('analyticsToggle')?.checked || false;
    const functional = document.getElementById('functionalToggle')?.checked || false;

    saveConsent({
        essential: true,
        analytics,
        functional,
        accepted: true
    });
    hideBanner();
    hideModal();
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const consent = getConsent();

    // Show banner if no consent
    if (!consent || !consent.accepted) {
        setTimeout(showBanner, 1000);
    }

    // Event listeners
    document.getElementById('cookieAccept')?.addEventListener('click', acceptAll);
    document.getElementById('cookieSettings')?.addEventListener('click', showModal);
    document.getElementById('modalClose')?.addEventListener('click', hideModal);
    document.getElementById('modalBackdrop')?.addEventListener('click', hideModal);
    document.getElementById('rejectNonEssential')?.addEventListener('click', acceptEssentialOnly);
    document.getElementById('saveSettings')?.addEventListener('click', saveCustomSettings);

    // Load saved preferences into modal
    if (consent) {
        const analyticsToggle = document.getElementById('analyticsToggle');
        const functionalToggle = document.getElementById('functionalToggle');
        if (analyticsToggle) analyticsToggle.checked = consent.analytics !== false;
        if (functionalToggle) functionalToggle.checked = consent.functional !== false;
    }
});
