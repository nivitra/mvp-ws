// Workshop Management Platform JavaScript

// Application data
const workshopData = {
  workshop: {
    title: "Advanced React Development Workshop",
    instructor: "Dr. Sarah Johnson",
    duration: "4 hours",
    attendees: 347,
    status: "live"
  },
  participants: [
    {id: 1, name: "Alex Chen", status: "active", progress: 75, joinTime: "09:15", location: "San Francisco"},
    {id: 2, name: "Maria Rodriguez", status: "active", progress: 82, joinTime: "09:02", location: "Madrid"},
    {id: 3, name: "James Wilson", status: "idle", progress: 45, joinTime: "09:30", location: "London"},
    {id: 4, name: "Lisa Park", status: "active", progress: 91, joinTime: "08:58", location: "Seoul"},
    {id: 5, name: "Ahmed Hassan", status: "active", progress: 67, joinTime: "09:12", location: "Cairo"},
    {id: 6, name: "Sophie Martin", status: "active", progress: 78, joinTime: "09:05", location: "Paris"},
    {id: 7, name: "David Kim", status: "idle", progress: 52, joinTime: "09:25", location: "Tokyo"},
    {id: 8, name: "Anna Petrov", status: "active", progress: 89, joinTime: "09:01", location: "Moscow"}
  ],
  modules: [
    {id: 1, title: "Introduction to React Hooks", completed: true, duration: "45 min", materials: ["video", "pdf", "quiz"]},
    {id: 2, title: "State Management with Redux", completed: true, duration: "60 min", materials: ["video", "presentation", "exercises"]},
    {id: 3, title: "Advanced Component Patterns", completed: false, current: true, duration: "50 min", materials: ["video", "code-examples"]},
    {id: 4, title: "Testing React Applications", completed: false, duration: "40 min", materials: ["video", "lab", "resources"]},
    {id: 5, title: "Performance Optimization", completed: false, duration: "35 min", materials: ["presentation", "demo", "quiz"]}
  ],
  chatbotResponses: {
    greeting: "Hello! I'm your workshop AI assistant. I can help you with questions about React development, current module content, or technical issues. What would you like to know?",
    "react hooks": "React Hooks allow you to use state and other React features without writing a class. The most commonly used hooks are useState for state management and useEffect for side effects.",
    "redux": "Redux is a predictable state container for JavaScript apps. It helps you manage application state in a centralized way, making it easier to track changes and debug.",
    "testing": "Testing React applications typically involves unit tests for components, integration tests for user flows, and end-to-end tests. Popular tools include Jest, React Testing Library, and Cypress.",
    "performance": "React performance can be optimized using techniques like memoization (React.memo, useMemo, useCallback), code splitting, lazy loading, and proper component structure.",
    "hooks": "React Hooks allow you to use state and other React features without writing a class. They were introduced in React 16.8 and have become the standard way to write React components.",
    "state": "State management in React can be handled locally with useState or globally with solutions like Redux, Context API, or Zustand. Choose based on your application's complexity.",
    "components": "Advanced component patterns include Higher-Order Components (HOCs), Render Props, Compound Components, and Custom Hooks. Each serves different use cases for component composition."
  },
  liveSummary: [
    "• Covered useState and useEffect hooks with practical examples",
    "• Discussed common pitfalls in hook usage and how to avoid them",
    "• Implemented custom hooks for reusable logic",
    "• Q&A session addressed dependency arrays in useEffect",
    "• Live coding demonstration of hook composition patterns"
  ]
};

// Application state
let currentSection = 'dashboard';
let currentStep = 1;
let chatbotCollapsed = true;
let isDarkMode = false;

// DOM elements
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
const themeToggle = document.getElementById('themeToggle');
const chatbot = document.getElementById('chatbot');
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotHeader = document.getElementById('chatbotHeader');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendMessage');
const modal = document.getElementById('successModal');
const modalMessage = document.getElementById('modalMessage');
const modalOk = document.getElementById('modalOk');
const modalClose = document.querySelector('.modal-close');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Workshop Management Platform...');
  initializeNavigation();
  initializeRegistration();
  initializeContent();
  initializeChatbot();
  initializeTracking();
  initializeFeedback();
  initializeRealTimeUpdates();
  initializeThemeToggle();
  initializeModals();
  
  // Collapse chatbot initially
  chatbot.classList.add('collapsed');
  
  // Ensure tracking data is loaded
  setTimeout(() => {
    if (document.getElementById('participantsList')) {
      renderParticipants();
    }
  }, 100);
});

// Navigation functionality
function initializeNavigation() {
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const targetSection = this.dataset.section;
      switchSection(targetSection);
      
      // Update active nav item
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function switchSection(sectionName) {
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  const targetSection = document.getElementById(sectionName);
  if (targetSection) {
    targetSection.classList.add('active');
    currentSection = sectionName;
    
    // Initialize section-specific functionality
    if (sectionName === 'tracking') {
      setTimeout(() => renderParticipants(), 50);
    } else if (sectionName === 'content') {
      setTimeout(() => renderModules(), 50);
    }
  }
}

// Registration functionality
function initializeRegistration() {
  const nextButton = document.getElementById('nextStep');
  const prevButton = document.getElementById('prevStep');
  const submitButton = document.getElementById('submitRegistration');
  const resendButton = document.getElementById('resendCode');
  
  if (nextButton) {
    nextButton.addEventListener('click', function() {
      if (validateCurrentStep()) {
        if (currentStep < 3) {
          currentStep++;
          updateRegistrationStep();
        }
      }
    });
  }
  
  if (prevButton) {
    prevButton.addEventListener('click', function() {
      if (currentStep > 1) {
        currentStep--;
        updateRegistrationStep();
      }
    });
  }
  
  if (submitButton) {
    submitButton.addEventListener('click', function(e) {
      e.preventDefault();
      if (validateCurrentStep()) {
        showModal('Registration completed successfully! Welcome to the workshop.');
        // Reset form
        currentStep = 1;
        updateRegistrationStep();
        document.getElementById('registrationForm').reset();
      }
    });
  }
  
  if (resendButton) {
    resendButton.addEventListener('click', function() {
      showModal('Verification code resent to your email address.');
    });
  }
  
  // Form validation
  const formInputs = document.querySelectorAll('#registrationForm input, #registrationForm select');
  formInputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearFieldError);
  });
}

function updateRegistrationStep() {
  // Update progress steps
  const steps = document.querySelectorAll('.step');
  steps.forEach((step, index) => {
    if (index + 1 <= currentStep) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });
  
  // Update form steps
  const formSteps = document.querySelectorAll('.form-step');
  formSteps.forEach((step, index) => {
    if (index + 1 === currentStep) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });
  
  // Update buttons
  const nextButton = document.getElementById('nextStep');
  const prevButton = document.getElementById('prevStep');
  const submitButton = document.getElementById('submitRegistration');
  
  if (prevButton) prevButton.style.display = currentStep > 1 ? 'block' : 'none';
  
  if (currentStep === 3) {
    if (nextButton) nextButton.style.display = 'none';
    if (submitButton) submitButton.style.display = 'block';
  } else {
    if (nextButton) nextButton.style.display = 'block';
    if (submitButton) submitButton.style.display = 'none';
  }
}

function validateCurrentStep() {
  const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  if (!currentFormStep) return true;
  
  const requiredInputs = currentFormStep.querySelectorAll('input[required], select[required]');
  let isValid = true;
  
  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      showFieldError(input, 'This field is required');
      isValid = false;
    }
  });
  
  // Email validation
  if (currentStep === 1) {
    const emailInput = currentFormStep.querySelector('input[type="email"]');
    if (emailInput && emailInput.value && !isValidEmail(emailInput.value)) {
      showFieldError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }
  }
  
  // Verification code validation
  if (currentStep === 3) {
    const codeInput = currentFormStep.querySelector('input[name="verificationCode"]');
    if (codeInput && codeInput.value && codeInput.value.length !== 6) {
      showFieldError(codeInput, 'Verification code must be 6 digits');
      isValid = false;
    }
  }
  
  return isValid;
}

function validateField(event) {
  const input = event.target;
  clearFieldError(input);
  
  if (input.hasAttribute('required') && !input.value.trim()) {
    showFieldError(input, 'This field is required');
    return false;
  }
  
  if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
    showFieldError(input, 'Please enter a valid email address');
    return false;
  }
  
  return true;
}

function showFieldError(input, message) {
  clearFieldError(input);
  input.style.borderColor = 'var(--color-error)';
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.style.color = 'var(--color-error)';
  errorDiv.style.fontSize = 'var(--font-size-sm)';
  errorDiv.style.marginTop = 'var(--space-4)';
  errorDiv.textContent = message;
  
  input.parentNode.appendChild(errorDiv);
}

function clearFieldError(input) {
  if (!input) return;
  input.style.borderColor = '';
  const errorDiv = input.parentNode.querySelector('.field-error');
  if (errorDiv) {
    errorDiv.remove();
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Content functionality
function initializeContent() {
  renderModules();
}

function renderModules() {
  const modulesList = document.getElementById('modulesList');
  if (!modulesList) return;
  
  modulesList.innerHTML = '';
  
  workshopData.modules.forEach(module => {
    const moduleElement = document.createElement('div');
    moduleElement.className = `module-item ${module.completed ? 'completed' : ''} ${module.current ? 'active' : ''}`;
    
    moduleElement.innerHTML = `
      <div class="module-title">${module.title}</div>
      <div class="module-meta">${module.duration} • ${module.materials.length} materials</div>
    `;
    
    moduleElement.addEventListener('click', function() {
      selectModule(module);
    });
    
    modulesList.appendChild(moduleElement);
  });
}

function selectModule(module) {
  // Update active module
  document.querySelectorAll('.module-item').forEach(item => {
    item.classList.remove('active');
  });
  event.target.closest('.module-item').classList.add('active');
  
  // Update current module display
  const currentModule = document.getElementById('currentModule');
  if (!currentModule) return;
  
  const materialsHtml = module.materials.map(material => {
    const icons = {
      video: '📹',
      pdf: '📄',
      presentation: '📊',
      quiz: '❓',
      exercises: '💻',
      'code-examples': '💻',
      lab: '🧪',
      resources: '📚',
      demo: '🎯'
    };
    
    return `
      <div class="material-item">
        <div class="material-icon">${icons[material] || '📄'}</div>
        <div class="material-info">
          <div class="material-title">${material.charAt(0).toUpperCase() + material.slice(1).replace('-', ' ')}</div>
          <div class="material-meta">Interactive content</div>
        </div>
      </div>
    `;
  }).join('');
  
  const progress = module.completed ? 100 : (module.current ? 45 : 0);
  
  currentModule.innerHTML = `
    <h3>${module.title}</h3>
    <p>Duration: ${module.duration}</p>
    
    <div class="module-materials">
      <h4>Materials</h4>
      <div class="materials-grid">
        ${materialsHtml}
      </div>
    </div>
    
    <div class="module-progress">
      <div class="progress-info">
        <span>Progress: ${progress}%</span>
        <span>${progress === 100 ? 'Completed' : `${Math.ceil((100 - progress) / 2)} min remaining`}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
    </div>
  `;
}

// Chatbot functionality
function initializeChatbot() {
  if (chatbotHeader) {
    chatbotHeader.addEventListener('click', toggleChatbot);
  }
  if (chatbotToggle) {
    chatbotToggle.addEventListener('click', toggleChatbot);
  }
  if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
  }
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
}

function toggleChatbot() {
  chatbotCollapsed = !chatbotCollapsed;
  if (chatbotCollapsed) {
    chatbot.classList.add('collapsed');
  } else {
    chatbot.classList.remove('collapsed');
  }
}

function sendMessage() {
  if (!chatInput) return;
  
  const message = chatInput.value.trim();
  if (!message) return;
  
  // Add user message
  addChatMessage(message, 'user');
  chatInput.value = '';
  
  // Show typing indicator
  showTypingIndicator();
  
  // Simulate AI response
  setTimeout(() => {
    hideTypingIndicator();
    const response = getAIResponse(message);
    addChatMessage(response, 'bot');
  }, 1000 + Math.random() * 2000);
}

function addChatMessage(message, sender) {
  if (!chatMessages) return;
  
  const messageElement = document.createElement('div');
  messageElement.className = `message ${sender}-message`;
  messageElement.innerHTML = `<div class="message-content">${message}</div>`;
  
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  if (!chatMessages) return;
  
  const typingElement = document.createElement('div');
  typingElement.className = 'typing-indicator';
  typingElement.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  
  chatMessages.appendChild(typingElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
  if (!chatMessages) return;
  
  const typingIndicator = chatMessages.querySelector('.typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function getAIResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for keywords in the message
  for (const [keyword, response] of Object.entries(workshopData.chatbotResponses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }
  
  // Context-aware responses based on current section
  if (currentSection === 'content') {
    return "I can help you with the current module content. Are you having trouble with any specific concept in Advanced Component Patterns?";
  } else if (currentSection === 'registration') {
    return "I'm here to help with the registration process. Do you need assistance with any of the form fields?";
  } else if (currentSection === 'tracking') {
    return "I can explain the participant tracking features. What would you like to know about the analytics dashboard?";
  }
  
  // Generic responses
  const genericResponses = [
    "That's an interesting question! Could you be more specific about what you'd like to know?",
    "I'm here to help with React development topics and workshop content. What specific area would you like to explore?",
    "Let me help you with that. Could you provide more details about what you're trying to achieve?",
    "I can assist with React hooks, state management, testing, and performance optimization. What's your question?"
  ];
  
  return genericResponses[Math.floor(Math.random() * genericResponses.length)];
}

// Tracking functionality
function initializeTracking() {
  console.log('Initializing tracking functionality...');
  renderParticipants();
}

function renderParticipants() {
  const participantsList = document.getElementById('participantsList');
  const participantCount = document.getElementById('participantCount');
  
  console.log('Rendering participants...', { participantsList, participantCount });
  
  if (participantCount) {
    participantCount.textContent = workshopData.participants.length;
  }
  
  if (!participantsList) {
    console.log('Participants list element not found');
    return;
  }
  
  participantsList.innerHTML = '';
  
  workshopData.participants.forEach(participant => {
    const participantElement = document.createElement('div');
    participantElement.className = 'participant-item';
    
    const statusClass = participant.status === 'active' ? 'success' : 'warning';
    
    participantElement.innerHTML = `
      <div class="participant-info">
        <div class="participant-name">${participant.name}</div>
        <div class="participant-location">${participant.location} • Joined ${participant.joinTime}</div>
      </div>
      <div class="participant-progress">
        <span class="status status--${statusClass}">${participant.status}</span>
        <span class="progress-text">${participant.progress}%</span>
      </div>
    `;
    
    participantsList.appendChild(participantElement);
  });
  
  console.log('Participants rendered:', participantsList.children.length);
}

// Feedback functionality
function initializeFeedback() {
  const feedbackForm = document.getElementById('feedbackForm');
  
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function(e) {
      e.preventDefault();
      showModal('Thank you for your feedback! Your responses have been recorded.');
      feedbackForm.reset();
    });
  }
  
  // Certificate download buttons
  const downloadButtons = document.querySelectorAll('.certificate-actions .btn');
  downloadButtons.forEach(button => {
    button.addEventListener('click', function() {
      const action = this.textContent.includes('Download') ? 'downloaded' : 'sent to your email';
      showModal(`Certificate ${action} successfully!`);
    });
  });
}

// Real-time updates
function initializeRealTimeUpdates() {
  // Update live participant count
  setInterval(() => {
    const liveCount = document.getElementById('liveCount');
    if (liveCount) {
      const currentCount = parseInt(liveCount.textContent);
      const change = Math.floor(Math.random() * 10) - 5; // -5 to +4
      const newCount = Math.max(300, Math.min(500, currentCount + change));
      liveCount.textContent = newCount;
      
      // Update participant count in tracking
      const participantCount = document.getElementById('participantCount');
      if (participantCount) {
        participantCount.textContent = newCount;
      }
    }
  }, 15000);
  
  // Update activity feed
  setInterval(() => {
    addNewActivity();
  }, 30000);
  
  // Update summarizer
  setInterval(() => {
    updateSummarizer();
  }, 45000);
  
  // Simulate participant progress updates
  setInterval(() => {
    updateParticipantProgress();
  }, 20000);
}

function addNewActivity() {
  const activities = [
    "New participant joined the workshop",
    "Module 3 completion rate increased to 75%",
    "Q&A session question submitted",
    "5 participants completed current exercise",
    "Live poll results updated",
    "Breakout room session started",
    "Resource download peak detected",
    "Engagement metric improved by 3%"
  ];
  
  const activityFeed = document.getElementById('activityFeed');
  if (!activityFeed) return;
  
  const newActivity = document.createElement('div');
  newActivity.className = 'activity-item';
  
  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  
  newActivity.innerHTML = `
    <span class="activity-time">Just now</span>
    <span class="activity-text">${randomActivity}</span>
  `;
  
  activityFeed.insertBefore(newActivity, activityFeed.firstChild);
  
  // Remove oldest activity if more than 5
  if (activityFeed.children.length > 5) {
    activityFeed.removeChild(activityFeed.lastChild);
  }
  
  // Update timestamps
  updateActivityTimestamps();
}

function updateActivityTimestamps() {
  const activityItems = document.querySelectorAll('.activity-item .activity-time');
  const times = ['Just now', '2 min ago', '5 min ago', '8 min ago', '12 min ago'];
  
  activityItems.forEach((item, index) => {
    if (index < times.length) {
      item.textContent = times[index];
    }
  });
}

function updateSummarizer() {
  const summaryPoints = [
    "• Demonstrated useCallback and useMemo optimization techniques",
    "• Covered React.memo for component memoization",
    "• Explained virtual DOM reconciliation process",
    "• Live coding session on custom hook patterns",
    "• Attendee question about useEffect cleanup functions answered",
    "• Performance profiling tools demonstration completed",
    "• Code splitting strategies with React.lazy discussed",
    "• Best practices for state management architecture shared"
  ];
  
  const summaryContent = document.getElementById('summaryContent');
  if (!summaryContent) return;
  
  const existingItems = summaryContent.children.length;
  
  if (existingItems < 8) {
    const newSummaryItem = document.createElement('div');
    newSummaryItem.className = 'summary-item';
    newSummaryItem.textContent = summaryPoints[existingItems];
    summaryContent.appendChild(newSummaryItem);
  }
}

function updateParticipantProgress() {
  // Randomly update a few participants' progress
  const participantsToUpdate = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < participantsToUpdate; i++) {
    const randomIndex = Math.floor(Math.random() * workshopData.participants.length);
    const participant = workshopData.participants[randomIndex];
    
    // Increase progress by 1-5%
    participant.progress = Math.min(100, participant.progress + Math.floor(Math.random() * 5) + 1);
    
    // Randomly change status
    if (Math.random() < 0.1) {
      participant.status = participant.status === 'active' ? 'idle' : 'active';
    }
  }
  
  // Re-render participants if on tracking section
  if (currentSection === 'tracking') {
    renderParticipants();
  }
}

// Theme toggle
function initializeThemeToggle() {
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      isDarkMode = !isDarkMode;
      document.documentElement.setAttribute('data-color-scheme', isDarkMode ? 'dark' : 'light');
      themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    });
  }
}

// Modal functionality
function initializeModals() {
  if (modalOk) {
    modalOk.addEventListener('click', hideModal);
  }
  if (modalClose) {
    modalClose.addEventListener('click', hideModal);
  }
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        hideModal();
      }
    });
  }
  
  // Export summary button
  const exportButton = document.getElementById('exportSummary');
  if (exportButton) {
    exportButton.addEventListener('click', function() {
      showModal('Summary exported successfully! Check your downloads folder.');
    });
  }
}

function showModal(message) {
  if (modalMessage && modal) {
    modalMessage.textContent = message;
    modal.classList.add('show');
  }
}

function hideModal() {
  if (modal) {
    modal.classList.remove('show');
  }
}

// Utility functions
function formatTime(date) {
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

function generateRandomId() {
  return Math.random().toString(36).substr(2, 9);
}

// Export functions for global access
window.switchSection = switchSection;
window.showModal = showModal;