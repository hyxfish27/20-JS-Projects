const container = document.querySelector('#container');
const quoteContainer = document.querySelector('#quote-container');
const quoteText = document.querySelector('#quote');
const authorText = document.querySelector('#author');
const twitterBtn = document.querySelector('#twitter');
const favoritedBtn = document.querySelector('.fav-button');
const showFavorteBtn = document.querySelector('#show-favorite');
const favoriteContainer = document.querySelector('.favorite-container');
const newQuoteBtn = document.querySelector('#new-quote');
const loader = document.querySelector('#loader');


let apiQuotes = [];
let tempQuote = "";


//Show Loading
function loading() {
    loader.hidden = false;
    quoteContainer.hidden = true;
    showFavorteBtn.hidden = true;
}

//Hide Loading
function complete() {
    loader.hidden = true;
    quoteContainer.hidden = false;
    showFavorteBtn.hidden = false;
}

// Show New Quote 
function newQuote() {
    loading();
    // Pick a random quote from apiQuotes array
    index = Math.floor(Math.random() * apiQuotes.length);
    const quote = apiQuotes[index];
    // Check if Author field is blank and replace it with 'Unkown'
    if (!quote.author) {
        authorText.textContent = 'Unkown';
    } else {
        authorText.textContent = quote.author;
    }
    // Check Quote length to determine styling
    if (quote.text.length > 80) {
        quoteText.classList.add('long-quote');
    } else {
        quoteText.classList.remove('long-quote');
    }
    // Set Quote, Hide Loader
    quoteText.textContent = quote.text;
    complete();
}

// Get Quotes from API
async function getQuotes() {
    loading();
    const apiURL = 'https://type.fit/api/quotes';
    try {
        const response = await fetch(apiURL);
        apiQuotes = await response.json();
        newQuote();
    } catch (error) {
        // Catch Error Here
    }
    complete();
}

// Get Favorite Qoutes from LocalStorage
function getFavorites() {
    tempQuote = JSON.parse(localStorage.getItem('liked_quote')) || [];
    let template = ''
    tempQuote.forEach(quote => {
        template +=
            `<div class="fav-list">
                <button class="remove-btn" data-id=${quote.time}>
                <i class="fa-solid fa-x"></i>
                </button>
                <p class="favorite-content">${quote.text} -- [ ${quote.author} ]</p>
            </div>`;

    })
    favoriteContainer.innerHTML = template;
    const removeBtn = document.querySelectorAll('.remove-btn');
    removeBtn.forEach(btn => {
        btn.addEventListener('click', function () {
            let target = parseInt(btn.dataset.id);
            removeFavorite(target);
        });
    })
}

// Show Favorite Quotes
function showFavorite() {
    if (favoriteContainer.classList.contains('hidden')) {
        favoriteContainer.classList.remove('hidden')
    } else {
        favoriteContainer.classList.add('hidden')
    }
}

function removeFavorite(id) {
    let index = tempQuote.findIndex(temp => temp.time === id);
    tempQuote.splice(index, 1);
    localStorage.setItem('liked_quote', JSON.stringify(tempQuote));
    getFavorites();
}

function addFavorite(quote){
    tempQuote.push(quote)
    favoritedBtn.classList.add('liked')
}

function toggleFavorite() {
    const time = new Date().getTime()
    const quote = {
        text: quoteText.innerText,
        author: authorText.innerText,
        time: time
    }
    let index = -1;

    if (tempQuote && !tempQuote.length) {
        tempQuote.push(quote)
    } else {
        tempQuote.forEach((temp, i) => {
            if (temp.text === quote.text) {
                index = i;
            }
        });
        index === -1 ? addFavorite(quote) : removeFavorite(index);
    }
    localStorage.setItem('liked_quote', JSON.stringify(tempQuote));
    getFavorites();

}

// Tweet Quote
function tweetQuote() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;
    window.open(twitterUrl, '_blank');
}

//Event Listeners
newQuoteBtn.addEventListener('click', newQuote);
twitterBtn.addEventListener('click', tweetQuote);
favoritedBtn.addEventListener('click', toggleFavorite);
showFavorteBtn.addEventListener('click', showFavorite);

// On Load
getQuotes();
getFavorites();

