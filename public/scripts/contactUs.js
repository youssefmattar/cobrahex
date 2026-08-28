document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service-select');

    if (service) {
        const select = document.getElementById('serviceType');
        if(service <= 8 && service>=1 ){
            select.value = service;
            //select.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyw64I6jRXAWaUjMp8iJ1yc8JKpVUtICIHKTprlQwTjV8fw-RihhqlCCFb1zWGbg11Xow/exec';
const form = document.getElementById('inquiryForm');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
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

    // 2. Extract Inquiry Selection
    const selectElem = document.getElementById('serviceType');
    const selectedText = selectElem.options[selectElem.selectedIndex].text;

    // 3. Build Form & Browser Telemetry Payload
    const formData = {
        // Form Input Values
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        jobTitle: document.getElementById('jobTitle').value,
        companyName: document.getElementById('companyName').value,
        lineOfBusiness: document.getElementById('lineOfBusiness').value,
        emailAddress: document.getElementById('emailAddress').value,
        serviceType: selectedText,
        messageText: document.getElementById('messageText').value,

        // System & Browser Telemetry
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

    // 4. Send Payload to Apps Script
    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(formData)
        });

        alert('Thank you! Your inquiry has been submitted.');
        form.reset();
    } catch (error) {
        console.error('Submission error:', error);
        alert('There was an issue submitting your inquiry. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Inquiry';
    }
});


