const button = document.getElementById('btn');
const recipeName = document.getElementById('recipe-name');
const imageElement = document.getElementById('filler-picture');
const ingredientList = document.getElementById('ingredients');
const instructionContent = document.getElementById('instructions');
const videoLink = document.getElementById('video');
const searchHistoryList = document.getElementById('search-history');

button.addEventListener('click', getRecipe);

function saveSearchToLocalStorage(searchData) {
  let searches = [];
  const storedSearches = localStorage.getItem('searches');

  if (storedSearches) {
    searches = JSON.parse(storedSearches);
  }

  searches.push(searchData);

  if (searches.length > 5) {
    searches.shift();
  }

  localStorage.setItem('searches', JSON.stringify(searches));
}

function retrieveSearchFromLocalStorage() {
  const storedSearches = localStorage.getItem('searches');
  if (storedSearches) {
    return JSON.parse(storedSearches);
  }
  return [];
}

function updateSearchHistory() {
  searchHistoryList.innerHTML = '';
  const searches = retrieveSearchFromLocalStorage();
  searches.forEach(search => {
    const listItem = document.createElement('li');
    listItem.textContent = search.strMeal;
    listItem.addEventListener('click', () => {
      displaySearch(search);
    });
    searchHistoryList.appendChild(listItem);
  });
}

function displaySearch(search) {
  recipeName.innerText = search.strMeal;
  imageElement.src = search.strMealThumb;
  ingredientList.innerHTML = '';
  instructionContent.innerText = '';

  Object.keys(search).forEach(key => {
    if (key.startsWith("strIngredient")) {
      const ingredientNumber = key.slice(13);
      const measurementKey = `strMeasure${ingredientNumber}`;

      if (search[key] && search[measurementKey]) {
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

window.addEventListener('load', () => {
  updateSearchHistory();
});

function getRecipe() {
  recipeName.innerText = '';
  imageElement.src = '';
  ingredientList.innerText = '';
  instructionContent.innerText = '';

  fetch('https://helpful-highway.onrender.com/http://www.themealdb.com/api/json/v1/1/random.php')
    .then(response => response.json())
    .then(data => {
      const mealArr = data.meals[0];

      saveSearchToLocalStorage(mealArr);
      updateSearchHistory();

      recipeName.innerText = mealArr.strMeal;
      const foodImg = mealArr.strMealThumb;
      imageElement.src = foodImg;

      Object.keys(mealArr).forEach(key => {
        if (key.startsWith("strIngredient")) {
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
