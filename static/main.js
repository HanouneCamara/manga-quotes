const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const quoteSource = document.getElementById('quote-source');
const quoteFooter = document.getElementById('quote-footer');
const newQuoteBtn = document.getElementById('new-quote-btn');
const quoteCard = document.getElementById('quote-card');

// Fonction pour nettoyer le texte et éviter les espaces cassés
function cleanText(text) {
  if (!text) return '';
  
  return text
    .trim() // Supprime les espaces en début/fin
    .replace(/\s+/g, ' ') // Remplace les espaces multiples par un seul
    .replace(/\u00A0/g, ' ') // Remplace les espaces insécables
    .replace(/[\u2000-\u200B]/g, ' ') // Remplace les différents types d'espaces Unicode
    .replace(/\s+/g, ' ') // Double vérification
    .trim();
}

newQuoteBtn.addEventListener('click', function() {
  newQuoteBtn.classList.add('loading');
  newQuoteBtn.textContent = '⏳ Chargement...';

  fetch('/api/citation')
    .then(response => response.json())
    .then(data => {
      quoteCard.classList.remove('fade-in');
      
      setTimeout(() => {
        // Nettoyage approfondi des données
        const cleanQuote = cleanText(data.quote);
        const cleanCharacter = cleanText(data.character);
        const cleanAnime = cleanText(data.anime);
        
        // Mise à jour du DOM avec le texte nettoyé
        quoteText.textContent = `« ${cleanQuote} »`;
        quoteAuthor.textContent = cleanCharacter;
        quoteSource.textContent = cleanAnime;
        
        // Force un reflow pour s'assurer que le layout est correct
        quoteCard.offsetHeight;
        
        quoteFooter.style.display = 'block';
        quoteCard.classList.add('fade-in');
        newQuoteBtn.classList.remove('loading');
        newQuoteBtn.textContent = '✨ Nouvelle Citation';
      }, 100);
    })
    .catch(error => {
      console.error('Erreur:', error);
      quoteText.textContent = "Erreur lors du chargement...";
      quoteFooter.style.display = 'none';
      newQuoteBtn.classList.remove('loading');
      newQuoteBtn.textContent = '✨ Nouvelle Citation';
    });
});

// Ajout d'un événement pour nettoyer le texte initial au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  if (quoteText.textContent) {
    const initialText = quoteText.textContent.replace(/[«»]/g, '').trim();
    const cleanedText = cleanText(initialText);
    quoteText.textContent = `« ${cleanedText} »`;
  }
  
  if (quoteAuthor.textContent) {
    quoteAuthor.textContent = cleanText(quoteAuthor.textContent);
  }
  
  if (quoteSource.textContent) {
    quoteSource.textContent = cleanText(quoteSource.textContent);
  }
});