document.addEventListener('DOMContentLoaded', function () {
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Hide the loading overlay once the page is fully loaded
    window.addEventListener('load', function () {
        loadingOverlay.style.display = 'none';
    });

    // Handle page transitions
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            loadingOverlay.style.display = 'flex';
            setTimeout(() => {
                window.location.href = this.href;
            }, 500); // Simulate loading delay
        });
    });
});