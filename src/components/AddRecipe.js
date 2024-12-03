import React, { useState, useEffect } from 'react';
import { addRecipe, fetchIngredients } from '../services/supabaseFunctions';
import ReactDropdown from 'react-dropdown';
import { ALLERGIES, RECIPE_CATEGORIES } from '../services/supabaseFunctions';

const AddRecipe = () => {
    console.log('rendering');

    const [_, forceUpdate] = useState(0);
    const refresh = () => forceUpdate((count) => count + 1);

    const [form, setForm] = useState({
        name: '',
        link: '',
        serving_amount: '',
        category: '',
    });
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [selected_allergies, setSelectedAllergies] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [recipe_categories, setRecipeCategories] =  useState([]);

    const loadAllergies = async () => {
        try {
            setAllergies(await ALLERGIES);
        }
        catch (error) {console.error('Error fetching allergies:', error)}
    };        
    const loadRecipeCategories = async () => {
        try {setRecipeCategories(await RECIPE_CATEGORIES);}
        catch (error) {console.error('Error fetching recipe categories:', error)}
    };

    const handleAllergySelected = (allergy) => {
        console.log(selected_allergies);
        let newSelection = selected_allergies;
        let found_idx = newSelection.findIndex((elt) => {return elt == allergy});
        if (found_idx != -1) {
            newSelection.splice(found_idx, 1);
            setSelectedAllergies(newSelection);
        } else {
            newSelection.push(allergy);
            setSelectedAllergies(newSelection)
        }
        // console.log(newSelection);
        // console.log(selected_allergies);
        // console.log(selected_allergies.includes(allergy));

        refresh();
    }

    useEffect(() => {
        const loadIngredients = async () => {
            try {
                const data = await fetchIngredients();
                setIngredients(data);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            } finally {
                setLoading(false);
            }
        };

        loadIngredients();

        loadAllergies();

        loadRecipeCategories();
        
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.link || !form.serving_amount || !form.category) {
            alert('All fields must be filled out.');
            return;
        }

        try {
            console.log('Submitting form data:', { form, selectedIngredients, selected_allergies });
            const result = await addRecipe(form, selectedIngredients, selected_allergies);
            if (result) {
                alert('Recipe added successfully!');
                setForm({ name: '', link: '', serving_amount: '', category: '' });
                setSelectedIngredients([]);
                setSelectedAllergies([]);
            } else {
                alert('Failed to add recipe.');
            }
        } catch (error) {
            console.error('Error adding recipe:', error);
            alert('An error occurred. Please check the console for more details.');
        }
    };

    if (loading) return <p>Loading ingredients...</p>;

    return (
        <form onSubmit={handleSubmit}>
            
            <h1>Add a New Recipe</h1>

            <div>
                <div>
                    <input
                        type="text"
                        placeholder="Recipe Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Recipe Link"
                        value={form.link}
                        onChange={(e) => setForm({ ...form, link: e.target.value })}
                    />                    
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Serving Amount"
                        value={form.serving_amount}
                        onChange={(e) => setForm({ ...form, serving_amount: e.target.value })}
                    />                    
                </div>
                <ReactDropdown
                    options={recipe_categories}
                    value={'Select a category'}
                    onChange={(e) => setForm({ ...form, category: e.value})}
                    placeholder="Select a category"
                    onFocus={() => {console.log(recipe_categories)}}
                ></ReactDropdown>

            </div>

            <h3>Select Ingredients:</h3>
            <ul>
                {ingredients.map((ingredient) => (
                    <li key={ingredient.id}>
                        <label>
                            <input
                                type="checkbox"
                                value={ingredient.id}
                                onChange={(e) => {
                                    const id = parseInt(e.target.value);
                                    setSelectedIngredients((prev) =>
                                        e.target.checked
                                            ? [...prev, id]
                                            : prev.filter((ingId) => ingId !== id)
                                    );
                                }}
                            />
                            {ingredient.name}
                        </label>
                    </li>
                ))}
            </ul>

            <h3>Add Allergies:</h3>
            {/* <input
                type="text"
                placeholder="Comma-separated (e.g., milk, peanuts)"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value.split(/[ ]*,[ ]
            /> */}
            <ul className='selectedAllergies'>
                {allergies.map((allergy) => (
                    <button
                        key={allergy}
                        type='button'
                        onClick={() => handleAllergySelected(allergy)}
                        style={{backgroundColor: (selected_allergies.includes(allergy)) ? '#ff6f61' : '#ffffff',
                        }}
                    >
                        {allergy.charAt(0).toUpperCase() + allergy.slice(1)}
                    </button>
                
                ))}                
            </ul>

            <button type="submit">Add Recipe</button>
        </form>
    );
};

export default AddRecipe;
