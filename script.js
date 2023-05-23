const button = document.getElementById('btn');
const recipeName = document.getElementById('recipe-name');
const imageElement = document.getElementById('filler-picture');
const ingredientList = document.getElementById('ingredients');
const instructionContent = document.getElementById('instructions');
const videoLink = document.getElementById('video');
const searchHistoryList = document.getElementById('search-history');
const clearHistoryButton = document.getElementById('clear-history-btn');

button.addEventListener('click', getRecipe);
clearHistoryButton.addEventListener('click', clearSearchHistory);
window.addEventListener('load', updateSearchHistory);

// Save search to local storage
function saveSearchToLocalStorage(searchData) {
  const storedSearches = retrieveSearchFromLocalStorage(); //get search history in array
  storedSearches.push(searchData); //searchData represents current search, is pushed to stored searches array

  if (storedSearches.length > 10) { //will only hold up to 10 searches
    storedSearches.shift();
  }

  localStorage.setItem('searches', JSON.stringify(storedSearches));//array is converted to a JSON string and then stored in the local storage under the key 'searches'
}

// Retrieve search history from local storage
function retrieveSearchFromLocalStorage() {
  const storedSearches = localStorage.getItem('searches');//retrieve the stored value for the key 'searches'
  return storedSearches ? JSON.parse(storedSearches) : [];//if the stored value exists, it is parsed and returned as an array, if no stored value, return empty array
}

// Create a list item for search history
function createSearchHistoryItem(search) {
  const listItem = document.createElement('li'); //create li
  listItem.textContent = search.strMeal; //li content is recipe name
  listItem.addEventListener('click', () => { //add event listener to recipe 
    displaySearch(search); //when clicked, invoke display search item
  });
  return listItem; //return clicked recipe
}

// Update search history in the DOM
function updateSearchHistory() {
  searchHistoryList.innerHTML = ''; //clear history
  const searches = retrieveSearchFromLocalStorage(); //stored searches
  searches.forEach(search => {
    const listItem = createSearchHistoryItem(search); //history search items stored in variable
    searchHistoryList.appendChild(listItem); //append variable to search history list
  });
}

// Display search details in HTML
function displaySearch(search) {
  recipeName.innerText = search.strMeal;
  imageElement.src = search.strMealThumb;
  ingredientList.innerHTML = '';
  instructionContent.innerText = '';

  Object.keys(search).forEach(key => {
    if (key.startsWith('strIngredient')) { 
      const ingredientNumber = key.slice(13); //extracts the ingredient number by slicing the key from index 13, i.e. 'strIngredient1', the extracted ingredient number would be '1'
      const measurementKey = `strMeasure${ingredientNumber}`; //get ingredient

      if (search[key] && search[measurementKey]) { //checks if both the ingredient key and the measurement key have truthy values in the search object
        const ingredient = search[key];
        const measurement = search[measurementKey];

        const li = document.createElement('li');
        li.textContent = `${measurement} ${ingredient}`;
        ingredientList.appendChild(li);
      }
    }
  });
  const instructions = search.strInstructions.replace(/\r\n/g, '<br>');
  instructionContent.innerHTML = instructions;
  videoLink.innerHTML = `<a href=${search.strYoutube}>Click Here for Video Tutorial</a>`;
}

// Function to clear the search history
function clearSearchHistory() {
  localStorage.removeItem('searches');
  searchHistoryList.innerHTML = '';
}

// Fetch a random recipe
function getRecipe() {
  recipeName.innerText = '';
  imageElement.src = '';
  ingredientList.innerText = '';
  instructionContent.innerText = '';

  fetch('https://helpful-highway.onrender.com/http://www.themealdb.com/api/json/v1/1/random.php') //first http is for CORS followed by API call
    .then(response => response.json())
    .then(data => {
      const mealArr = data.meals[0];

      saveSearchToLocalStorage(mealArr);
      updateSearchHistory();

      recipeName.innerText = mealArr.strMeal;
      imageElement.src = mealArr.strMealThumb;

      //extracts the ingredient number and creates the measurement key based on each key in the mealArr object
      Object.keys(mealArr).forEach(key => { 
        if (key.startsWith('strIngredient')) {
          const ingredientNumber = key.slice(13);
          const measurementKey = `strMeasure${ingredientNumber}`;

          if (mealArr[key] && mealArr[measurementKey]) {
            const ingredient = mealArr[key];
            const measurement = mealArr[measurementKey];

            const li = document.createElement('li');
            li.textContent = `${measurement} ${ingredient}`;
            ingredientList.appendChild(li);
          }
        }
      });

      const instructions = mealArr.strInstructions.replace(/\r\n/g, '<br>');
      instructionContent.innerHTML = instructions;
      videoLink.innerHTML = `<a href=${mealArr.strYoutube}>Click Here for Video Tutorial</a>`;
    })
    .catch(err => console.error(err));
}