from flask import Flask, render_template, jsonify
import sqlite3
import random

app = Flask(__name__)

def get_random_quote():
    conn = sqlite3.connect("ma_base.db")
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM citations")
    count = cursor.fetchone()[0]

    random_id = random.randint(1, count)
    cursor.execute("SELECT citation, auteur, manga FROM citations WHERE id = ?", (random_id,))
    quote, character, anime = cursor.fetchone()
    
    conn.close()
    return {"quote": quote, "character": character, "anime": anime}

@app.route("/")
def index():
    citation = get_random_quote()
    return render_template("index.html", citation=citation)

@app.route("/api/citation")
def api_citation():
    citation = get_random_quote()
    return jsonify(citation)

if __name__ == "__main__":
    app.run(debug=True)
