function validateRecipeForm() {
    var name = document.getElementById("recipe-name").value;
    if (name == null || name.trim() == "") {
        document.getElementById("nameError").innerHTML = "Title is required";
        return false;
    } else {
        document.getElementById("nameError").innerHTML = "";
    }

    var ingredients = document.getElementById("recipe-ingredients").value;
    if (ingredients == null || ingredients.trim() == "") {
        document.getElementById("ingredientsError").innerHTML = "Ingredients are required";
        return false;
    } else {
        document.getElementById("ingredientsError").innerHTML = "";
    }

    var instructions = document.getElementById("recipe-instructions").value;
    if (instructions == null || instructions.trim() == "") {
        document.getElementById("instructionsError").innerHTML = "Instructions are required";
        return false;
    } else {
        document.getElementById("instructionsError").innerHTML = "";
    }

    var cookTime = document.getElementById("recipe-cooktime").value;
    if (cookTime == null || cookTime.trim() == "") {
        document.getElementById("timeError").innerHTML = "Cooking time is required";
        return false;
    } else {
        document.getElementById("timeError").innerHTML = "";
    }

    var servings = document.getElementById("recipe-servings").value;
    if (servings == null || servings.trim() == "") {
        document.getElementById("servingsError").innerHTML = "Serving size is required";
        return false;
    } else {
        document.getElementById("servingsError").innerHTML = "";
    }

    return true; 
}


function displayRecipes() {
    fetch('/recipes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('recipes-tbody');
            if (tableBody) {
                tableBody.innerHTML = ''; 
                
                data.forEach(recipe => {
                    const row = `
                        <tr>
                            <td>${recipe.rcp_title || ''}</td>
                            <td>${recipe.rcp_author || ''}</td>
                            <td>${(recipe.rcp_ingredients || '').replace(/\n/g, '<br>')}</td>
                            <td>${(recipe.rcp_instructions || '').replace(/\n/g, '<br>')}</td>
                            <td>${recipe.rcp_cooktime || ''}</td>
                            <td>${recipe.rcp_servings || ''}</td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            }
        })
        .catch(error => {
            console.error('Error loading recipes:', error);
            const tableBody = document.getElementById('recipes-tbody');
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="error-message">
                            Error loading recipes. Please try again later.
                        </td>
                    </tr>`;
            }
        });
}

function filterRecipes() {
    const input = document.getElementById("search-box");
    if (!input) return; 
    
    const filter = input.value.toLowerCase();
    const table = document.getElementById("recipes-table");
    if (!table) return;
    
    const tr = table.getElementsByTagName("tr");
    let hasResults = false;

    for (let i = 1; i < tr.length; i++) {
        const tds = tr[i].getElementsByTagName("td");
        let rowText = '';
        
        for (let j = 0; j < tds.length; j++) {
            rowText += tds[j].textContent || tds[j].innerText;
        }
        
        if (rowText.toLowerCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
            hasResults = true;
        } else {
            tr[i].style.display = "none";
        }
    }

    const noResults = document.getElementById("no-results");
    if (noResults) {
        noResults.style.display = hasResults || filter === "" ? "none" : "block";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const adminBtn = document.getElementById('admin-login-btn');
    if (adminBtn) {
        adminBtn.addEventListener('click', function() {
            const formDiv = document.getElementById('admin-form');
            if (formDiv) {
                formDiv.style.display = formDiv.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    const recipesTable = document.getElementById('recipes-table');
    if (recipesTable) {
        displayRecipes();
        
        const searchBox = document.getElementById('search-box');
        if (searchBox) {
            searchBox.addEventListener('input', filterRecipes);
        }
    }
});