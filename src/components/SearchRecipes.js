import React, { useState, useEffect } from 'react';
import { fetchRecipes } from '../services/supabaseFunctions';

const SearchRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch recipes from Supabase
        const loadRecipes = async () => {
            try {
                const data = await fetchRecipes();
                setRecipes(data);
                setFilteredRecipes(data); // Initialize with all recipes
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        };

        loadRecipes();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = recipes.filter(
            (recipe) =>
                recipe.name.toLowerCase().includes(term) ||
                (recipe.recipe_contains_ingredient &&
                    recipe.recipe_contains_ingredient.some((item) =>
                        item.ingredient.name.toLowerCase().includes(term)
                    ))
        );

        setFilteredRecipes(filtered);
    };

    if (loading) return <p>Loading recipes...</p>;

    return (
        <div>
            <h2>🔍 Search Recipes</h2>
            <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ padding: '10px', width: '100%', marginBottom: '20px' }}
            />
            <ul>
                {filteredRecipes.length > 0 ? (
                    filteredRecipes.map((recipe) => (
                        <li key={recipe.id}>
                            <h3>{recipe.name}</h3>
                            <p>Category: {recipe.category}</p>
                            <p>
                                Ingredients:{' '}
                                {recipe.recipe_contains_ingredient
                                    ?.map((item) => item.ingredient.name)
                                    .join(', ')}
                            </p>
                        </li>
                    ))
                ) : (
                    <p>No recipes found. Try a different search term.</p>
                )}
            </ul>
        </div>
    );
};

export default SearchRecipes;
