from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


# Load model and encoders from the bundled pickle file
with open('isha.pkl', 'rb') as f:
    bundle = pickle.load(f)
    model = bundle['model']
    symptom_encoder = bundle['symptom_encoder']     
    disease_encoder = bundle['disease_encoder']     
    symptom_cols = bundle['symptom_columns']       

@app.route('/analyze', methods=['POST'])
def analyze_symptoms():
    try:
        data = request.get_json()
        print("Received data:", data)

        if not data or 'symptoms' not in data:
            return jsonify({"error": "No symptoms provided"}), 400

        input_symptoms = data['symptoms']

        # Pad to exactly 6 symptoms using "None"
        while len(input_symptoms) < 6:
            input_symptoms.append("None")
        input_symptoms = input_symptoms[:6]

        # Encode the symptoms using the trained encoder
        try:
            input_encoded = symptom_encoder.transform([input_symptoms])
        except ValueError as ve:
            return jsonify({"error": f"Unknown symptom detected: {ve}"}), 400

        # Predict disease
        prediction = model.predict(input_encoded)
        predicted_disease = disease_encoder.inverse_transform(prediction)

        return jsonify({"disease": predicted_disease[0]})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
