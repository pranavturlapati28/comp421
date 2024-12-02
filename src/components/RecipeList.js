import React, { useEffect, useState } from 'react';
import { fetchRecipes, deleteRecipe } from '../services/supabaseFunctions';
import './RecipeList.css';

const RecipeCard = ({ recipe, onView, onUpdate, onDelete }) => {
    return (
        <div className="recipe-card">
            {recipe.image && <img src={recipe.image} alt={recipe.name} className="recipe-image" />}
            <h3>{recipe.name}</h3>
            <p>Category: {recipe.category || 'N/A'}</p>
            <p>Serving Size: {recipe.serving_amount || 'N/A'}</p>
            <div className="recipe-actions">
                <button onClick={() => onView(recipe.id)}>View</button>
                <button onClick={() => onUpdate(recipe.id)}>Update</button>
                <button onClick={() => onDelete(recipe.id)}>Delete</button>
            </div>
        </div>
    );
};

const RecipeList = ({ onView, onUpdate }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredRecipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p>Loading recipes...</p>;

    return (
        <div className="recipe-list-container">
            <h1 className="title">Recipes</h1>
            <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />
            <div className="recipe-list">
                {filteredRecipes.length > 0 ? (
                    filteredRecipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onView={onView} // Pass onView to RecipeCard
                            onUpdate={onUpdate}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <p>No recipes found. Try a different search term.</p>
                )}
            </div>
        </div>
    );
};

export default RecipeList;
