# TODO: Add AI Chatbot Icon and Backend Functionality

## Frontend Changes
- [ ] Add chatbot icon HTML element to frontend/index.html before the WhatsApp link
- [ ] Add CSS styles for the chatbot floating button in frontend/styles.css (position left of WhatsApp)
- [ ] Verify chatbot modal and sendMessage function in frontend/script.js works with new backend

## Backend Changes
- [ ] Add googleapis dependency to backend/package.json
- [ ] Implement /api/chatbot POST route in backend/app.js using Google Custom Search API
- [ ] Handle API key and CSE ID securely (use environment variables)

## Testing
- [ ] Test chatbot functionality by sending questions and verifying responses
- [ ] Ensure icon is positioned correctly left of WhatsApp
- [ ] Run backend and frontend to verify integration
