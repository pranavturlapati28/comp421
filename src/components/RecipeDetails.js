import React, { useEffect, useState } from 'react';
import { fetchRecipeDetails } from '../services/supabaseFunctions';
import './RecipeDetails.css';

const RecipeDetails = ({ recipeId, navigateBack }) => {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecipeDetails = async () => {
            try {
                const data = await fetchRecipeDetails(recipeId);
                setRecipe(data);
            } catch (error) {
                console.error('Error fetching recipe details:', error);
            } finally {
                setLoading(false);
            }
        };

        loadRecipeDetails();
    }, [recipeId]);

    if (loading) return <p>Loading recipe details...</p>;
    if (!recipe) return <p>Recipe not found.</p>;

    return (
        <div className="recipe-details-container">
            <button className="back-button" onClick={navigateBack}>
                Back
            </button>
            <h1 className="recipe-title">{recipe.name}</h1>
            <p><strong>Serving Amount:</strong> {recipe.serving_amount}</p>
            <p><strong>Category:</strong> {recipe.category || 'N/A'}</p>
            
            {/* Recipe Link */}
            <p className="recipe-link-container">
                <strong>Recipe Link:</strong> 
                <a href={recipe.link} target="_blank" rel="noopener noreferrer" className="recipe-link">
                    {recipe.link}
                </a>
            </p>

            <h3>Ingredients:</h3>
            <ul>
                {recipe.recipe_contains_ingredient.map((item) => (
                    <li key={item.ingredient_id}>
                        {item.ingredient.name} - {item.ingredient.calories} cal
                    </li>
                ))}
            </ul>

            <h3>Allergies:</h3>
            <ul>
                {recipe.recipe_contains_allergy.map((item, index) => (
                    <li key={index}>{item.allergy}</li>
                ))}
            </ul>
        </div>
    );
};

export default RecipeDetails;
