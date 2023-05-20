let button = document.getElementById('btn')

button.addEventListener('click', getRecipe)

function getRecipe(){
    fetch('https://rocky-peak-03610.herokuapp.com/http://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {

            const mealArr = data.meals[0]
            
            console.log(mealArr.strMeal) //name

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
