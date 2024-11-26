import { supabase } from '/Users/pranavturlapati/recipe-collection/src/supabaseClient.js';

/** Fetch all recipes with their associated ingredients and allergies */
export const fetchRecipes = async () => {
    const { data, error } = await supabase
        .from('recipe')
        .select();

    if (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
    return data;
};

/** Add a new recipe with its ingredients and allergies */
export const addRecipe = async (recipe, ingredients, allergies) => {
    try {
        // Insert the recipe
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

/** Add a new ingredient */
export const addIngredient = async (ingredient) => {
    const { data, error } = await supabase
        .from('ingredient')
        .insert([
            {
                name: ingredient.name,
                serving_size: ingredient.serving_size,
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
};
