import React, { useState } from 'react';
import RecipeList from './components/RecipeList';
import AddRecipe from './components/AddRecipe';
import RecipeDetails from './components/RecipeDetails';
import UpdateRecipe from './components/UpdateRecipe';
import AddIngredient from './components/AddIngredient';
import SearchRecipes from './components/SearchRecipes';
import './App.css';

function App() {
    const [route, setRoute] = useState('/'); // Keep track of the current "route"
    const [selectedRecipeId, setSelectedRecipeId] = useState(''); // Used for RecipeDetails

    // Mock recipe data
    const recipes = [
        { id: 1, name: 'Pasta', ingredients: ['tomato', 'basil', 'cheese'] },
        { id: 2, name: 'Pizza', ingredients: ['dough', 'cheese', 'pepperoni'] },
        { id: 3, name: 'Salad', ingredients: ['lettuce', 'tomato', 'cucumber'] },
    ];

    // Navigate to a specific route
    const navigate = (path, params = null) => {
        setRoute(path);
        if (params) {
            setSelectedRecipeId(params);
        }
    };

    // Render components based on the current route
    const renderPage = () => {
        switch (route) {
            case '/':
                return (
                    <RecipeList
                        onUpdate={(id) => navigate('/update', id)}
                        onView={(id) => navigate('/recipe', id)} // Pass the onView function
                    />
                );
            case '/add':
                return <AddRecipe />;
            case '/add-ingredient':
                return <AddIngredient />;
            case '/recipe':
                return (
                    <RecipeDetails
                        recipeId={selectedRecipeId}
                        navigateBack={() => navigate('/')}
                    />
                );
            case '/update':
                return <UpdateRecipe recipeId={selectedRecipeId} navigateHome={() => navigate('/')} />;
            case '/search':
                return <SearchRecipes recipes={recipes} />;
            default:
                return <h1 style={{ textAlign: 'center', color: '#ff4d4f' }}>404 - Page Not Found</h1>;
        }
    };
    

    return (
        <div className='container'>
            <header>
                <h1 className='title'>🍳 Recipe Management App</h1>
                <nav className='nav'>
                    <button
                        style={route === '/' ? styles.navButtonActive : styles.navButton}
                        onClick={() => navigate('/')}
                    >
                        Home
                    </button>
                    <button
                        style={route === '/add' ? styles.navButtonActive : styles.navButton}
                        onClick={() => navigate('/add')}
                    >
                        Add Recipe
                    </button>
                    <button
                        style={route === '/add-ingredient' ? styles.navButtonActive : styles.navButton}
                        onClick={() => navigate('/add-ingredient')}
                    >
                        Add Ingredient
                    </button>
                    <button
                        style={route === '/search' ? styles.navButtonActive : styles.navButton}
                        onClick={() => navigate('/search')}
                    >
                        Search Recipes
                    </button>
                </nav>
            </header>
            <main>{renderPage()}</main>
        </div>
    );
}

export default App;

const styles = {
    navButton: {
        backgroundColor: '#fff',
        color: '#ff6f61',
        border: 'none',
        padding: '10px 15px',
        margin: '5px',
        cursor: 'pointer',
        borderRadius: '5px',
    },
    navButtonActive: {
        backgroundColor: '#ff6f61',
        color: '#fff',
        border: 'none',
        padding: '10px 15px',
        margin: '5px',
        cursor: 'pointer',
        borderRadius: '5px',
    },
};
