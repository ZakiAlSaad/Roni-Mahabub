// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initThemeToggle();
    initMobileMenu();
    initSmoothScroll();
    initCounters();
    initSkillBars();
    initContactForm();
    initBackToTop();
    initCurrentYear();
    initVisitorTracking(); // Initialize visitor tracking
});

// Enhanced Theme Toggle Function
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    const themeIcon = document.getElementById('themeIcon');
    const themeIconMobile = document.getElementById('themeIconMobile');
    const body = document.body;
    
    // Check for saved theme preference or system preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    // Set initial theme with transition prevention
    body.style.transition = 'none';
    
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
    
    // Re-enable transitions after initial load
    setTimeout(() => {
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }, 100);
    
    // Toggle functions
    function enableDarkMode() {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        if (themeIconMobile) {
            themeIconMobile.classList.remove('fa-moon');
            themeIconMobile.classList.add('fa-sun');
        }
        localStorage.setItem('theme', 'dark');
        document.documentElement.style.colorScheme = 'dark';
    }
    
    function disableDarkMode() {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        if (themeIconMobile) {
            themeIconMobile.classList.remove('fa-sun');
            themeIconMobile.classList.add('fa-moon');
        }
        localStorage.setItem('theme', 'light');
        document.documentElement.style.colorScheme = 'light';
    }
    
    // Event Listeners with animation
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 150);
            
            if (body.classList.contains('dark-mode')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }
    
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', function() {
            themeToggleMobile.style.transform = 'scale(0.9)';
            setTimeout(() => {
                themeToggleMobile.style.transform = 'scale(1)';
            }, 150);
            
            if (body.classList.contains('dark-mode')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        }
    });
}

// Mobile Menu Function
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('mobile-menu-hidden');
            mobileMenu.classList.toggle('mobile-menu-visible');
            
            // Toggle menu icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on links
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('mobile-menu-hidden');
                mobileMenu.classList.remove('mobile-menu-visible');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// Smooth Scroll Function
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animated Counters Function
function initCounters() {
    const projectCount = document.getElementById('projectCount');
    const hoursCount = document.getElementById('hoursCount');
    
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }
    
    // Intersection Observer for counters
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(projectCount, 50);
                animateCounter(hoursCount, 1000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (document.getElementById('about')) {
        observer.observe(document.getElementById('about'));
    }
}

// Skill Bars Animation Function
function initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate skill tags
                document.querySelectorAll('.skill-tag').forEach((tag, index) => {
                    setTimeout(() => {
                        tag.classList.add('animate-fadeIn');
                    }, index * 50);
                });
                
                // Animate progress bars
                document.querySelectorAll('.skill-bar').forEach((bar, index) => {
                    setTimeout(() => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width + '%';
                    }, index * 200);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    if (document.getElementById('skills')) {
        observer.observe(document.getElementById('skills'));
    }
}

// Contact Form Function
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitText = document.getElementById('submitText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            submitText.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
            submitBtn.disabled = true;
            formMessage.classList.add('hidden');
            
            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success
                    formMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                    formMessage.className = 'bg-green-100 dark-mode:bg-green-900/30 text-green-700 dark-mode:text-green-400 border border-green-200 dark-mode:border-green-800 p-4 rounded-xl text-center';
                    contactForm.reset();
                } else {
                    // Error
                    formMessage.textContent = 'Oops! There was an error sending your message. Please try again.';
                    formMessage.className = 'bg-red-100 dark-mode:bg-red-900/30 text-red-700 dark-mode:text-red-400 border border-red-200 dark-mode:border-red-800 p-4 rounded-xl text-center';
                }
            } catch (error) {
                formMessage.textContent = 'Network error. Please check your connection and try again.';
                formMessage.className = 'bg-red-100 dark-mode:bg-red-900/30 text-red-700 dark-mode:text-red-400 border border-red-200 dark-mode:border-red-800 p-4 rounded-xl text-center';
            }
            
            // Hide loading state and show message
            submitText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
            submitBtn.disabled = false;
            formMessage.classList.remove('hidden');
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);
        });
    }
}

// Back to Top Function
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Current Year Function
function initCurrentYear() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

// Visitor Tracking System
function initVisitorTracking() {
    const visitorPopup = document.getElementById('visitorPopup');
    const visitorPopupClose = document.getElementById('visitorPopupClose');
    const popupOverlay = document.getElementById('popupOverlay');
    const explorePortfolio = document.getElementById('explorePortfolio');
    const chatWithAI = document.getElementById('chatWithAI');
    
    // Get or create visitor ID
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
        visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('visitorId', visitorId);
    }
    
    // Get visit count
    let visitCount = parseInt(localStorage.getItem('visitCount')) || 0;
    visitCount++;
    localStorage.setItem('visitCount', visitCount);
    
    // Get last visit time
    const lastVisit = localStorage.getItem('lastVisit');
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    localStorage.setItem('lastVisit', now.toISOString());
    
    // Determine if this is a first-time visitor
    const isFirstVisit = !lastVisit;
    
    // Update popup content
    document.getElementById('visitCount').textContent = visitCount;
    document.getElementById('uniqueVisitor').textContent = isFirstVisit ? 'New' : 'Returning';
    document.getElementById('visitTime').textContent = currentTime;
    
    // Set different messages for first-time vs returning visitors
    const greeting = isFirstVisit 
        ? "🎉 Welcome First-Time Visitor!" 
        : "👋 Welcome Back!";
        
    const message = isFirstVisit
        ? "I'm excited to show you my AI Engineering portfolio. Explore my machine learning projects, deep learning models, and AI solutions that solve real-world problems."
        : "Great to see you again! Check out what's new in my portfolio. I've been working on some exciting AI projects since your last visit.";
    
    document.getElementById('visitorGreeting').textContent = greeting;
    document.getElementById('visitorMessage').textContent = message;
    
    // Show popup after 2 seconds
    setTimeout(() => {
        visitorPopup.classList.add('show');
        popupOverlay.classList.add('show');
        
        // Play welcome sound
        playWelcomeSound();
        
        // Create confetti effect for first-time visitors
        if (isFirstVisit) {
            createConfetti();
            visitorPopup.classList.add('celebrate');
        }
    }, 2000);
    
    // Close popup
    visitorPopupClose.addEventListener('click', () => {
        closeVisitorPopup();
    });
    
    // Close popup when clicking overlay
    popupOverlay.addEventListener('click', () => {
        closeVisitorPopup();
    });
    
    // Explore portfolio button
    explorePortfolio.addEventListener('click', () => {
        closeVisitorPopup();
        // Scroll to projects section
        setTimeout(() => {
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                window.scrollTo({
                    top: projectsSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }, 300);
    });
    
    // Chat with AI button
    chatWithAI.addEventListener('click', () => {
        closeVisitorPopup();
        // Open chatbot
        setTimeout(() => {
            const chatbotToggle = document.getElementById('chatbotToggle');
            if (chatbotToggle) {
                chatbotToggle.click();
            }
        }, 300);
    });
    
    // Function to close popup
    function closeVisitorPopup() {
        visitorPopup.classList.remove('show');
        popupOverlay.classList.remove('show');
        visitorPopup.classList.remove('celebrate');
    }
    
    // Auto-close popup after 15 seconds
    setTimeout(() => {
        if (visitorPopup.classList.contains('show')) {
            closeVisitorPopup();
        }
    }, 15000);
    
    // Play welcome sound
    function playWelcomeSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Play a pleasant welcome tone
            oscillator.frequency.value = 523.25; // C5
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // Audio context not supported or user blocked it
            console.log('Audio notification not available');
        }
    }
    
    // Create confetti effect
    function createConfetti() {
        const colors = ['#667eea', '#764ba2', '#f56565', '#ed8936', '#ecc94b', '#48bb78', '#38b2ac'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.animation = `confetti-fall ${Math.random() * 3 + 2}s linear forwards`;
            confetti.style.animationDelay = Math.random() * 2 + 's';
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
    
    // Track page engagement
    let timeOnPage = 0;
    const engagementTimer = setInterval(() => {
        timeOnPage++;
        
        // Show encouragement message after 30 seconds
        if (timeOnPage === 30) {
            showEngagementMessage();
        }
        
        // Track total time on site
        if (timeOnPage % 60 === 0) { // Every minute
            const totalTime = parseInt(localStorage.getItem('totalTimeOnSite') || '0');
            localStorage.setItem('totalTimeOnSite', (totalTime + 1).toString());
        }
    }, 1000);
    
    // Show engagement message
    function showEngagementMessage() {
        // Create a subtle notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            max-width: 300px;
            animation: slideInRight 0.5s ease-out;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-clock" style="font-size: 20px;"></i>
                <div>
                    <div style="font-weight: 600; margin-bottom: 5px;">Still exploring? 😊</div>
                    <div style="font-size: 13px; opacity: 0.9;">Let me know if you have any questions!</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out forwards';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        clearInterval(engagementTimer);
    });
}