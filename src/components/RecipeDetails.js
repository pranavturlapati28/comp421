import React, { useEffect, useState } from 'react';
import { fetchRecipeDetails } from '../services/supabaseFunctions';

const RecipeDetails = ({ recipeId }) => {
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
        <div>
            <h1>{recipe.name}</h1>
            <p>Serving Amount: {recipe.serving_amount}</p>
            <p>Category: {recipe.category}</p>
            <a href={recipe.link} target="_blank" rel="noopener noreferrer">
                View Instructions
            </a>

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
