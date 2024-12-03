import { supabase } from './supabaseClient';

let enumValuesAllergies = [];
let enumValuesRecipeCategories = [];
let enumValuesIngredientCategories = [];

(async () => {
    try {
        var allergies = (await supabase.rpc('get_enum_values', {enum_name: 'allergy',})).data;

        var recipe_categories = (await supabase.rpc('get_enum_values', {enum_name: 'category',})).data;

        var ingredient_categories = (await supabase.rpc('get_enum_values', {enum_name: 'ingredient_category',})).data;

        enumValuesAllergies = allergies;

        enumValuesRecipeCategories = recipe_categories;

        enumValuesIngredientCategories = ingredient_categories;
    } catch (err) {
        console.log(err);
    }
    
})();

export const fetchAllergies = async () => {
    const {data, error} = supabase.rpc('get_enum_values', {enum_name: 'allergy',});
    if (error) {
        console.error('Error fetching allergies:', error)
        throw error;
    }
    return data;
}
export const fetchRecipeCategories = async () => {
    const {data, error} = supabase.rpc('get_enum_values', {enum_name: 'category',});
    if (error) {
        console.error('Error fetching allergies:', error)
        throw error;
    }
    return data;
}
export const fetchIngredientCategories = async () => {
    const {data, error} = supabase.rpc('get_enum_values', {enum_name: 'ingredient_category',});
    if (error) {
        console.error('Error fetching allergies:', error)
        throw error;
    }
    return data;
}

export const ALLERGIES = supabase.rpc('get_enum_values', {enum_name: 'allergy',}).then(({data, error}) => {
    if (error) {
        console.error('Error fetching allergies:', error)
        throw error;
    }
    return data;
})
export const RECIPE_CATEGORIES = supabase.rpc('get_enum_values', {enum_name: 'category',}).then(({data, error}) => {
    if (error) {
        console.error('Error fetching recipe categories:', error)
        throw error;
    }
    return data;
})
export const INGREDIENT_CATEGORIES = supabase.rpc('get_enum_values', {enum_name: 'ingredient_category',}).then(({data, error}) => {
    if (error) {
        console.error('Error fetching ingredient categories:', error)
        throw error;
    }
    return data;
})

/** Fetch all recipes with their associated ingredients and allergies */
export const fetchRecipes = async (procedureName = null, arg = null) => {
    try {
        if (procedureName) {
            if (arg) {
                const { data, error } = await supabase.rpc(procedureName, {allergies: arg});
                if (error) throw error;
                return data;
            } else {
                const { data, error } = await supabase.rpc(procedureName);
                if (error) throw error;
                return data;
            }
        } else {
            const { data, error } = await supabase.from('recipe').select('*');
            if (error) throw error;
            return data;
        }
    } catch (error) {
        console.error('Error fetching recipes:', error.message);
        throw error;
    }
};


export const fetchRecipeById = async (id) => {
    const { data, error } = await supabase
        .from('recipe')
        .select()
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Recipe with id ${id} not found.`);
        throw error;
    }

    return data;
}

/** Fetch details for a specific recipe, including its ingredients and allergies */
export const fetchRecipeDetails = async (id) => {
    const { data, error } = await supabase
        .from('recipe')
        .select(`
            id,
            name,
            link,
            serving_amount,
            category,
            recipe_contains_ingredient (ingredient_id, ingredient (name, calories, food_category)),
            recipe_contains_allergy (allergy)
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching recipe details:', error);
        throw error;
    }
    return data;
};

/** Add a new recipe with its ingredients and allergies */
export const addRecipe = async (recipe, ingredients, allergies) => {
    try {
        // Insert the recipe

        // If a recipe with the same name already exists, append numbers to the end 
        console.log(recipe.name);
        recipe.name = await appendNumberToName(recipe.name, 'recipe');
        console.log(recipe.name);

        recipe.link = addHttpsToLink(recipe.link);

        const { data: recipeData, error: recipeError } = await supabase
            .from('recipe')
            .insert([
                {
                    name: recipe.name,
                    link: recipe.link,
                    serving_amount: recipe.serving_amount,
                    category: recipe.category,
                },
            ])
            .select();

        if (recipeError) throw recipeError;

        const recipeId = recipeData[0].id;

        // Add ingredients to the recipe
        const ingredientRows = ingredients.map((ingredientId) => ({
            recipe_id: recipeId,
            ingredient_id: ingredientId,
        }));
        const { error: ingredientError } = await supabase
            .from('recipe_contains_ingredient')
            .insert(ingredientRows);

        if (ingredientError) throw ingredientError;

        // Add allergies to the recipe
        const allergyRows = allergies.map((allergy) => ({
            recipe_id: recipeId,
            allergy,
        }));
        const { error: allergyError } = await supabase
            .from('recipe_contains_allergy')
            .insert(allergyRows);

        if (allergyError) throw allergyError;

        return recipeData[0];
    } catch (error) {
        console.error('Error adding recipe:', error);
        throw error;
    }
};

export const updateRecipe = async (recipeId, updatedFields) => {
    const { data, error } = await supabase
        .from('recipe')
        .update(updatedFields)
        .eq('id', recipeId)
        .select();

    if (error) {
        console.error('Error updating recipe:', error);
        throw error;
    }

    return data;
};

/** Delete a recipe and its associated relationships */
export const deleteRecipe = async (id) => {
    try {
        // Delete the recipe itself
        const { error: recipeError } = await supabase
            .from('recipe')
            .delete()
            .eq('id', id);

        if (recipeError) throw recipeError;

        return { message: 'Recipe deleted successfully' };
    } catch (error) {
        console.error('Error deleting recipe:', error);
        throw error;
    }
};

/** Fetch all ingredients */
export const fetchIngredients = async () => {
    const { data, error } = await supabase
        .from('ingredient')
        .select('*');

    if (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
    }
    return data;
};

export const fetchIngredientsByRecipeId = async (recipeId) => {
    const { data, error } = await supabase
    .from('recipe_contains_ingredient')
    .select('ingredient (*)')
    .eq('recipe_id', recipeId);

    if (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
    }
    return data;
}

/** Add a new ingredient */
export const addIngredient = async (ingredient) => {
    var id = await checkIfSameNameExists(ingredient.name, 'ingredient');
    if (!id) { // No ingredient with the same name exists
        const { data, error } = await supabase
        .from('ingredient')
        .insert([
            {
                name: ingredient.name,
                amount: ingredient.amount,
                calories: ingredient.calories,
                food_category: ingredient.food_category,
            },
        ])
        .select();

        if (error) {
            console.error('Error adding ingredient:', error);
            throw error;
        }
        return data;
    } else { // Ingredient with same name already exists
        const { data, error } = await supabase
            .from('ingredient')
            .update(ingredient)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error adding ingredient:', error);
            throw error;
        }
        return data;
    }

};

export const addIngredientToRecipe = async (recipeId, ingredientId) => {
    const { error } = await supabase
        .from('recipe_contains_ingredient')
        .insert({recipe_id: recipeId, ingredient_id: ingredientId});

    if (error) {
        console.error('Error adding ingredient:', error);
        throw error;
    }
}

export const deleteIngredientFromRecipe = async (recipeId, ingredientId) => {
    const { error } = await supabase
        .from('recipe_contains_ingredient')
        .delete()
        .match({ recipe_id: recipeId, ingredient_id: ingredientId });

    if (error) {
        console.error('Error deleting ingredient:', error);
        throw error;
    }
};

// Check if an entry in `tablename` exists with column `name` equal to name.
const checkIfSameNameExists = async (name, tablename) => {
    try {
        const {data, error} = await supabase
            .from(tablename)
            .select('id')
            .eq('name', name);
        if (data.length > 0) {
            return data[0].id;
        }
        return false;
    } catch (err) {
        console.error('Error checking for same name:', err);
        return false;
    }
}

// Append #[number] to the end of the name until it is unique in the table.
const appendNumberToName = async(name, tablename) => {
    console.log(name);
    var id = await checkIfSameNameExists(name, tablename);
    if (!id) return name;

    const numRegex = /#[0123456789]*$/g; // Check for '#[number]' at end of string

    if (numRegex.exec(name) == null) {
        name = name + " #2";
    }

    var numIdx = name.lastIndexOf(numRegex.exec(name)[0]);

    id = await checkIfSameNameExists(name, tablename);
    while (id) {
        name = name.slice(0, numIdx+1) + String(Number(name.slice(numIdx+1)) + 1);
        id = await checkIfSameNameExists(name, tablename);
    }
    console.log(name);
    return name;
}

const addHttpsToLink = (link) => {
    if (link.length < 9 || (link.slice(0, 8) != 'https://')) {
        return 'https://' + link;
    }
    return link;
}


export const fetchAllergiesByRecipeId = async (recipeId) => {
    try {
        const { data, error } = await supabase
            .from('recipe_contains_allergy')
            .select('id, allergy')
            .eq('recipe_id', recipeId);

        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Error fetching allergies:', err);
        throw err;
    }
};


export const addAllergyToRecipe = async (recipeId, allergy) => {
    try {

        const { data, error } = await supabase
            .from('recipe_contains_allergy')
            .insert([{ recipe_id: recipeId, allergy }])
            .select();

        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Error adding allergy:', err);
        throw err;
    }
};

export const deleteAllergyFromRecipe = async (recipeId, allergyId) => {
    try {
        const { data, error } = await supabase
            .from('recipe_contains_allergy')
            .delete()
            .eq('recipe_id', recipeId)
            .eq('id', allergyId);

        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Error deleting allergy:', err);
        throw err;
    }
};
