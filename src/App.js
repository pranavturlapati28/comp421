import React, { useState } from 'react';
import RecipeList from './components/RecipeList';
import AddRecipe from './components/AddRecipe';
import RecipeDetails from './components/RecipeDetails';
import UpdateRecipe from './components/UpdateRecipe';
import AddIngredient from './components/AddIngredient';
import './App.css';
import { fetchRecipes } from './services/supabaseFunctions';

function App() {
    const [route, setRoute] = useState('/');
    const [selectedRecipeId, setSelectedRecipeId] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterTitle, setFilterTitle] = useState('');

    const navigate = (path, params = null) => {
        setRoute(path);
        if (params) {
            setSelectedRecipeId(params);
        }
    };

    const handleFilterClick = async (procedureName, title) => {
        try {
            setLoading(true);
            setFilterTitle(title);
            const data = await fetchRecipes(procedureName);
            setRecipes(data);
            setRoute('/filter-results');
        } catch (error) {
            console.error('Error fetching filtered recipes:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderPage = () => {
        switch (route) {
            case '/':
                return <RecipeList onUpdate={(id) => navigate('/update', id)} onView={(id) => navigate('/recipe', id)} />;
            case '/add':
                return <AddRecipe />;
            case '/add-ingredient':
                return <AddIngredient />;
            case '/recipe':
                return <RecipeDetails recipeId={selectedRecipeId} navigateBack={() => navigate('/')} />;
            case '/update':
                return <UpdateRecipe recipeId={selectedRecipeId} navigateHome={() => navigate('/')} />;
            case '/filter-results':
                return (
                    <div className="recipe-list-container">
                        <h1>{filterTitle}</h1>
                        {loading ? (
                            <p>Loading recipes...</p>
                        ) : recipes.length > 0 ? (
                            <div className="recipe-list">
                                {recipes.map((recipe) => (
                                    <div key={recipe.id} className="recipe-card">
                                        <h3>{recipe.name}</h3>
                                        <p>Category: {recipe.category || 'N/A'}</p>
                                        <p>Serving Size: {recipe.serving_amount || 'N/A'}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No recipes found.</p>
                        )}
                    </div>
                );
            default:
                return <h1 style={{ textAlign: 'center', color: '#ff4d4f' }}>404 - Page Not Found</h1>;
        }
    };

    return (
        <div className="container">
            <header className="header">
                <h1 className="app-title">🍳 Recipe Management App</h1>
                <nav className="nav">
                    <button className="nav-button" onClick={() => navigate('/')}>
                        Home
                    </button>
                    <button className="nav-button" onClick={() => navigate('/add')}>
                        Add Recipe
                    </button>
                    <button className="nav-button" onClick={() => navigate('/add-ingredient')}>
                        Add Ingredient
                    </button>
                </nav>
                {route === '/' && (
                    <div className="filter-buttons">
                        <button onClick={() => handleFilterClick('get_milk', 'Milk-Free Recipes')}>Milk-Free</button>
                        <button onClick={() => handleFilterClick('get_eggs', 'Egg-Free Recipes')}>Egg-Free</button>
                        <button onClick={() => handleFilterClick('get_fish', 'Fish-Free Recipes')}>Fish-Free</button>
                        <button onClick={() => handleFilterClick('get_shellfish', 'Shellfish-Free Recipes')}>Shellfish-Free</button>
                        <button onClick={() => handleFilterClick('get_tree_nuts', 'Tree Nuts-Free Recipes')}>Tree Nuts-Free</button>
                        <button onClick={() => handleFilterClick('get_peanuts', 'Peanut-Free Recipes')}>Peanut-Free</button>
                        <button onClick={() => handleFilterClick('get_wheat', 'Wheat-Free Recipes')}>Wheat-Free</button>
                        <button onClick={() => handleFilterClick('get_soybeans', 'Soy-Free Recipes')}>Soy-Free</button>
                        <button onClick={() => handleFilterClick('get_sesame', 'Sesame-Free Recipes')}>Sesame-Free</button>
                    </div>
                )}
            </header>
            <main>{renderPage()}</main>
        </div>
    );
}

export default App;
