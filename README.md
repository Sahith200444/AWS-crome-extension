

# AWS Chatbot Navigator Chrome Extension

This project aims to develop a Chrome extension that enhances the AWS Management Console experience. By integrating a chatbot powered by the Gemini API, the extension provides users with step-by-step guidance on navigating AWS services through intuitive arrow-based navigation. For example, when a user asks "How do I launch an instance?", the chatbot responds by highlighting the relevant buttons and displaying arrows to direct the user through the process.

## Features

- **Chatbot Integration:**  
  Utilizes a Flask backend and the Gemini API to generate concise, bullet-point responses to AWS-related queries.

- **Arrow-Based Navigation:**  
  Guides users by highlighting specific AWS console elements and overlaying arrows to indicate the correct navigation path.

- **AWS-Focused Assistance:**  
  Tailored for tasks like launching instances, configuring services, and more, ensuring users receive clear, actionable steps.

- **Deployment on Render:**  
  The backend is deployed on [Render](https://render.com) for live testing and demonstration purposes.

## Current Status

This project is **in progress**—the core functionality is more than halfway complete. Ongoing work includes further integration with the AWS Management Console and refining the arrow-based navigation system.

## Getting Started
Below is an updated section for your README that includes instructions for adding an icon if one isn’t already present:

---

### How to Use the Chrome Extension

1. **Clone or Download the Repository:**
   - Clone the repository using:
     ```bash
     git clone https://github.com/yourusername/your-repo.git
     ```
   - Alternatively, download the ZIP file and extract it.

2. **Prepare the Chrome Extension Folder:**
   - Navigate to the `chrome-extension` folder within the repository.
   - **Note:** This folder is expected to include an icon (e.g., `icon.png`) for the extension. If the icon is missing:
     - Choose or create an icon image (recommended size: 128x128 pixels).
     - Save the icon file in the `chrome-extension` folder.
     - Update the `manifest.json` file (if necessary) to reference the icon file. For example:
       ```json
       "icons": {
         "128": "icon.png"
       }
       ```

3. **Load the Extension in Google Chrome:**
   - Open Google Chrome and navigate to `chrome://extensions`.
   - Enable **Developer mode** by toggling the switch in the top-right corner.
   - Click the **"Load unpacked"** button.
   - In the file dialog, select the `chrome-extension` folder from your local copy of the repository.

4. **Using the Extension:**
   - Once loaded, the extension will appear in your list of installed extensions.
   - Click on the extension icon to activate it and begin using its AWS navigation features.

---

This guide should help users set up the Chrome extension, including the necessary step of adding an icon if it’s not already provided in the repository.

### Prerequisites

- Python 3.x
- Flask
- `google-generativeai` package
- Other dependencies listed in `requirements.txt`


## How It Works

1. **User Interaction:**  
   A user on the AWS Management Console activates the extension and asks a question (e.g., "How do I launch an instance?").

2. **API Request:**  
   The extension sends the user's query and context (current AWS page URL) to the Flask backend.

3. **Response Generation:**  
   The backend constructs a prompt—including a pre-defined guide for AWS navigation—and sends it to the Gemini API.  
   The API responds with a step-by-step guide in bullet points.

4. **Navigation Assistance:**  
   The extension interprets the response to highlight relevant buttons on the AWS console and overlays arrows to direct the user through the process.

## Contributing

Contributions to improve functionality or add new features are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or suggestions, please reach out at [your.email@example.com].

---

This README provides an overview of your project, its current status, and how to get started, ensuring potential collaborators or users understand the purpose and functionality of your AWS Chatbot Navigator Chrome Extension.
