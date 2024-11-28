import React from 'react';

const Recipe = ({recipe}) => {
    return (
        <div>
            <h2>{recipe.name}</h2>
            <p>Serving Amount: {recipe.serving_amount}</p>
            <p>Category: {recipe.category}</p>

            <a href={recipe.link} target="_blank" rel="noopener noreferrer">
                Instructions
            </a>
        </div>
    )
}

export default Recipe;