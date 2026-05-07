const currentPath = window.location.pathname;

const links = document.querySelectorAll('.header__menu .header__button');

for (const link of links) {
    const url = new URL(link.href);
    if (url.pathname === currentPath) {
        link.classList.add('active');
    }
}
