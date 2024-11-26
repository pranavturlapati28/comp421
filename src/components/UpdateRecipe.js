import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { updateRecipe, deleteIngredientFromRecipe } from '../services/supabaseFunctions';

const UpdateRecipe = ({ recipeId, navigate }) => {
    const [recipe, setRecipe] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [form, setForm] = useState({ name: '', serving_amount: '', cooking_time: '' });

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const { data: recipeData } = await supabase
                    .from('recipe')
                    .select('*')
                    .eq('id', recipeId)
                    .single();

                const { data: ingredientsData } = await supabase
                    .from('recipe_contains_ingredient')
                    .select('ingredient_id, ingredient(name)')
                    .eq('recipe_id', recipeId);

                setRecipe(recipeData);
                setIngredients(ingredientsData.map((item) => item.ingredient));
                setForm({
                    name: recipeData.name,
                    serving_amount: recipeData.serving_amount,
                    cooking_time: recipeData.cooking_time,
                });
            } catch (err) {
                console.error('Error fetching recipe details:', err);
            }
        };

        fetchRecipeDetails();
    }, [recipeId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedFields = {
                name: form.name,
                serving_amount: form.serving_amount,
                cooking_time: form.cooking_time,
            };

            const result = await updateRecipe(recipeId, updatedFields);
            if (result) {
                alert('Recipe updated successfully!');
            } else {
                alert('Failed to update recipe.');
            }
        } catch (err) {
            console.error('Error updating recipe:', err);
        }
    };

    const handleDeleteIngredient = async (ingredientId) => {
        try {
            const result = await deleteIngredientFromRecipe(recipeId, ingredientId);
            if (result) {
                setIngredients((prev) => prev.filter((ing) => ing.id !== ingredientId));
                alert('Ingredient deleted successfully!');
            } else {
                alert('Failed to delete ingredient.');
            }
        } catch (err) {
            console.error('Error deleting ingredient:', err);
        }
    };

    if (!recipe) return <p>Loading...</p>;

    return (
        <div>
            <h1>Update Recipe</h1>
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Serving Amount"
                    value={form.serving_amount}
                    onChange={(e) => setForm({ ...form, serving_amount: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Cooking Time (minutes)"
                    value={form.cooking_time}
                    onChange={(e) => setForm({ ...form, cooking_time: e.target.value })}
                />
                <button type="submit">Update Recipe</button>
            </form>

            <h2>Ingredients</h2>
            <ul>
                {ingredients.map((ingredient) => (
                    <li key={ingredient.id}>
                        {ingredient.name}{' '}
                        <button onClick={() => handleDeleteIngredient(ingredient.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
    );
};

export default UpdateRecipe;
