import React, { useState, useEffect } from 'react';
import AddIngredient from './AddIngredient';
import { updateRecipe, deleteIngredientFromRecipe, fetchRecipeById, fetchIngredientsByRecipeId } from '../services/supabaseFunctions';

const UpdateRecipe = ({ recipeId, navigateHome }) => {
    const [ingredients, setIngredients] = useState([]);
    const [form, setForm] = useState({ name: '', link: '', serving_amount: 0, category: '' });

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const recipeData = await fetchRecipeById(recipeId);
                setForm({
                    name: recipeData.name,
                    link: recipeData.link,
                    serving_amount: recipeData.serving_amount,
                    category: recipeData.category,
                });

                const ingredientData = await fetchIngredientsByRecipeId(recipeId);
                const ingredientList = ingredientData.map(d => d.ingredient);
                setIngredients(ingredientList);
            } catch (err) {
                console.error('Error fetching recipe details:', err);
            }
        };

        fetchRecipeDetails();
    }, [recipeId]);

    const handleUpdateRecipe = async (e) => {
        e.preventDefault();
        try {
            const updatedFields = {
                name: form.name,
                link: form.link,
                serving_amount: form.serving_amount,
                category: form.category,
            };

            const updatedRecipe = await updateRecipe(recipeId, updatedFields);
            if (updatedRecipe) {
                alert(`Recipe ${updatedRecipe[0].name} updated successfully!`);
            } else {
                alert('Failed to update recipe.');
            }
        } catch (err) {
            console.error('Error updating recipe:', err);
        }

        navigateHome();
    };

    const handleDeleteIngredient = async (ingredientId) => {
        try {
            const result = await deleteIngredientFromRecipe(recipeId, ingredientId);
            setIngredients((prev) => prev.filter((ing) => ing.id !== ingredientId));
            alert('Ingredient deleted successfully!');
        } catch (err) {
            console.error('Error deleting ingredient:', err);
        }
    };

    return (
        <div>
            <h1>Update Recipe</h1>
            <form onSubmit={handleUpdateRecipe}>
                <input
                    type="text"
                    placeholder="Recipe Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Recipe Link"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Serving Amount"
                    value={form.serving_amount}
                    onChange={(e) => setForm({ ...form, serving_amount: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
                <button type="submit">Update Recipe</button>
            </form>

            <h3>Ingredients</h3>
            <ul>
                {ingredients.map((ingredient) => (
                    <li key={ingredient.id}>
                        {ingredient.name}
                        <button onClick={() => handleDeleteIngredient(ingredient.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <h4>Add an ingredient: </h4>
            <AddIngredient recipeId={recipeId} updateIngredientList={(newIngredient) => setIngredients([...ingredients, newIngredient])} />
            <button onClick={navigateHome}>Cancel Update</button>
        </div>
    );
};

export default UpdateRecipe;
