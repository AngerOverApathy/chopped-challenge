const button = document.getElementById('btn')
const recipeName = document.getElementById('recipe-name')
const ingredientList  = document.getElementById('ingredients')
const instructionContent = document.getElementById('instructions')

button.addEventListener('click', getRecipe)

function getRecipe(){
    fetch('https://rocky-peak-03610.herokuapp.com/http://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {

            const mealArr = data.meals[0]

            recipeName.innerText = mealArr.strMeal //name

            const foodImg = mealArr.strMealThumb //food image
            console.log(foodImg)

            Object.keys(mealArr).forEach(key => {
                if (key.startsWith("strIngredient")) {
                  const ingredientNumber = key.slice(13); // Extract the ingredient number from the key
                  const measurementKey = `strMeasure${ingredientNumber}`;
              
                  if (mealArr[key] && mealArr[measurementKey]) {
                    const ingredient = mealArr[key];
                    const measurement = mealArr[measurementKey];
              
                    const li = document.createElement('li')
                    li.textContent = `${measurement} ${ingredient}`
                    ingredientList.appendChild(li);
                  }
                }
              });


            //instructions
            const instructions = mealArr.strInstructions
            instructionContent.textContent = instructions

            //let vidTutorial = mealArr.strYoutube //video tutorial

        })
        .catch(err => console.error(err));
}
