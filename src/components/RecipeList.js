import React, { useEffect, useState } from 'react';
import { fetchRecipes, deleteRecipe, ALLERGIES, RECIPE_CATEGORIES, INGREDIENT_CATEGORIES } from '../services/supabaseFunctions';
import { supabase } from '../services/supabaseClient';
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

    const [allergies, setAllergies] =  useState([]);
    const [allergies_filter, setAllergiesFilter] = useState(new Map());
    const [selected_allergies, setSelectedAllergies] = useState([]);
    const [recipe_categories, setRecipeCategories] =  useState([]);
    const [ingredient_categories, setIngredientCategories] =  useState([]);

    const loadAllergies = async () => {
                try {
                    setAllergies(await ALLERGIES);

                    const newMap = new Map();
                    (await ALLERGIES).forEach((allergy) => {
                        newMap.set(allergy, false);
                    });
                    setAllergiesFilter(newMap);
                }
                catch (error) {console.error('Error fetching allergies:', error)}
            };        
    const loadRecipeCategories = async () => {
        try {setRecipeCategories(await RECIPE_CATEGORIES);}
        catch (error) {console.error('Error fetching recipe categories:', error)}
    };
    const loadIngredientCategories = async () => {
        try {setIngredientCategories(await INGREDIENT_CATEGORIES);}
        catch (error) {console.error('Error fetching ingredient categories:', error)}
    };

    const loadRecipes = async (selected_allergies = []) => {
        console.log(selected_allergies);
        try {
            if (selected_allergies.length) {
                const data = await fetchRecipes('get_recipes_without_allergies', selected_allergies);
                setRecipes(data);
            } else {
                const data = await fetchRecipes();
                setRecipes(data);
            }

        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        loadAllergies();
        loadRecipeCategories();
        loadIngredientCategories();

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

    const logFetchedEnums = async () => {
        console.log('---')
        console.log(allergies);
        console.log(selected_allergies);
        console.log(recipe_categories);
        console.log(ingredient_categories);
        console.log(recipes);
        console.log('---');
    }
    const filteredRecipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFilterClick = (allergy) => {
        let newMap = new Map(allergies_filter);
        newMap.set(allergy, !allergies_filter.get(allergy));

        let newSelection = [];
        newMap.forEach((value, key, map) => {
            if (value) {
                newSelection.push(key);
            }
        })

        setAllergiesFilter(newMap);
        setSelectedAllergies(newSelection);
        console.log(newSelection);
        console.log(selected_allergies);

        loadRecipes(newSelection);
    }

    if (loading) return <p>Loading recipes...</p>;

    return (
        <div className="recipe-list-container">
            <h1>Recipes</h1>
            <button onClick={() => logFetchedEnums()}>log</button>
            <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />
            <div className="filter-buttons">
                {/* <button onClick={() => handleFilterClick('milk')}>Milk-Free</button>
                <button onClick={() => handleFilterClick('eggs')}>Egg-Free</button>
                <button onClick={() => handleFilterClick('fish')}>Fish-Free</button>
                <button onClick={() => handleFilterClick('shellfish')}>Shellfish-Free</button>
                <button onClick={() => handleFilterClick('tree_nuts')}>Tree Nuts-Free</button>
                <button onClick={() => handleFilterClick('peanuts')}>Peanut-Free</button>
                <button onClick={() => handleFilterClick('wheat')}>Wheat-Free</button>
                <button onClick={() => handleFilterClick('soybeans')}>Soy-Free</button>
                <button onClick={() => handleFilterClick('sesame')}>Sesame-Free</button> */}
                {allergies.map((allergy) => (
                    <button
                        onClick={() => handleFilterClick(allergy)}
                        style={{backgroundColor: allergies_filter.get(allergy) ? '#ff6f61' : '#ffffff'}}
                    >
                        {allergy.charAt(0).toUpperCase() + allergy.slice(1) + '-free'}
                    </button>
                
                ))}
            </div>
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
