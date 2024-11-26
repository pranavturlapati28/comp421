from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(recipe)
CORS(app)

# connect to the db
# I'm not sure how to connect to the supabase client

# i  think i know how let me see

db = mysql.connector.connect(
    host = "",
    user = "", 
    password = "",
    database = "cookbook"
)
cursor = bd.cursor(dictionary = True)

# Add a recipe to the database
def add_recipe(name, serving_amount, instructions, link_to_website, allergies, categories, cooking_time):
    data = request.json
    query = """
        INSERT INTO Recipe(name, serving_amount, instructions, link_to_website, allergies, categories, cooking_time)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (name, serving_amount, instructions, link_to_website, allergies, categories, cooking_time))
    db.commit()
    return jsonify({"message": "Recipe added", "id": cursor.lastrowid}), 201

# Get all recipes
def get_recipes():
    cursor.execute("SELECT * FROM Recipe")
    recipes = cursor.fetchall()
    return jsonify(recipes)

# Delete a recipe
def delete_recipe(id):
    cursor.execute("DELETE FROM Recipe WHERE ID = %s", id)
    db.commit()
    return jsonify({"message": "Recipe deleted"}), 200

# Update a recipe
def update_recipe(id, name, serving_amount, instructions, link_to_website, allergies, categories, cooking_time):
    query = """
        UPDATE Recipe
        SET name = %s, serving_amount = %s, instructions = %s, link_to_website = %s, allergies = %s,
            categories = %s, cooking_time = %s
        WHERE id = %s
    """
    cursor.execute(query, (name, serving_amount, instructions, link_to_website, allergies, categories, cooking_time, id))
    db.commit
    return jsonify({"message": "Recipe updated"}), 200

