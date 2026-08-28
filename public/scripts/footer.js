document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.querySelector('.copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    
});

// Replace with your Apps Script Web App URL
const NEWSLETTER_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwm5g9NeuMmxPBKubTrd2TNfyQC8-jG5ajb99KfqPkHhzRC-xhEfd4uk6HaeqAB1yvP/exec';
const newsletterForm = document.getElementById('newsletterForm');

newsletterForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // 1. Fetch IP Address
    let userIp = 'Unknown';
    try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        userIp = ipData.ip;
    } catch (err) {
        console.warn('IP fetch failed:', err);
    }

    // 2. Build Payload with Form Input & Telemetry
    const payload = {
        emailAddress: document.getElementById('newsletter1').value,
        ipAddress: userIp,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        cpuCores: navigator.hardwareConcurrency || 'N/A',
        deviceMemory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'N/A',
        language: navigator.language || 'N/A',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'N/A',
        touchSupport: (navigator.maxTouchPoints > 0) ? 'Yes' : 'No',
        connectionType: navigator.connection ? navigator.connection.effectiveType : 'N/A',
        userAgent: navigator.userAgent
    };

    // 3. Send Payload to Google Apps Script
    try {
        await fetch(NEWSLETTER_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload)
        });

        // 4. Log GA4 conversion event (if GA4 is installed on the page)
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'join_newsletter', {
                'event_category': 'Engagement',
                'event_label': 'Newsletter Subscription'
            });
        }

        alert('Thank you for subscribing!');
        newsletterForm.reset();
    } catch (error) {
        console.error('Subscription error:', error);
        alert('There was an issue processing your subscription. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Subscribe';
    }
});