let button = document.getElementById('btn')
let recipeName = document.getElementById('recipe-name')

button.addEventListener('click', getRecipe)

function getRecipe(){
    fetch('https://rocky-peak-03610.herokuapp.com/http://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {

            const mealArr = data.meals[0]

            recipeName.innerText = mealArr.strMeal //name
            console.log(mealArr.strInstructions)//instructions

            let foodImg = mealArr.strMealThumb //food image
            console.log(foodImg)

            let vidTutorial = mealArr.strYoutube //video tutorial

            //get each ingredient from object properties
            Object.keys(mealArr).forEach(key => {
                if (key.startsWith("strIngredient")) {
                  const ingredient = mealArr[key];
                  if (ingredient && ingredient.trim() !== "") {
                    console.log(ingredient);
                  }
                }
              })

        })
        .catch(err => console.error(err));
}
