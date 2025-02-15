(function () {
    if (document.getElementById('aws-ai-chatbot')) return;
 
    const aiButton = document.createElement('button');
    aiButton.id = 'aws-ai-chatbot';
    aiButton.textContent = 'AI';
    aiButton.style.position = 'fixed';
    aiButton.style.bottom = '20px';
    aiButton.style.right = '20px';
    aiButton.style.backgroundColor = '#007bff';
    aiButton.style.color = 'white';
    aiButton.style.border = 'none';
    aiButton.style.padding = '10px 15px';
    aiButton.style.borderRadius = '50px';
    aiButton.style.fontSize = '16px';
    aiButton.style.cursor = 'pointer';
    aiButton.style.zIndex = '9999';
    aiButton.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    aiButton.addEventListener('click', toggleChatbot);
  
    document.body.appendChild(aiButton);
  
    // Restore chatbot state if it was open
    if (sessionStorage.getItem('awsChatbotOpen') === 'true') {
        createChatbox();
    }
  
    function toggleChatbot() {
        let chatbox = document.getElementById('aws-ai-chatbox');
        if (chatbox) {
            chatbox.style.display = 'block';
            sessionStorage.setItem('awsChatbotOpen', 'true');
            return;
        }
  
        createChatbox();
        sessionStorage.setItem('awsChatbotOpen', 'true');
    }
  
    function createChatbox() {
        let chatbox = document.createElement('div');
        chatbox.id = 'aws-ai-chatbox';
        chatbox.style.position = 'fixed';
        chatbox.style.bottom = '80px';
        chatbox.style.right = '20px';
        chatbox.style.width = '350px';
        chatbox.style.height = '400px';
        chatbox.style.backgroundColor = 'white';
        chatbox.style.border = '1px solid #ccc';
        chatbox.style.borderRadius = '10px';
        chatbox.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        chatbox.style.zIndex = '9999';
        chatbox.style.padding = '10px';
        chatbox.style.fontFamily = 'Arial, sans-serif';
        chatbox.style.display = 'flex';
        chatbox.style.flexDirection = 'column';
  
        // Chatbox Header
        const header = document.createElement('div');
        header.textContent = 'AI Chatbot';
        header.style.backgroundColor = '#007bff';
        header.style.color = 'white';
        header.style.padding = '10px';
        header.style.textAlign = 'center';
        header.style.fontSize = '16px';
        header.style.fontWeight = 'bold';
        header.style.borderTopLeftRadius = '10px';
        header.style.borderTopRightRadius = '10px';
        header.style.position = 'relative';
  
        // Close Button
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '10px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = 'white';
        closeButton.style.fontSize = '18px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            chatbox.style.display = 'none';
            sessionStorage.setItem('awsChatbotOpen', 'false');
        });
  
        // Chat Area
        const chatArea = document.createElement('div');
        chatArea.id = 'chat-area';
        chatArea.style.flexGrow = '1';
        chatArea.style.overflowY = 'auto';
        chatArea.style.padding = '10px';
        chatArea.style.borderBottom = '1px solid #ccc';
        chatArea.style.backgroundColor = '#f9f9f9';
  
        // Restore chat history
        const chatHistory = JSON.parse(sessionStorage.getItem('chatHistory') || '[]');
        chatHistory.forEach(msg => {
            appendMessage(chatArea, msg.text, msg.sender);
        });
  
        // Input Container
        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.padding = '5px';
  
        // Input Field
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.id = 'chat-input';
        inputField.placeholder = 'Ask something...';
        inputField.style.flex = '1';
        inputField.style.padding = '10px';
        inputField.style.border = '1px solid #ccc';
        inputField.style.borderRadius = '5px';
  
        // Send Button
        const sendButton = document.createElement('button');
        sendButton.textContent = 'Send';
        sendButton.style.marginLeft = '5px';
        sendButton.style.padding = '10px';
        sendButton.style.backgroundColor = '#007bff';
        sendButton.style.color = 'white';
        sendButton.style.border = 'none';
        sendButton.style.cursor = 'pointer';
        sendButton.style.borderRadius = '5px';
  
        sendButton.addEventListener('click', () => sendMessage(inputField, chatArea));
  
        inputContainer.appendChild(inputField);
        inputContainer.appendChild(sendButton);
  
        header.appendChild(closeButton);
        chatbox.appendChild(header);
        chatbox.appendChild(chatArea);
        chatbox.appendChild(inputContainer);
        document.body.appendChild(chatbox);
    }
  
    async function sendMessage(inputField, chatArea) {
        const message = inputField.value.trim();
        if (!message) return;
  
        appendMessage(chatArea, `<b>You:</b> ${message}`, 'user');
        saveMessage(`<b>You:</b> ${message}`, 'user');
  
        inputField.value = ''; // Clear input field
        chatArea.scrollTop = chatArea.scrollHeight;
  
        try {
            // Include page_context (the current URL) in the payload along with the message
            const response = await fetch('https://chatbott-tb2p.onrender.com/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  message,
                  page_context: window.location.href 
                })
            });
  
            const data = await response.json();
            const botMessage = cleanResponse(data.response || 'No response');
            appendMessage(chatArea, botMessage, 'bot');
            saveMessage(botMessage, 'bot');
        } catch (error) {
            console.error("Error fetching chatbot response:", error);
            const errorMessage = `<span style="color:red;">AI: Failed to get a response.</span>`;
            appendMessage(chatArea, errorMessage, 'bot');
            saveMessage(errorMessage, 'bot');
        }
    }
  
    function appendMessage(chatArea, text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = text;
        messageDiv.style.margin = '8px 0';
        messageDiv.style.padding = '6px';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.maxWidth = '90%';
        messageDiv.style.wordWrap = 'break-word';
  
        if (sender === 'bot') {
            messageDiv.style.backgroundColor = '#e3f2fd';
            messageDiv.style.color = '#007bff';
        } else {
            messageDiv.style.backgroundColor = '#d1e7dd';
            messageDiv.style.color = '#0a58ca';
            messageDiv.style.fontWeight = 'bold';
        }
  
        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }
  
    function saveMessage(text, sender) {
        let chatHistory = JSON.parse(sessionStorage.getItem('chatHistory') || '[]');
        chatHistory.push({ text, sender });
        sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  
    function cleanResponse(response) {
        return response.replace(/^\*+|\*+$/gm, ''); // Remove asterisks at start & end of each line
    }
  })();
  
