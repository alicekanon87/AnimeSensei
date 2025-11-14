// Configuration
const CONFIG = {
    csvUrl: 'data/Anime_Sensei_data.csv', // Chemin vers votre fichier CSV
    itemsToDisplay: 8, // Nombre d'animés à afficher
    maxGenres: 3, // Nombre maximum de genres à afficher
    fallbackImage: 'https://via.placeholder.com/300x400/000053/ffffff?text=Image+Non+Disponible'
};

// Structure de mapping des colonnes CSV vers les propriétés d'affichage
const COLUMN_MAPPING = {
    // Colonne CSV -> Propriété d'affichage
    'id': 'id',
    'title': 'title',
    'alternative_titles_en': 'englishTitle',
    'main_picture_large': 'image',
    'main_picture_medium': 'imageMedium', 
    'mean': 'rating',
    'genres': 'genres',
    'num_episodes': 'episodes',
    'start_season_year': 'year',
    'studio_names': 'studio',
    'popularity': 'popularity',
    'rank': 'rank',
    'synopsis': 'synopsis',
    'media_type': 'type',
    'status': 'status'
};

// Cache des données
let animeDatabase = [];
let isDataLoaded = false;

// Navigation mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

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

// Chargement des données
async function loadAnimeData() {
    try {
        showLoadingState();
        
        // Simulation de chargement depuis CSV
        // En production, remplacez par un vrai appel API/CSV
        await simulateCSVLoad();
        
        isDataLoaded = true;
        displayPopularAnimes();
        
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        showError("Impossible de charger les données des animés");
    }
}

// Simulation de chargement CSV (à remplacer par votre vrai chargement)
async function simulateCSVLoad() {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Données simulées basées sur votre structure
            animeDatabase = [
                {
                    id: 52991,
                    title: "Sousou no Frieren",
                    alternative_titles_en: "Frieren: Beyond Journey's End",
                    main_picture_large: "https://cdn.myanimelist.net/images/anime/1015/138006l.webp",
                    main_picture_medium: "https://cdn.myanimelist.net/images/anime/1015/138006.webp",
                    mean: 9.29,
                    genres: ["Adventure", "Drama", "Fantasy", "Shounen"],
                    num_episodes: 28,
                    start_season_year: 2023,
                    studio_names: ["Madhouse"],
                    popularity: 127,
                    rank: 1,
                    synopsis: "During their decade-long quest to defeat the Demon King...",
                    media_type: "tv",
                    status: "finished_airing"
                },
                {
                    id: 5114,
                    title: "Fullmetal Alchemist: Brotherhood",
                    alternative_titles_en: "Fullmetal Alchemist: Brotherhood",
                    main_picture_large: "https://cdn.myanimelist.net/images/anime/1208/94745l.jpg",
                    main_picture_medium: "https://cdn.myanimelist.net/images/anime/1208/94745.jpg",
                    mean: 9.1,
                    genres: ["Action", "Adventure", "Drama", "Fantasy", "Military", "Shounen"],
                    num_episodes: 64,
                    start_season_year: 2009,
                    studio_names: ["Bones"],
                    popularity: 3,
                    rank: 2,
                    synopsis: "After a horrific alchemy experiment goes wrong...",
                    media_type: "tv",
                    status: "finished_airing"
                },
                {
                    id: 9253,
                    title: "Steins;Gate",
                    alternative_titles_en: "Steins;Gate",
                    main_picture_large: "https://cdn.myanimelist.net/images/anime/1935/127974l.webp",
                    main_picture_medium: "https://cdn.myanimelist.net/images/anime/1935/127974.webp",
                    mean: 9.07,
                    genres: ["Drama", "Psychological", "Sci-Fi", "Suspense", "Time Travel"],
                    num_episodes: 24,
                    start_season_year: 2011,
                    studio_names: ["White Fox"],
                    popularity: 14,
                    rank: 3,
                    synopsis: "Eccentric scientist Rintarou Okabe has a never-ending thirst...",
                    media_type: "tv",
                    status: "finished_airing"
                }
            ];
            resolve();
        }, 1000);
    });
}

// Fonction générique pour formater les données d'un anime
function formatAnimeData(animeRaw) {
    return {
        id: getProperty(animeRaw, 'id'),
        title: getProperty(animeRaw, 'alternative_titles_en') || getProperty(animeRaw, 'title'),
        image: getProperty(animeRaw, 'main_picture_large') || getProperty(animeRaw, 'main_picture_medium'),
        rating: parseFloat(getProperty(animeRaw, 'mean')) || 0,
        genres: Array.isArray(getProperty(animeRaw, 'genres')) ? 
                getProperty(animeRaw, 'genres') : 
                (getProperty(animeRaw, 'genres') || '').split(',').map(g => g.trim()),
        episodes: parseInt(getProperty(animeRaw, 'num_episodes')) || 0,
        year: getProperty(animeRaw, 'start_season_year') || 'N/A',
        studio: Array.isArray(getProperty(animeRaw, 'studio_names')) ? 
                getProperty(animeRaw, 'studio_names')[0] : 
                (getProperty(animeRaw, 'studio_names') || 'Unknown Studio'),
        popularity: parseInt(getProperty(animeRaw, 'popularity')) || 999,
        rank: parseInt(getProperty(animeRaw, 'rank')) || 999,
        synopsis: getProperty(animeRaw, 'synopsis') || '',
        type: getProperty(animeRaw, 'media_type') || 'unknown',
        status: getProperty(animeRaw, 'status') || 'unknown'
    };
}

// Fonction helper pour récupérer les propriétés de manière sécurisée
function getProperty(obj, key) {
    // Si la clé existe directement
    if (obj[key] !== undefined) return obj[key];
    
    // Si la clé existe dans le mapping
    const mappedKey = Object.keys(COLUMN_MAPPING).find(k => COLUMN_MAPPING[k] === key);
    if (mappedKey && obj[mappedKey] !== undefined) return obj[mappedKey];
    
    return undefined;
}

// Trouver un anime par ID
function findAnimeById(animeId) {
    return animeDatabase.find(anime => anime.id == animeId);
}

// Trouver un anime par titre (recherche approximative)
function findAnimeByTitle(title) {
    const searchTerm = title.toLowerCase();
    return animeDatabase.filter(anime => {
        const animeTitle = (getProperty(anime, 'alternative_titles_en') || getProperty(anime, 'title') || '').toLowerCase();
        return animeTitle.includes(searchTerm);
    });
}

// Afficher les animés populaires au chargement
function displayPopularAnimes() {
    if (!isDataLoaded || animeDatabase.length === 0) {
        showMessage("Chargement des données...");
        return;
    }
    
    const popularAnimes = animeDatabase
        .slice(0, CONFIG.itemsToDisplay)
        .map(formatAnimeData);
    
    renderAnimeGrid(popularAnimes);
}

// Afficher des recommandations basées sur un anime
function displaySimilarAnimes(baseAnimeId) {
    const baseAnime = findAnimeById(baseAnimeId);
    if (!baseAnime) {
        showError("Anime non trouvé");
        return;
    }
    
    const baseAnimeFormatted = formatAnimeData(baseAnime);
    const baseGenres = baseAnimeFormatted.genres;
    
    const similarAnimes = animeDatabase
        .filter(anime => anime.id != baseAnimeId)
        .map(anime => {
            const animeFormatted = formatAnimeData(anime);
            const commonGenres = animeFormatted.genres.filter(genre => 
                baseGenres.includes(genre)
            ).length;
            
            return {
                ...animeFormatted,
                similarity: commonGenres / Math.max(baseGenres.length, animeFormatted.genres.length)
            };
        })
        .filter(anime => anime.similarity > 0)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, CONFIG.itemsToDisplay)
        .map(anime => formatAnimeData(findAnimeById(anime.id)));
    
    renderAnimeGrid(similarAnimes, `Recommandations similaires à "${baseAnimeFormatted.title}"`);
}

// Rendu générique de la grille d'animés
function renderAnimeGrid(animes, title = "") {
    const recommendationGrid = document.querySelector('.recommendation-grid');
    
    if (!animes || animes.length === 0) {
        recommendationGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Aucun anime trouvé</h3>
                <p>Essayez avec une autre recherche</p>
            </div>
        `;
        return;
    }
    
    let titleHTML = '';
    if (title) {
        titleHTML = `
            <div class="recommendation-title">
                <p>${title}</p>
            </div>
        `;
    }
    
    recommendationGrid.innerHTML = titleHTML + animes.map(anime => `
        <div class="anime-card" data-anime-id="${anime.id}">
            <img src="${anime.image}" alt="${anime.title}" class="anime-img"
                 onerror="this.src='${CONFIG.fallbackImage}'">
            <div class="anime-info">
                <h3 class="anime-title">${anime.title}</h3>
                <div class="anime-meta">
                    <span class="anime-year">${anime.year}</span>
                    <span class="anime-episodes">${anime.episodes} épisodes</span>
                </div>
                <div class="anime-genres">
                    ${(anime.genres || []).slice(0, CONFIG.maxGenres)
                      .map(genre => `<span class="genre-tag">${genre}</span>`)
                      .join('')}
                </div>
                <div class="anime-details">
                    <div class="anime-rating">
                        <i class="fas fa-star"></i>
                        <span>${anime.rating.toFixed(1)}/10</span>
                    </div>
                    <div class="anime-studio">
                        <i class="fas fa-film"></i>
                        <span>${anime.studio}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Gestion de la recherche
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        displayPopularAnimes();
        return;
    }
    
    if (!isDataLoaded) {
        showMessage("Chargement des données en cours...");
        return;
    }
    
    showLoadingState();
    
    setTimeout(() => {
        const results = findAnimeByTitle(query);
        
        if (results.length > 0) {
            // Prendre le premier résultat et afficher des recommandations similaires
            const firstResult = results[0];
            displaySimilarAnimes(firstResult.id);
        } else {
            displayPopularAnimes();
            showMessage(`Aucun résultat pour "${query}". Voici nos recommandations populaires.`);
        }
        
        document.getElementById('recommendations').scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

// Fonctions d'interface utilisateur
function showLoadingState() {
    const recommendationGrid = document.querySelector('.recommendation-grid');
    recommendationGrid.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Analyse de vos préférences...</p>
        </div>
    `;
}

function showMessage(message) {
    console.log(message); // À remplacer par un système de notification visuel
}

function showError(message) {
    const recommendationGrid = document.querySelector('.recommendation-grid');
    recommendationGrid.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Erreur</h3>
            <p>${message}</p>
        </div>
    `;
}

// Gestion du formulaire de contact
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        console.log('Données du formulaire:', data);
        alert('Message envoyé avec succès! (simulation)');
        this.reset();
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadAnimeData();
    
    // Animation au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    const elementsToAnimate = document.querySelectorAll('.anime-card, .journal-entry, .plot');
    elementsToAnimate.forEach(el => observer.observe(el));
});

// CSS additionnel
const additionalCSS = `
    .anime-meta {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 0.8rem;
        color: var(--gray);
        font-family: 'Exo 2', sans-serif;
    }
    
    .anime-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
    }
    
    .anime-studio {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.8rem;
        color: var(--secondary);
        font-family: 'Exo 2', sans-serif;
    }
    
    .recommendation-title {
        grid-column: 1/-1;
        text-align: center;
        margin-bottom: 20px;
    }
    
    .recommendation-title p {
        color: var(--secondary);
        font-family: 'Orbitron', sans-serif;
        font-size: 1.1rem;
    }
    
    .loading, .no-results, .error-message {
        grid-column: 1/-1;
        text-align: center;
        padding: 50px;
        color: var(--secondary);
    }
    
    .loading i, .no-results i, .error-message i {
        font-size: 2rem;
        margin-bottom: 20px;
    }
`;

// Ajouter le CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);