document.getElementById('send').addEventListener('click', async () => {
  const responseDiv = document.getElementById('response');
  const loadingDiv = document.getElementById('loading');

  responseDiv.textContent = ""; // Clear previous response
  loadingDiv.style.display = 'block';  // Show loading animation

  try {
      const response = await fetch('https://chatbott-tb2p.onrender.com/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: document.getElementById('user-input').value })
      });

      if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      loadingDiv.style.display = 'none'; // Hide loading animation
      responseDiv.textContent = data.response;

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
              chrome.scripting.executeScript({
                  target: { tabId: tabs[0].id },
                  files: ["content.js"]
              }, () => {
                  chrome.tabs.sendMessage(tabs[0].id, {
                      action: 'showInstruction',
                      selector: '.awsui_content_vjswe_11jth_149', 
                      instructionText: 'Click here to launch an instance in AWS.'
                  });
              });
          } else {
              console.error("No active tab found.");
          }
      });

  } catch (error) {
      loadingDiv.style.display = 'none';
      console.error("Error in popup.js:", error);
      responseDiv.textContent = `Error: ${error.message}`;
  }
});
