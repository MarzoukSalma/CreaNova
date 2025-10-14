from flask import Flask, request, jsonify
from backend.services.test_queries import get_answer  # tu vas le créer juste après

app = Flask(__name__)

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "Aucune question reçue"}), 400

    answer = get_answer(question)
    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(port=5000)
