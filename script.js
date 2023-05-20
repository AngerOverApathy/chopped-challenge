let button = document.getElementById('btn')
let recipeName = document.getElementById('recipe-name')
let ingredientList  = document.getElementById('ingredients')

button.addEventListener('click', getRecipe)

function getRecipe(){
    fetch('https://rocky-peak-03610.herokuapp.com/http://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {

            const mealArr = data.meals[0]

            recipeName.innerText = mealArr.strMeal //name
            let foodImg = mealArr.strMealThumb //food image
            console.log(foodImg)
            console.log(mealArr.strInstructions)//instructions

            let vidTutorial = mealArr.strYoutube //video tutorial

            //get each ingredient from object properties and append to list in DOM
            Object.keys(mealArr).forEach(key => {
                if (key.startsWith("strIngredient")) {
                  const ingredient = mealArr[key];
                  if (ingredient && ingredient.trim() !== "") {
                    console.log(ingredient);

                    const li = document.createElement('li')
                    li.textContent = ingredient
                    ingredientList.appendChild(li)
                  }
                }
              })

        })
        .catch(err => console.error(err));
}
