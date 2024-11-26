import React, { useState } from 'react';
import RecipeList from './components/RecipeList';
import AddRecipe from './components/AddRecipe';
import RecipeDetails from './components/RecipeDetails';

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
            default:
                return <h1>404 - Page Not Found</h1>;
        }
    };

    return (
        <div>
            <h1>Recipe Management App</h1>
            <nav>
                {/* Simple Navigation Buttons */}
                <button onClick={() => navigate('/')}>Home</button>
                <button onClick={() => navigate('/add')}>Add Recipe</button>
            </nav>
            {renderPage()}
        </div>
    );
}

export default App;
