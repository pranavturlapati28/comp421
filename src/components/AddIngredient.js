import React, { useState } from 'react';
import './form.css';
import { addIngredient, addIngredientToRecipe } from '../services/supabaseFunctions';

const AddIngredient = ({recipeId = null, updateIngredientList = () => {} }) => {
    const [form, setForm] = useState({ name: '', amount: 0, calories: 0, food_category: '' });


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await addIngredient(form);
            if (result) {
                alert('Ingredient added successfully!');
                setForm({ name: '', amount: 0, calories: 0, food_category: '' });
            } else {
                alert('Failed to add ingredient.');
            }

            console.log(result[0]);

            if (recipeId && result[0].id) {
                await addIngredientToRecipe(recipeId, result[0].id);
            }
            updateIngredientList(result[0]);
        } catch (error) {
            console.error('Error adding ingredient:', error);
            alert(`An error occurred: ${error.details}`);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add a New Ingredient</h2>
            <div className="form-input">
                <label>Name</label>
                <br />
                <input
                    type='text'
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
            </div>
            <div className="form-input">
                <label>Amount (one serving) </label>
                <br />
                <input
                    type='number'
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                />
            </div>

            <div className="form-input">
                <label>Calories</label>
                <br />
                <input
                    type='number'
                    value={form.calories}
                    onChange={(e) => setForm({ ...form, calories: e.target.value })}
                    required
                />
            </div>

            <div className="form-input">
                <label>Food Category</label>
                <br />
                <input
                    type='text'
                    value={form.food_category}
                    onChange={(e) => setForm({ ...form, food_category: e.target.value })}
                    required
                />
            </div>

            <button>Add</button>
        </form>
    )
}

export default AddIngredient;