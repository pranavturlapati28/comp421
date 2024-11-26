import React, { useEffect, useState } from 'react';
import { fetchRecipes, deleteRecipe } from '../services/supabaseFunctions';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecipes = async () => {
            try {
                const data = await fetchRecipes();
                setRecipes(data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        };

        loadRecipes();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteRecipe(id);
            setRecipes(recipes.filter((recipe) => recipe.id !== id));
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    };

    if (loading) return <p>Loading recipes...</p>;

    return (
        <div>
            <h1>Recipes</h1>
            <ul>
                {recipes.map((recipe) => (
                    <li key={recipe.id}>
                        <h2>{recipe.name}</h2>
                        <p>Serving Amount: {recipe.serving_amount}</p>
                        <p>Category: {recipe.category}</p>
                        <a href={recipe.link} target="_blank" rel="noopener noreferrer">
                            Instructions
                        </a>
                        <button onClick={() => handleDelete(recipe.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecipeList;
