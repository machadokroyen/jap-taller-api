// al cargarse el contenido del DOM, se cargan las funciones
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form"); // nombramos "form" al formulario
    const list = document.getElementById("list"); // nombramos "list" al div que contendrá la listas de recetas

    // agregamos un evento al formulario, al apretar el botón de "Buscar Recetas", se ejecutará la siguiente función
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const ingredients = document.getElementById("ingredients").value; // nombramos "ingredients" al texto ingresado en el input (se supone debe ser un ingrediente)

        // llamamos a la función que busca recetas con ese ingrediente
        searchRecipesWithIngredient(ingredients);
    });

    // definimos la función llamada en la línea 12
    // traducción: buscar recetas con ingrediente = search recipes with ingredient
    function searchRecipesWithIngredient(ingredients) {
        // con el ingrediente ingresado formamos la URL para filtrar y traer la información de la API 
        const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                // muestra las meals (comidas) en la página
                displayRecipes(data.meals);
            })
            .catch((error) => {
                console.error("Error al buscar recetas:", error);
            });
    }

    // definimos la función llamada en la línea 25 
    /* se llama así porque en un principio iba a mostrar las recetas, pero al final decidí mostrar el solo el nombre de la comida y una imagen */
    function displayRecipes(recipes) {
        // limpia el div, para mostrar solo las recetas que podemos preparar con el nuevo ingrediente 
        list.innerHTML = "";

        if (recipes) {
            recipes.forEach((recipe) => {
                // crea un div que contendrá a cada comida y se le agrega la clase "contenedor"
                const divContenedor = document.createElement("div");
                divContenedor.classList.add("contenedor");

                // crea un párrafo llamado "name" y su contenido será el nombre de los platos
                const name = document.createElement("p");
                name.textContent = recipe.strMeal;

                // agregamos el nombre al contenedor
                divContenedor.appendChild(name);

                // función definida en la linea 65
                getRecipeDetails(recipe.idMeal, divContenedor);

                // agrega el contenedor a la lista de recetas
                list.appendChild(divContenedor);
            });
        } else {
            // si no se encuentran recetas con ese ingrediente, se mostrará el siguiente texto
            list.textContent = "No se encontraron recetas con esos ingredientes.";
        }
    }

    // traducción: get recipe details = obtener detalles de la receta
    /* función que recibe dos parámetos el ID de la comida y el contenedor */
    function getRecipeDetails(recipeId, divContenedor) {
        // se crea URL con la ID de la comida para obtener información de la misma
        const detUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`;

        fetch(detUrl)
            .then((response) => response.json())
            .then((data) => {
                // obtiene la URL de la imagen de la comida
                const imageUrl = data.meals[0].strMealThumb;

                // crea una imagen, le asigna la URL y le agrega una descripción por si la imagen no carga
                const recipeImage = document.createElement("img");
                recipeImage.src = imageUrl;
                recipeImage.alt = `Imagen de la receta ${data.meals[0].strMeal}`;

                // agrega la imagen de la receta al contenedor
                divContenedor.appendChild(recipeImage);
            })
            .catch((error) => {
                // texto que se muestra si ocurre algún error al cargar las recetas
                console.error("Error al obtener detalles de la receta:", error);
            });
    }
});