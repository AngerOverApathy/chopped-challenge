const button = document.getElementById('btn')
const recipeName = document.getElementById('recipe-name')
const imageElement = document.getElementById('picture');
const ingredientList  = document.getElementById('ingredients')
const instructionContent = document.getElementById('instructions')

const test = document.getElementById('test')

button.addEventListener('click', getRecipe)

function getRecipe(){

    recipeName.innerText=''
    imageElement.src = ''
    ingredientList.innerText=''
    instructionContent.innerText=''

    fetch('https://helpful-highway.onrender.com/http://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            const mealArr = data.meals[0]
            //recipe name
            recipeName.innerText = mealArr.strMeal 
            //food image
            const foodImg = mealArr.strMealThumb
            imageElement.src = foodImg // Update the src attribute with the new image URL

            //ingredient list w/ measurements
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


            //instructions with added number and spaces
            const instructions = mealArr.strInstructions.replace(/\r\n/g, '<br>');
            instructionContent.innerHTML = instructions;
        

            //let vidTutorial = mealArr.strYoutube //video tutorial

        })
        .catch(err => console.error(err));
}
