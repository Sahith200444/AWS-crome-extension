from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
import logging

# Flask app setup
app = Flask(__name__)
CORS(app, resources={r"/chat": {"origins": "*"}})

# Secret key for session management
app.secret_key = 'abc3445'

# Declare Gemini API key directly (be cautious in production environments)
GEMINI_API_KEY = 'AIzaSyCuRIopGxIzAVTG-j-Ag2A4VwXHhSOKURY'

# Set up Google Generative AI SDK
genai.configure(api_key=GEMINI_API_KEY)

# Model configuration
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

# Predefined mapping of the question to CSS selectors
AWS_SELECTOR_MAPPING = {
    "Launch Instance": "a.awsui_trigger-button_sne0l_dwtkx_213"
}


# Set up logging
logging.basicConfig(level=logging.INFO)

@app.route('/chat', methods=['POST'])
def chat():
    # Parse the incoming message
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    # Generate a response using Gemini AI
    try:
        user_input = f"Provide instructions on how to launch an instance in AWS."
        response = get_gemini_response(user_input)
        return jsonify(response)
    except Exception as e:
        logging.error(f"Error in chat endpoint: {e}")
        return jsonify({'error': f'Error communicating with Gemini AI: {e}'}), 500

def get_gemini_response(message):
    try:
        # Initialize a chat session
        chat_session = model.start_chat(history=[])

        # Send the message and get the response
        response = chat_session.send_message(message)
        response_text = response.text

        # Map the selector for the keyword "Launch Instance"
        selector = AWS_SELECTOR_MAPPING.get("Launch Instance", None)

        # Return both the response text and the matched selector
        return {
            'response': response_text,
            'selector': selector
        }
    except Exception as e:
        logging.error(f"Error communicating with Gemini AI: {e}")
        raise e

if __name__ == '__main__':
    app.run(debug=True)
