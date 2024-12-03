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
            </header>
            <main>{renderPage()}</main>
        </div>
    );
}

export default App;
