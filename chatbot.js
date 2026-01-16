// Enhanced Chatbot Functionality (Left Side) with Smart Notifications
function initChatbot() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatbotForm = document.getElementById('chatbotForm');
    const sendMessage = document.getElementById('sendMessage');
    const quickReplyBtns = document.querySelectorAll('.quick-reply-btn');
    const quickSuggestions = document.getElementById('quickSuggestions');
    const chatbotNotification = document.getElementById('chatbotNotification');
    
    // Smart notification system
    let notificationCount = 0;
    let chatOpened = false;
    let lastUserActivity = Date.now();
    let autoMessageTimer = null;
    let notificationTimer = null;

    // AI Knowledge Base about Roni
    const knowledgeBase = {
        greeting: [
            "Hello! I'm Roni's AI assistant. I can tell you about his AI projects, skills, and experience.",
            "Hi there! I'm here to help you learn about Roni's work in AI and machine learning.",
            "Welcome! Ask me anything about Roni's AI engineering projects and skills."
        ],
        
        skills: [
            "Roni specializes in:",
            "• Machine Learning: Scikit-learn, Pandas, NumPy, Feature Engineering, XGBoost",
            "• Deep Learning: TensorFlow, PyTorch, Keras, Neural Networks, CNN/RNN",
            "• NLP: Transformers, BERT, spaCy, NLTK, HuggingFace",
            "• Computer Vision: OpenCV, YOLO, Image Processing",
            "• Deployment: FastAPI, Streamlit, Docker, AWS/GCP",
            "• Programming: Python, SQL, Git, Jupyter"
        ],
        
        projects: [
            "Here are Roni's key projects:",
            "1. **Laptop Price Prediction** - ML model with 92% accuracy using multiple algorithms",
            "2. **Fake News Detection** - NLP system with 96% accuracy using BERT embeddings",
            "3. **Computer Vision Projects** - Image recognition and object detection systems",
            "4. **Time Series Forecasting** - Predictive analytics for business metrics",
            "Check his GitHub for all projects: https://github.com/ronimahabub2021"
        ],
        
        experience: [
            "Roni's experience includes:",
            "• End-to-end AI project development",
            "• Teaching AI/ML concepts through hands-on projects",
            "• Production deployment of ML models",
            "• Data science instruction and mentorship",
            "• Kaggle competitions and contributions"
        ],
        
        contact: [
            "You can contact Roni through:",
            "• Email: ronimahabub2021@gmail.com",
            "• LinkedIn: https://bd.linkedin.com/in/ronimahabub",
            "• GitHub: https://github.com/ronimahabub2021",
            "• Kaggle: https://www.kaggle.com/ronimahabub21",
            "He's open to AI engineering roles and freelance projects!"
        ],
        
        education: [
            "Roni holds a Bachelor's degree in Computer Science.",
            "He focuses on practical, production-oriented AI engineering."
        ],
        
        ai_engineering: [
            "AI Engineering involves:",
            "• Building end-to-end ML systems from data to deployment",
            "• Creating scalable, production-ready AI solutions",
            "• Implementing MLOps practices for model management",
            "• Solving real-world problems with intelligent systems",
            "• Continuous learning and adaptation to new technologies"
        ],
        
        default: [
            "I'm not sure about that specific question. You can ask me about:",
            "• Roni's skills and technologies",
            "• His AI/ML projects",
            "• How to contact him",
            "• His experience in AI engineering",
            "• General AI/ML concepts"
        ]
    };

    // Chat history
    let chatHistory = [];
    let isTyping = false;

    // Initialize notification system
    function initNotificationSystem() {
        // Load notification count from localStorage
        const savedCount = localStorage.getItem('chatNotificationCount');
        if (savedCount) {
            notificationCount = parseInt(savedCount);
            updateNotification();
        }
        
        // Start auto-message timer
        startAutoMessageTimer();
        
        // Start notification timer for periodic checks
        startNotificationTimer();
    }

    // Update notification badge
    function updateNotification() {
        if (chatOpened) {
            // Chat is open - hide notification
            chatbotNotification.classList.add('hidden');
            notificationCount = 0;
            localStorage.setItem('chatNotificationCount', '0');
        } else if (notificationCount > 0) {
            // Show notification with count
            chatbotNotification.classList.remove('hidden');
            chatbotNotification.textContent = notificationCount > 9 ? '9+' : notificationCount.toString();
            
            // Add pulse animation for new notifications
            chatbotNotification.style.animation = 'badgePulse 2s infinite';
        } else {
            // No notifications - hide badge
            chatbotNotification.classList.add('hidden');
            chatbotNotification.style.animation = 'none';
        }
    }

    // Add notification
    function addNotification(message = null) {
        notificationCount++;
        localStorage.setItem('chatNotificationCount', notificationCount.toString());
        
        // Save notification message if provided
        if (message) {
            saveNotificationMessage(message);
        }
        
        updateNotification();
        
        // Add subtle sound effect (optional)
        playNotificationSound();
        
        // If this is the first notification, start a timer for follow-up
        if (notificationCount === 1) {
            startFollowUpTimer();
        }
    }

    // Play notification sound
    function playNotificationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            // Audio context not supported or user blocked it
            console.log('Audio notification not available');
        }
    }

    // Save notification message to localStorage
    function saveNotificationMessage(message) {
        const notifications = JSON.parse(localStorage.getItem('chatNotifications') || '[]');
        notifications.push({
            message: message,
            timestamp: new Date().toISOString(),
            read: false
        });
        localStorage.setItem('chatNotifications', JSON.stringify(notifications.slice(-10))); // Keep last 10
    }

    // Start auto-message timer
    function startAutoMessageTimer() {
        // Clear existing timer
        if (autoMessageTimer) clearTimeout(autoMessageTimer);
        
        // Set timer for auto-message (30-60 seconds randomly)
        const delay = 30000 + Math.random() * 30000;
        autoMessageTimer = setTimeout(() => {
            sendAutoMessage();
        }, delay);
    }

    // Send auto message when user is inactive
    function sendAutoMessage() {
        if (!chatbotWindow.classList.contains('active')) {
            const timeSinceActivity = Date.now() - lastUserActivity;
            
            // Only send if user has been inactive for 20+ seconds
            if (timeSinceActivity > 20000) {
                const autoMessages = [
                    "💡 Need help learning about AI? I'm here!",
                    "🤖 Ask me about Roni's machine learning projects",
                    "👋 Still there? I can help with AI questions",
                    "💬 Have questions about Roni's skills or experience?",
                    "🚀 Ready to explore AI engineering? Ask me anything!"
                ];
                
                const randomMessage = autoMessages[Math.floor(Math.random() * autoMessages.length)];
                addNotification(randomMessage);
            }
            
            // Restart timer
            startAutoMessageTimer();
        }
    }

    // Start notification timer for periodic checks
    function startNotificationTimer() {
        if (notificationTimer) clearInterval(notificationTimer);
        
        notificationTimer = setInterval(() => {
            // Check if user is on page and chatbot is closed
            if (!chatbotWindow.classList.contains('active')) {
                // 10% chance to send a notification reminder
                if (Math.random() < 0.1 && notificationCount === 0) {
                    const reminderMessages = [
                        "Have questions about AI engineering?",
                        "💬 I'm here to help you learn!",
                        "Ready to explore Roni's AI portfolio?"
                    ];
                    const randomMsg = reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
                    addNotification(randomMsg);
                }
            }
        }, 60000); // Check every minute
    }

    // Start follow-up timer for first-time users
    function startFollowUpTimer() {
        setTimeout(() => {
            if (notificationCount > 0 && !chatbotWindow.classList.contains('active')) {
                const followUpMessages = [
                    "New to AI? Let me guide you through Roni's expertise!",
                    "🤖 Don't miss out - I have AI insights to share!",
                    "💡 Your AI questions deserve answers - ask me anything!"
                ];
                const randomMsg = followUpMessages[Math.floor(Math.random() * followUpMessages.length)];
                addNotification(randomMsg);
            }
        }, 10000); // 10 seconds after first notification
    }

    // Track user activity
    function trackUserActivity() {
        lastUserActivity = Date.now();
        
        // Reset auto-message timer on user activity
        if (autoMessageTimer) {
            clearTimeout(autoMessageTimer);
            startAutoMessageTimer();
        }
    }

    // Initialize chatbot with welcome message
    function initChatbotMessages() {
        addWelcomeMessage();
        
        // Add initial greeting after a delay
        setTimeout(() => {
            addBotMessage(getRandomResponse('greeting'));
        }, 1000);
    }

    // Add welcome message
    function addWelcomeMessage() {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'welcome-message';
        welcomeDiv.innerHTML = `
            <h4>👋 Hi, I'm Roni's AI Assistant</h4>
            <p>Ask me about Roni's AI projects, skills, or experience. I can help you learn more about his work in machine learning and artificial intelligence.</p>
            <p style="margin-top: 10px; font-size: 12px; color: #6b7280;">
                <i class="fas fa-bell"></i> I'll notify you with helpful AI tips!
            </p>
        `;
        chatMessages.appendChild(welcomeDiv);
        scrollToBottom();
    }

    // Get random response from category
    function getRandomResponse(category) {
        const responses = knowledgeBase[category] || knowledgeBase.default;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Process user message and generate response
    function processMessage(message) {
        message = message.toLowerCase().trim();
        
        // Check for keywords and respond accordingly
        if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
            return getRandomResponse('greeting');
        } else if (message.includes('skill') || message.includes('tech') || message.includes('language')) {
            return knowledgeBase.skills.join('\n');
        } else if (message.includes('project') || message.includes('work') || message.includes('github')) {
            return knowledgeBase.projects.join('\n');
        } else if (message.includes('experience') || message.includes('background') || message.includes('job')) {
            return knowledgeBase.experience.join('\n');
        } else if (message.includes('contact') || message.includes('email') || message.includes('linkedin') || message.includes('hire')) {
            return knowledgeBase.contact.join('\n');
        } else if (message.includes('educat') || message.includes('degree') || message.includes('study')) {
            return knowledgeBase.education.join('\n');
        } else if (message.includes('ai') || message.includes('machine learning') || message.includes('deep learning')) {
            return knowledgeBase.ai_engineering.join('\n');
        } else if (message.includes('roni') || message.includes('yourself') || message.includes('who are you')) {
            return "I'm Roni's AI assistant, trained to answer questions about his AI engineering work. I can tell you about his projects, skills, and experience in machine learning.";
        } else {
            // Use AI-like response for other queries
            return generateAIResponse(message);
        }
    }

    // Generate more intelligent responses
    function generateAIResponse(message) {
        const responses = [
            "Based on Roni's portfolio, he specializes in end-to-end AI solutions from concept to deployment.",
            "Roni focuses on practical AI engineering with production-ready systems and measurable business impact.",
            "From his projects, I can see Roni works with modern ML frameworks and cloud deployment technologies.",
            "Roni's approach involves solving real-world problems with cutting-edge AI technologies and scalable architectures.",
            "Looking at his work, Roni emphasizes clean code, thorough documentation, and production-grade ML systems."
        ];
        
        // Add some contextual awareness
        if (message.includes('resume') || message.includes('cv')) {
            return "You can download Roni's ATS-friendly resume from the Resume section above. It highlights his end-to-end AI project experience and production deployment skills.";
        } else if (message.includes('hire') || message.includes('job') || message.includes('opportunity')) {
            return "Roni is open to AI engineering roles, ML Ops positions, and freelance projects. You can contact him via email or LinkedIn for opportunities.";
        } else if (message.includes('rate') || message.includes('price') || message.includes('cost')) {
            return "For project rates and pricing, please contact Roni directly via email with your specific requirements.";
        } else {
            return responses[Math.floor(Math.random() * responses.length)] + "\n\nIs there anything specific about Roni's work you'd like to know?";
        }
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        // Format text with line breaks and basic markdown
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: inherit; text-decoration: underline;">$1</a>');
        
        messageDiv.innerHTML = formattedText;
        
        // Add avatar for bot messages
        if (sender === 'bot') {
            const containerDiv = document.createElement('div');
            containerDiv.className = 'message-with-avatar';
            containerDiv.innerHTML = `
                <div class="chatbot-avatar">
                    <i class="fas fa-robot"></i>
                </div>
            `;
            containerDiv.appendChild(messageDiv);
            chatMessages.appendChild(containerDiv);
        } else {
            chatMessages.appendChild(messageDiv);
        }
        
        // Add to history
        chatHistory.push({ text, sender, timestamp: new Date().toISOString() });
        
        scrollToBottom();
    }

    // Add typing indicator
    function addTypingIndicator() {
        if (isTyping) return;
        
        isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="chatbot-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        isTyping = false;
    }

    // Simulate typing delay
    function simulateTyping(response, callback) {
        addTypingIndicator();
        
        // Calculate typing delay based on response length
        const typingDelay = Math.min(Math.max(response.length * 20, 1000), 3000);
        
        setTimeout(() => {
            removeTypingIndicator();
            callback(response);
        }, typingDelay);
    }

    // Handle user message
    function handleUserMessage(message) {
        if (!message.trim()) return;
        
        // Track user activity
        trackUserActivity();
        
        // Add user message
        addMessage(message, 'user');
        
        // Disable input during processing
        chatInput.disabled = true;
        sendMessage.disabled = true;
        
        // Simulate AI processing
        simulateTyping(message, (userMessage) => {
            const response = processMessage(userMessage);
            addMessage(response, 'bot');
            
            // Re-enable input
            chatInput.disabled = false;
            sendMessage.disabled = false;
            chatInput.focus();
            
            // Update quick suggestions based on conversation
            updateQuickSuggestions(userMessage);
        });
    }

    // Update quick suggestions
    function updateQuickSuggestions(lastMessage) {
        const lastMsg = lastMessage.toLowerCase();
        let suggestions = [];
        
        if (lastMsg.includes('project') || lastMsg.includes('work')) {
            suggestions = ['Tell me more about the tech stack', 'How were these projects deployed?', 'Any NLP projects?'];
        } else if (lastMsg.includes('skill') || lastMsg.includes('tech')) {
            suggestions = ['What about deep learning skills?', 'Deployment experience?', 'Kaggle experience?'];
        } else if (lastMsg.includes('contact') || lastMsg.includes('hire')) {
            suggestions = ['What types of projects?', 'Availability?', 'Rates?'];
        } else {
            suggestions = ['AI engineering approach?', 'Teaching experience?', 'Current focus?'];
        }
        
        // Update quick reply buttons
        const quickRepliesDiv = quickSuggestions.querySelector('.quick-replies');
        quickRepliesDiv.innerHTML = suggestions
            .map(suggestion => `<button class="quick-reply-btn" data-question="${suggestion}">${suggestion}</button>`)
            .join('');
        
        // Reattach event listeners
        document.querySelectorAll('.quick-reply-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                handleUserMessage(this.getAttribute('data-question'));
            });
        });
    }

    // Scroll to bottom of chat
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Toggle chatbot window
    function toggleChatbot() {
        chatbotWindow.classList.toggle('active');
        chatOpened = chatbotWindow.classList.contains('active');
        
        if (chatOpened) {
            // Reset notification count when chat is opened
            notificationCount = 0;
            updateNotification();
            
            chatInput.focus();
            scrollToBottom();
            
            // Track opening as user activity
            trackUserActivity();
        }
    }

    // Event Listeners
    chatbotToggle.addEventListener('click', toggleChatbot);
    
    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
        chatOpened = false;
    });

    chatbotForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message) {
            handleUserMessage(message);
            chatInput.value = '';
        }
    });

    // Quick reply buttons
    quickReplyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            handleUserMessage(this.getAttribute('data-question'));
        });
    });

    // Handle Enter key (but allow Shift+Enter for new line)
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatbotForm.dispatchEvent(new Event('submit'));
        }
        
        // Track keyboard activity
        trackUserActivity();
    });

    // Track mouse activity
    document.addEventListener('mousemove', trackUserActivity);
    document.addEventListener('click', trackUserActivity);
    document.addEventListener('scroll', trackUserActivity);

    // Auto-open chatbot on specific actions
    function autoOpenChatbot() {
        // Open chatbot when clicking on certain sections
        document.querySelectorAll('a[href="#contact"], a[href="#projects"]').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => {
                    if (!chatbotWindow.classList.contains('active')) {
                        // Add notification instead of auto-opening
                        const contextMessages = {
                            '#contact': "Need help contacting Roni? I can guide you!",
                            '#projects': "Interested in Roni's projects? Ask me for details!"
                        };
                        
                        const message = contextMessages[link.getAttribute('href')];
                        if (message && !chatbotWindow.classList.contains('active')) {
                            addNotification(message);
                        }
                    }
                }, 500);
            });
        });
    }

    // Initialize everything
    initChatbotMessages();
    initNotificationSystem();
    autoOpenChatbot();
    
    // Send first notification after 5 seconds if user hasn't opened chat
    setTimeout(() => {
        if (!chatbotWindow.classList.contains('active')) {
            const firstMessages = [
                "👋 Welcome! I'm Roni's AI assistant",
                "💡 Quick tip: Ask me about AI engineering!",
                "🤖 Ready to explore Roni's AI expertise?"
            ];
            const randomMessage = firstMessages[Math.floor(Math.random() * firstMessages.length)];
            addNotification(randomMessage);
        }
    }, 5000);
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
});