import React, { useState, useEffect } from 'react';
import AddIngredient from './AddIngredient';
import { 
    updateRecipe, 
    deleteIngredientFromRecipe, 
    fetchRecipeById, 
    fetchIngredientsByRecipeId,
    fetchAllergiesByRecipeId,
    addAllergyToRecipe,
    deleteAllergyFromRecipe
} from '../services/supabaseFunctions';
import './UpdateRecipe.css';

const UpdateRecipe = ({ recipeId, navigateHome }) => {
    const [ingredients, setIngredients] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [form, setForm] = useState({ name: '', link: '', serving_amount: 0, category: '' });
    const [newAllergy, setNewAllergy] = useState('');

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

                const allergyData = await fetchAllergiesByRecipeId(recipeId);
                setAllergies(allergyData);
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

    const handleAddAllergy = async () => {
        try {
            const addedAllergy = await addAllergyToRecipe(recipeId, newAllergy);
            setAllergies((prev) => [...prev, ...addedAllergy]);
            setNewAllergy('');
            alert('Allergy added successfully!');
        } catch (err) {
            console.error('Error adding allergy:', err);
        }
    };

    const handleDeleteAllergy = async (allergyId) => {
        try {
            await deleteAllergyFromRecipe(recipeId, allergyId);
            setAllergies((prev) => prev.filter((allergy) => allergy.id !== allergyId));
            alert('Allergy deleted successfully!');
        } catch (err) {
            console.error('Error deleting allergy:', err);
        }
    };

    return (
        <div className="update-recipe-container">
            <h1>Update Recipe</h1>
            <form className="update-recipe-form" onSubmit={handleUpdateRecipe}>
                <label>
                    Recipe Name
                    <input
                        type="text"
                        placeholder="Recipe Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </label>
                <label>
                    Recipe Link
                    <input
                        type="text"
                        placeholder="Recipe Link"
                        value={form.link}
                        onChange={(e) => setForm({ ...form, link: e.target.value })}
                    />
                </label>
                <label>
                    Serving Amount
                    <input
                        type="number"
                        placeholder="Serving Amount"
                        value={form.serving_amount}
                        onChange={(e) => setForm({ ...form, serving_amount: e.target.value })}
                    />
                </label>
                <label>
                    Category
                    <input
                        type="text"
                        placeholder="Category"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                    />
                </label>
                <button type="submit" className="update-button">Update Recipe</button>
            </form>

            <h3>Ingredients</h3>
            <ul className="ingredients-list">
                {ingredients.map((ingredient) => (
                    <li key={ingredient.id} className="ingredient-item">
                        {ingredient.name}
                        <button
                            onClick={() => handleDeleteIngredient(ingredient.id)}
                            className="delete-button"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <h4>Add an ingredient:</h4>
            <AddIngredient
                recipeId={recipeId}
                updateIngredientList={(newIngredient) =>
                    setIngredients([...ingredients, newIngredient])
                }
            />

            <h3>Allergies</h3>
            <ul className="allergies-list">
                {allergies.map((allergy) => (
                    <li key={allergy.id} className="allergy-item">
                        {allergy.allergy}
                        <button
                            onClick={() => handleDeleteAllergy(allergy.id)}
                            className="delete-button"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <h4>Add an allergy:</h4>
            <input
                type="text"
                placeholder="Add Allergy"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
            />
            <button onClick={handleAddAllergy} className="add-button">
                Add Allergy
            </button>

            <button onClick={navigateHome} className="cancel-button">
                Cancel Update
            </button>
        </div>
    );
};

export default UpdateRecipe;
