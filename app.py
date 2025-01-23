from flask import Flask, render_template, request, jsonify
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

# Predefined mapping of AWS actions to CSS selectors
AWS_SELECTOR_MAPPING = {
    "EC2": "#ec2-dashboard-link",
    "S3": "#s3-dashboard-link",
    "Create Instance": "#create-instance-button",
    "Launch Instance": "#launch-instance-btn",
    "IAM": "#iam-service-link",
    "CloudWatch": "#cloudwatch-dashboard-link",
    "RDS": "#rds-dashboard-link",
    "Billing": "#billing-dashboard-link",
}

# Set up logging
logging.basicConfig(level=logging.INFO)

@app.route('/')
def index():
    return render_template('chatbot.html')

@app.route('/chat', methods=['POST'])
def chat():
    # Parse the incoming message
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    # Generate a response using Gemini AI
    try:
        response = get_gemini_response(user_message)
        return jsonify(response)
    except Exception as e:
        logging.error(f"Error in chat endpoint: {e}")
        return jsonify({'error': f'Error communicating with Gemini AI: {e}'}), 500

def get_gemini_response(message):
    try:
        # Prepare the user input
        user_input = f"You are an AWS Cloud Navigator in the AWS Console chatbot. Respond to the following message: {message}"
        
        # Initialize a chat session
        chat_session = model.start_chat(history=[])
        
        # Send the message and get the response
        response = chat_session.send_message(user_input)
        response_text = response.text

        # Match keywords in the response to the predefined selector mapping
        selector = None
        for keyword, css_selector in AWS_SELECTOR_MAPPING.items():
            if keyword.lower() in response_text.lower():
                selector = css_selector
                break

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
