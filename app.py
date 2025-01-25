from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app, resources={r"/chat": {"origins": "*"}})

# Gemini API Key
GEMINI_API_KEY = 'AIzaSyCuRIopGxIzAVTG-j-Ag2A4VwXHhSOKURY'
genai.configure(api_key=GEMINI_API_KEY)

generation_config = {
    "temperature": 0.7,
    "top_p": 0.9,
    "top_k": 50,
    "max_output_tokens": 256,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        response = get_gemini_response(user_message)
        return jsonify(response)
    except Exception as e:
        logging.error(f"Error in chat endpoint: {e}")
        return jsonify({'error': f'Error communicating with Gemini AI: {e}'}), 500

def get_gemini_response(message):
    try:
        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(message)
        response_text = response.text

        # You can optionally include selectors here, but will handle this in the extension
        return {'response': response_text}
    except Exception as e:
        logging.error(f"Error communicating with Gemini AI: {e}")
        raise e

if __name__ == '__main__':
    app.run(debug=True)
