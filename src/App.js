import React, { useState } from 'react';
import RecipeList from './components/RecipeList';
import AddRecipe from './components/AddRecipe';
import RecipeDetails from './components/RecipeDetails';
import UpdateRecipe from './components/UpdateRecipe';
import './App.css';

function App() {
    const [route, setRoute] = useState('/'); // Keep track of the current "route"
    const [selectedRecipeId, setSelectedRecipeId] = useState(null); // Used for RecipeDetails

    // Navigate to a specific route
    const navigate = (path, params = null) => {
        setRoute(path);
        if (params?.id) {
            setSelectedRecipeId(params.id);
        }
    };

    // Render components based on the current route
    const renderPage = () => {
        switch (route) {
            case '/':
                return <RecipeList navigate={navigate} />;
            case '/add':
                return <AddRecipe navigate={navigate} />;
            case '/recipe':
                return <RecipeDetails recipeId={selectedRecipeId} navigate={navigate} />;
            case '/update':
                return <UpdateRecipe recipeId={selectedRecipeId} navigate={navigate} />;
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