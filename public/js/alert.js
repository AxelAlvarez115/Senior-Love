document.addEventListener('DOMContentLoaded', () => {
    const alerts = document.querySelectorAll('[data-alert]');
    
    alerts.forEach(alert => {
        // Fade out after 5 seconds
        setTimeout(() => {
            alert.classList.add('alert--fade');
            setTimeout(() => {
                alert.remove();
            }, 300); // match this with CSS transition time
        }, 5000);

        // Optional: Add click to dismiss
        alert.addEventListener('click', () => {
            alert.classList.add('alert--fade');
            setTimeout(() => {
                alert.remove();
            }, 300);
        });
    });
});