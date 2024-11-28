import React, { useEffect, useState } from 'react';
import { fetchRecipes, deleteRecipe } from '../services/supabaseFunctions';
import Recipe from './Recipe';


const RecipeList = ({onUpdate}) => {
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

    const recipeList = recipes.map((recipe) => (
        <div key={recipe.id}>
             <Recipe recipe={recipe}/>
             <button onClick={() => onUpdate(recipe.id)}>Update</button>
             <button onClick={() => handleDelete(recipe.id)}>Delete</button>
        </div>
    ));

    if (loading) return <p>Loading recipes...</p>;

    return (
        <div>
            <h1>Recipes</h1>
            {recipeList}
        </div>
    );
};

export default RecipeList;
