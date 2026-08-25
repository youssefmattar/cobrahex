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