import React, { useState } from 'react';
import RecipeList from './components/RecipeList';
import AddRecipe from './components/AddRecipe';
import RecipeDetails from './components/RecipeDetails';
import UpdateRecipe from './components/UpdateRecipe';

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
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>🍳 Recipe Management App</h1>
                <nav style={styles.nav}>
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
            <main style={styles.main}>{renderPage()}</main>
        </div>
    );
}

export default App;

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        lineHeight: '1.6',
    },
    header: {
        backgroundColor: '#ff6f61',
        color: '#fff',
        padding: '20px 10px',
        textAlign: 'center',
    },
    title: {
        margin: 0,
        fontSize: '2rem',
    },
    nav: {
        marginTop: '10px',
    },
    navButton: {
        backgroundColor: '#fff',
        color: '#ff6f61',
        border: '1px solid #ff6f61',
        borderRadius: '5px',
        padding: '10px 15px',
        fontSize: '1rem',
        margin: '0 5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, color 0.3s',
    },
    navButtonActive: {
        backgroundColor: '#ff6f61',
        color: '#fff',
        border: '1px solid #ff6f61',
        borderRadius: '5px',
        padding: '10px 15px',
        fontSize: '1rem',
        margin: '0 5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, color 0.3s',
    },
    main: {
        padding: '20px',
    },
};
