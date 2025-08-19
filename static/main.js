const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const quoteSource = document.getElementById('quote-source');
const quoteFooter = document.getElementById('quote-footer');
const newQuoteBtn = document.getElementById('new-quote-btn');
const quoteCard = document.getElementById('quote-card');

// Fonction de nettoyage ultime
function fixText(text) {
  if (!text) return '';
  
  return text
    .replace(/\s+/g, ' ')           // Espaces multiples → 1 espace
    .replace(/\u00A0/g, ' ')        // Espaces insécables
    .replace(/\u2000-\u200F/g, ' ') // Espaces Unicode
    .replace(/\u2028-\u2029/g, ' ') // Séparateurs de ligne
    .trim();
}

newQuoteBtn.addEventListener('click', function() {
  // État de chargement
  newQuoteBtn.classList.add('loading');
  newQuoteBtn.textContent = '⏳ Chargement...';

  fetch('/api/citation')
    .then(response => response.json())
    .then(data => {
      // Supprime l'animation précédente
      quoteCard.classList.remove('fade-in');
      
      // Pause courte pour le changement
      setTimeout(() => {
        // Nettoyage et affichage
        const cleanQuote = fixText(data.quote);
        const cleanCharacter = fixText(data.character);
        const cleanAnime = fixText(data.anime);
        
        // Mise à jour directe sans formatage complexe
        quoteText.innerHTML = '« ' + cleanQuote + ' »';
        quoteAuthor.textContent = cleanCharacter;
        quoteSource.textContent = cleanAnime;
        
        // Affichage
        quoteFooter.style.display = 'block';
        quoteCard.classList.add('fade-in');
        
        // Restaurer le bouton
        newQuoteBtn.classList.remove('loading');
        newQuoteBtn.textContent = '✨ Nouvelle Citation';
      }, 50);
    })
    .catch(error => {
      quoteText.textContent = "Erreur lors du chargement...";
      quoteFooter.style.display = 'none';
      newQuoteBtn.classList.remove('loading');
      newQuoteBtn.textContent = '✨ Nouvelle Citation';
    });
});

// Nettoyage au chargement initial
window.addEventListener('load', function() {
  if (quoteText.textContent) {
    const currentText = quoteText.textContent.replace(/[«»]/g, '').trim();
    quoteText.innerHTML = '« ' + fixText(currentText) + ' »';
  }
  if (quoteAuthor.textContent) {
    quoteAuthor.textContent = fixText(quoteAuthor.textContent);
  }
  if (quoteSource.textContent) {
    quoteSource.textContent = fixText(quoteSource.textContent);
  }
});