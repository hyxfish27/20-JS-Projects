const container = document.getElementById('container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const facebookBtn = document.getElementById('fb');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');


let apiQuotes = [];

//Show Loading
function loading() {
    loader.hidden = false;
    container.hidden = true;
}

//Hide Loading
function complete() {
    container.hidden = false;
    loader.hidden = true;
}

// Show New Quote 
function newQuote() {
    loading();
    // Pick a random quote from apiQuotes array
    index = Math.floor(Math.random() * apiQuotes.length);
    const quote = apiQuotes[index];
    //Check if Author field is blank and replace it with 'Unkown'
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
}

// Tweet Quote
function tweetQuote() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;
    window.open(twitterUrl, '_blank');
}

// window.fbAsyncInit = function () {
//     FB.init({
//         appId: '368639645085617',
//         autoLogAppEvents: true,
//         xfbml: true,
//         version: 'v13.0'
//     });
// };

// onclick="window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent('https://developers.facebook.com/docs/plugins/'),'facebook-share-dialog','width=626,height=436'); return false;"

// function fbShareQuote() {
//     FB.ui({
//         method: 'share',
//         href: 'https://developers.facebook.com/docs/',
//     }, function (response) { });
// }

//Event Listeners
newQuoteBtn.addEventListener('click', newQuote);
twitterBtn.addEventListener('click', tweetQuote);
facebookBtn.addEventListener('click', function () {
    let url = `https://www.facebook.com/sharer/sharer.php?u=`
    window.open(url, 'facebook-share-dialog', 'width=626,height=436');
    return false;
});

// On Load
getQuotes();
//newQuote();


