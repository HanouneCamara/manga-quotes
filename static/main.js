const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const quoteSource = document.getElementById('quote-source');
const quoteFooter = document.getElementById('quote-footer');
const newQuoteBtn = document.getElementById('new-quote-btn');
const quoteCard = document.getElementById('quote-card');

// Fonction de nettoyage du texte
function fixText(text) {
    if (!text) return '';
    return text
        .replace(/\s+/g, ' ')           // Espaces multiples → 1 espace
        .replace(/\u00A0/g, ' ')        // Espaces insécables
        .replace(/\u2000-\u200F/g, ' ') // Espaces Unicode
        .replace(/\u2028-\u2029/g, ' ') // Séparateurs de ligne
        .trim();
}

// Event listener pour le bouton
newQuoteBtn.addEventListener('click', function() {
    // État de chargement
    newQuoteBtn.classList.add('loading');
    newQuoteBtn.textContent = '⏳ Chargement...';
    quoteCard.classList.add('loading');

    // Appel à votre API Flask
    fetch('/api/citation')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Supprime l'animation précédente
            quoteCard.classList.remove('fade-in', 'loading');

            // Pause courte pour le changement
            setTimeout(() => {
                // Nettoyage et affichage
                const cleanQuote = fixText(data.quote);
                const cleanCharacter = fixText(data.character);
                const cleanAnime = fixText(data.anime);

                // Mise à jour du contenu
                quoteText.innerHTML = '« ' + cleanQuote + ' »';
                quoteAuthor.textContent = cleanCharacter;
                quoteSource.textContent = cleanAnime;

                // Affichage
                quoteFooter.style.display = 'flex';
                quoteCard.classList.add('fade-in');

                // Restaurer le bouton
                newQuoteBtn.classList.remove('loading');
                newQuoteBtn.textContent = '✨ Nouvelle Citation';
            }, 150);
        })
        .catch(error => {
            console.error('Erreur lors du chargement:', error);
            quoteCard.classList.remove('loading');

            // Affichage d'erreur avec style
            quoteText.innerHTML = '« Une erreur s\'est produite lors du chargement de la citation. »';
            quoteAuthor.textContent = 'Système';
            quoteSource.textContent = 'Erreur';
            quoteFooter.style.display = 'flex';

            // Restaurer le bouton
            newQuoteBtn.classList.remove('loading');
            newQuoteBtn.textContent = '🔄 Réessayer';
        });
});

// Nettoyage au chargement initial (pour les données du serveur)
window.addEventListener('load', function() {
    if (quoteAuthor.textContent && quoteAuthor.textContent.trim()) {
        // Il y a des données du serveur, on les nettoie
        const currentQuoteText = quoteText.textContent.replace(/[«»]/g, '').trim();
        if (
            currentQuoteText &&
            currentQuoteText !== "Cliquez sur le bouton pour découvrir une citation inspirante !"
        ) {
            quoteText.innerHTML = '« ' + fixText(currentQuoteText) + ' »';
            quoteAuthor.textContent = fixText(quoteAuthor.textContent);
            quoteSource.textContent = fixText(quoteSource.textContent);
            quoteFooter.style.display = 'flex';
        }
    }
});

// Optimisation pour les performances sur mobile
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

newQuoteBtn.addEventListener('mousedown', function() {
    newQuoteBtn.blur();
});