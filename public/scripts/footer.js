document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.querySelector('.copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    
});