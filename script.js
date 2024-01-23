// Simplified element selection
const elements = {
  button: document.getElementById('btn'),
  recipeName: document.getElementById('recipe-name'),
  image: document.getElementById('filler-picture'),
  ingredients: document.getElementById('ingredients'),
  instructions: document.getElementById('instructions'),
  videoLink: document.getElementById('video'),
  historyList: document.getElementById('search-history'),
  clearButton: document.getElementById('clear-history-btn')
};

elements.button.addEventListener('click', fetchAndDisplayRecipe);
elements.clearButton.addEventListener('click', clearSearchHistory);
window.addEventListener('load', renderSearchHistory);

// Local Storage functions
function saveSearch(searchData) {
  const searches = getSearches();
  searches.push(searchData);
  if (searches.length > 15) searches.shift();
  localStorage.setItem('searches', JSON.stringify(searches));
}

function getSearches() {
  const searches = localStorage.getItem('searches');
  return searches ? JSON.parse(searches) : [];
}

// DOM manipulation functions
function createListItem(search) {
  const item = document.createElement('li');
  item.textContent = search.strMeal;
  item.addEventListener('click', () => displaySearchDetails(search));
  return item;
}

function renderSearchHistory() {
  elements.historyList.innerHTML = '';
  getSearches().forEach(search => elements.historyList.appendChild(createListItem(search)));
}

function displaySearchDetails(search) {
  const { strMeal, strMealThumb, strInstructions, strYoutube } = search;
  elements.recipeName.innerText = strMeal;
  elements.image.src = strMealThumb;
  elements.ingredients.innerHTML = formatIngredients(search);
  elements.instructions.innerHTML = strInstructions.replace(/\r\n/g, '<br>');
  elements.videoLink.innerHTML = `<a href=${strYoutube}>Click Here for Video Tutorial</a>`;
}

function formatIngredients(search) {
  return Object.keys(search)
    .filter(key => key.startsWith('strIngredient') && search[key])
    .map(key => {
      const measureKey = `strMeasure${key.slice(13)}`;
      return `<li>${search[measureKey]} ${search[key]}</li>`;
    })
    .join('');
}

// Fetch and display recipe
async function fetchAndDisplayRecipe() {
  try {
       // Show loading indicator
       document.getElementById('loading-indicator').style.display = 'block';

       const response = await fetch('https://helpful-highway.onrender.com/http://www.themealdb.com/api/json/v1/1/random.php');
       const { meals } = await response.json();
       saveSearch(meals[0]);
       renderSearchHistory();
       displaySearchDetails(meals[0]);
   
       // Hide loading indicator
       document.getElementById('loading-indicator').style.display = 'none';
  } catch (error) {
    console.error(error);
  }
}

// Clear search history
function clearSearchHistory() {
  localStorage.removeItem('searches');
  elements.historyList.innerHTML = '';
}
