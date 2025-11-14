// Navigation mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Fermer le menu mobile en cliquant sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Animation au défilement
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Recherche d'animés (fonctionnalité de base)
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        // Ici, vous intégrerez l'appel à votre algorithme de recommandation
        alert(`Recherche de recommandations pour: ${query}`);
        // Faire défiler jusqu'à la section des recommandations
        document.getElementById('recommendations').scrollIntoView({ behavior: 'smooth' });
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});