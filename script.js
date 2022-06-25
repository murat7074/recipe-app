const mealsEl = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals");
const mealPopup = document.getElementById("meal-popup");
const mealInfoEl = document.getElementById("meal-info");
const popupCloseBtn = document.getElementById("close-popup");

const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");

fetchFavMeals();

async function getMealById(id) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );

  const respData = await resp.json();
  const meal = respData.meals[0];

  return meal;
}

async function getMealsBySearch(search) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + search
  );

  const respData = await resp.json();
  const meals = respData.meals;

  return meals;
}

getMealsdeFault();

async function getMealsdeFault() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + "soup"
  );

  const respData = await resp.json();
  const meals = respData.meals.slice(0, 8);

  meals.forEach((meal) => {
    addMeal(meal);
  });
}

function addMeal(mealData) {
  console.log(mealData);

  const meal = document.createElement("div");
  meal.classList.add("meal");

  meal.innerHTML = `
        <div class="meal-header">
           
            <img
                src="${mealData.strMealThumb}"
                alt="${mealData.strMeal}"
            />
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
           
            <button class="info">
               <i class="fa fa-info"></i>
            </button>
             <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
            
        </div>
    `;

  const btn = meal.querySelector(".meal-body .fav-btn");

  btn.addEventListener("click", () => {
    addMealLS(mealData.idMeal);

    fetchFavMeals();
  });

  const info = meal.querySelector(".meal-body .info");
  info.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  mealsEl.appendChild(meal);
}

function addMealLS(ids) {
  const stored = getMealsLS();

  localStorage.setItem("mealIds", JSON.stringify([...stored, ids]));
}

function removeMealLS(idd) {
  const mealIds = getMealsLS();

  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((mealid) => mealid !== idd))
  );
}

function getMealsLS() {
  const stored = JSON.parse(localStorage.getItem("mealIds"));

  return stored === null ? [] : stored;
}


async function fetchFavMeals() {
  // clean the container
  favoriteContainer.innerHTML = "";

  const mealIds = getMealsLS();

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealById(mealId);

    addMealFav(meal);
  }
}

function addMealFav(mealData) {
  const favMeal = document.createElement("li");

  favMeal.innerHTML = `
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        /><span>${mealData.strMeal}</span>
        <button class="info">
               <i class="fa fa-info" aria-hidden="true"></i>
            </button>
        <button class="clear"><i class="fas fa-window-close"></i></button>
    `;

  const btn = favMeal.querySelector(".clear");

  btn.addEventListener("click", () => {
    removeMealLS(mealData.idMeal);

    fetchFavMeals();
  });

  const info = favMeal.querySelector(".info");
  info.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  favoriteContainer.appendChild(favMeal);
}


searchBtn.addEventListener("click", async () => {
  
  mealsEl.innerHTML = "";

  const search = searchTerm.value;
  const meals = await getMealsBySearch(search);

  if (meals) {
    meals.forEach((meal) => {
      addMeal(meal);
    });
  }
});

function showMealInfo(mealData) {
  
  mealInfoEl.innerHTML = "";

  
  const mealEl = document.createElement("div");

  const ingredients = [];

  // get ingredients and measures
  for (let i = 1; i <= 20; i++) {
    if (mealData["strIngredient" + i]) {
      ingredients.push(
        `${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`
      );
    } else {
      break;
    }
  }

  mealEl.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        />
        <p>
        ${mealData.strInstructions}
        </p>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients
              .map(
                (ing) => `
            <li>${ing}</li>
            `
              )
              .join("")}
        </ul>
        
    `;

  mealInfoEl.appendChild(mealEl);

  // show the popup
  mealPopup.classList.remove("hidden");
}

popupCloseBtn.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});
