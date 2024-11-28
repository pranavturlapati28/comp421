import React, { useState } from 'react';
import RecipeList from './components/RecipeList';
import AddRecipe from './components/AddRecipe';
import RecipeDetails from './components/RecipeDetails';
import UpdateRecipe from './components/UpdateRecipe';
import './App.css';
import AddIngredient from './components/AddIngredient';

function App() {
    const [route, setRoute] = useState('/'); // Keep track of the current "route"
    const [selectedRecipeId, setSelectedRecipeId] = useState(''); // Used for RecipeDetails

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
                return <RecipeList onUpdate={(it) => navigate('/update', it)}/>;
            case '/add':
                return <AddRecipe />;
            case '/add-ingredient':
                return <AddIngredient />;
            case '/recipe':
                return <RecipeDetails recipeId={selectedRecipeId} />;
            case '/update':
                return <UpdateRecipe recipeId={selectedRecipeId} navigateHome={() => navigate('/')} />;
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
    },
    navButtonActive: {
        backgroundColor: '#ff6f61',
        color: '#fff',
    },
}