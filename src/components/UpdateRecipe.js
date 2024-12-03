import React, { useState, useEffect } from 'react';
import AddIngredient from './AddIngredient';
import { 
    updateRecipe, 
    deleteIngredientFromRecipe, 
    fetchIngredients,
    fetchRecipeById, 
    fetchIngredientsByRecipeId,
    fetchAllergiesByRecipeId,
    addAllergyToRecipe,
    deleteAllergyFromRecipe,
    RECIPE_CATEGORIES,
    addIngredientToRecipe
} from '../services/supabaseFunctions';
import ReactDropdown from 'react-dropdown';
import './UpdateRecipe.css';

const UpdateRecipe = ({ recipeId, navigateHome }) => {

    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [recipeCategories, setRecipeCategories] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [form, setForm] = useState({ name: '', link: '', serving_amount: 0, category: '' });
    const [newAllergy, setNewAllergy] = useState('');
 
    const loadRecipeCategories = async () => {
        try {
            setRecipeCategories(await RECIPE_CATEGORIES);
        }
        catch (error) {console.error('Error fetching recipe categories:', error)}
    };  

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
                setSelectedIngredients(ingredientList);

                const allergyData = await fetchAllergiesByRecipeId(recipeId);
                setAllergies(allergyData);
            } catch (err) {
                console.error('Error fetching recipe details:', err);
            }
        };

        const loadIngredients = async () => {
            try {
                const data = await fetchIngredients();
                setIngredients(data);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };

        fetchRecipeDetails();
        loadIngredients();
        loadRecipeCategories();
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
            await deleteIngredientFromRecipe(recipeId, ingredientId);
            setSelectedIngredients((prev) => prev.filter((ingredient) => ingredient.id !== ingredientId));
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
        } catch (err) {
            console.error('Error deleting allergy:', err);
        }
    };

    return (
        <div className="update-recipe-container">
            <h2>Update Recipe</h2>
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
                <ReactDropdown
                    options={recipeCategories}
                    value={'Select a category'}
                    onChange={(e) => setForm({ ...form, category: e.value})}
                    placeholder="Select a category"
                    onFocus={() => {console.log(recipeCategories)}}
                ></ReactDropdown>
                <button type="submit" className="update-button">Update Recipe</button>
            </form>

            <h3>Ingredients</h3>
            <ul className="ingredients-list">
                {selectedIngredients.map((ingredient) => (
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
            <ul>
                {ingredients.map((ingredient) => (
                    selectedIngredients.map(i => i.id).includes(ingredient.id) ? <div></div> :
                    <li key={ingredient.id}>
                        <label>
                            <input
                                type="checkbox"
                                value={ingredient.id}
                                onChange={(e) => {
                                    addIngredientToRecipe(recipeId, ingredient.id);
                                    setSelectedIngredients([...selectedIngredients, ingredient]);
                                }}
                            />
                            {ingredient.name}
                        </label>
                    </li>
                ))}
            </ul>
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
        </div>
    );
};

export default UpdateRecipe;
