const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const quoteSource = document.getElementById('quote-source');
const quoteFooter = document.getElementById('quote-footer');
const newQuoteBtn = document.getElementById('new-quote-btn');
const quoteCard = document.getElementById('quote-card');

newQuoteBtn.addEventListener('click', function() {
  newQuoteBtn.classList.add('loading');
  newQuoteBtn.textContent = '⏳ Chargement...';

  fetch('/api/citation')
    .then(response => response.json())
    .then(data => {
      quoteCard.classList.remove('fade-in');
      setTimeout(() => {
        quoteText.textContent = `« ${data.quote} »`;
        quoteAuthor.textContent = data.character;
        quoteSource.textContent = data.anime;
        quoteFooter.style.display = 'block';
        quoteCard.classList.add('fade-in');
        newQuoteBtn.classList.remove('loading');
        newQuoteBtn.textContent = '✨ Nouvelle Citation';
      }, 100);
    })
    .catch(error => {
      quoteText.textContent = "Erreur lors du chargement...";
      quoteFooter.style.display = 'none';
      newQuoteBtn.classList.remove('loading');
      newQuoteBtn.textContent = '✨ Nouvelle Citation';
    });
});