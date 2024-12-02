import React, { useState, useEffect } from 'react';
import { addRecipe, fetchIngredients } from '../services/supabaseFunctions';
import ReactDropdown from 'react-dropdown';
import { ALLERGIES, RECIPE_CATEGORIES } from '../services/supabaseFunctions';

const AddRecipe = () => {
    const [form, setForm] = useState({
        name: '',
        link: '',
        serving_amount: '',
        category: '',
    });
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [loading, setLoading] = useState(true);

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

        
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.link || !form.serving_amount || !form.category) {
            alert('All fields must be filled out.');
            return;
        }

        try {
            console.log('Submitting form data:', { form, selectedIngredients, allergies });
            const result = await addRecipe(form, selectedIngredients, allergies);
            if (result) {
                alert('Recipe added successfully!');
                setForm({ name: '', link: '', serving_amount: '', category: '' });
                setSelectedIngredients([]);
                setAllergies([]);
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
            <input
                type="text"
                placeholder="Recipe Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
                type="text"
                placeholder="Recipe Link"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
            <input
                type="number"
                placeholder="Serving Amount"
                value={form.serving_amount}
                onChange={(e) => setForm({ ...form, serving_amount: e.target.value })}
            />
            <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <ReactDropdown
                options={RECIPE_CATEGORIES}
                onChange={(e) => setForm({ ...form, category: e.target.value})}
                placeholder="Select a category"
                onFocus={() => {console.log(RECIPE_CATEGORIES)}}
                
                ></ReactDropdown>

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
            <input
                type="text"
                placeholder="Comma-separated (e.g., milk, peanuts)"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value.split(/[ ]*,[ ]*/))}
            />

            <button type="submit">Add Recipe</button>
        </form>
    );
};

export default AddRecipe;
