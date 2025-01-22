from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
# Secret key for session management
app.secret_key = 'abc3445'  # You can directly declare it here

# Directly declare your Gemini API key here
GEMINI_API_KEY = 'AIzaSyCuRIopGxIzAVTG-j-Ag2A4VwXHhSOKURY'

# Set up Google Generative AI SDK
genai.configure(api_key=GEMINI_API_KEY)

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

@app.route('/')
def index():
    return render_template('chatbot.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    response = get_gemini_response(user_message)
    return jsonify(response)

def get_gemini_response(message):
    try:
        user_input = "You are a AWS Cloud Navigator in the AWS Console chatbot. Respond to the following message: " + message
        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(user_input)
        return {'response': response.text}
    except Exception as e:
        return {'error': f'Error communicating with Gemini AI: {e}'}

if __name__ == '__main__':
    app.run(debug=True)
