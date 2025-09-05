// ===== GLOBAL VARIABLES =====
let currentPage = 'home';
let isLoading = true;

// ===== TUTOR DATA =====
const tutorsData = [
    {
        name: "Muhammad Zaeem Amjad",
        subject: "Science",
        specialties: ["General Science", "Physics", "Chemistry"],
        experience: "2+ years experience",
        filter: "science",
        avatar: "MZA"
    },
    {
        name: "Muhammad Saad Murir",
        subject: "Biology & Sciences",
        specialties: ["Biology", "Chemistry", "Physics"],
        experience: "3+ years experience",
        filter: "science",
        avatar: "MSM"
    },
    {
        name: "Muhammad Zaeem Amjad",
        subject: "Computer Science",
        specialties: ["Programming", "Web Development", "IT Skills"],
        experience: "3+ years experience",
        filter: "computer",
        avatar: "MZA"
    },
    {
        name: "Muhammad Abdullah",
        subject: "Languages & Humanities",
        specialties: ["English", "Urdu", "Pakistan Studies"],
        experience: "2+ years experience",
        filter: "languages",
        avatar: "MAB"
    },
    {
        name: "Muhammad Zaeem Amjad",
        subject: "Mathematics",
        specialties: ["Algebra", "Geometry", "Calculus"],
        experience: "4+ years experience",
        filter: "mathematics",
        avatar: "MZA"
    },
    {
        name: "Muhammad Abdullah",
        subject: "English Literature",
        specialties: ["Literature", "Writing", "Communication"],
        experience: "6+ years experience",
        filter: "languages",
        avatar: "MAB"
    }
];

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== INITIALIZE APPLICATION =====
function initializeApp() {
    showLoadingScreen();
    initCustomCursor();
    initParticleSystem();
    initNavigation();
    initScrollEffects();
    initAnimations();
    initWhatsApp();
    initContactForm();
    generateTutors();
    initTutorFilters();
    
    // Hide loading screen after everything is loaded
    setTimeout(() => {
        hideLoadingScreen();
    }, 3000);
}

// ===== LOADING SCREEN =====
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            isLoading = false;
        }, 500);
    }
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });
    
    // Smooth follower animation
    function animateFollower() {
        const speed = 0.2;
        followerX += (mouseX - followerX) * speed;
        followerY += (mouseY - followerY) * speed;
        
        cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .btn, .feature-card, .tutor-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorFollower.classList.add('active');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorFollower.classList.remove('active');
        });
    });
}

// ===== PARTICLE SYSTEM =====
function initParticleSystem() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
    
    // Create new particles periodically
    setInterval(() => {
        if (!isLoading && Math.random() > 0.7) {
            createParticle(particlesContainer);
        }
    }, 3000);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random starting position
    particle.style.left = Math.random() * window.innerWidth + 'px';
    
    // Random size
    const size = Math.random() * 3 + 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random animation duration
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    
    // Random delay
    particle.style.animationDelay = Math.random() * 5 + 's';
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 20000);
}

// ===== NAVIGATION =====
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');
            if (targetPage) {
                navigateToPage(targetPage);
                updateActiveNav(link);
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Footer navigation links
    const footerLinks = document.querySelectorAll('footer [data-page]');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');
            if (targetPage) {
                navigateToPage(targetPage);
                updateActiveNav(document.querySelector(`.nav-link[data-page="${targetPage}"]`));
            }
        });
    });
    
    // Button navigation
    const navButtons = document.querySelectorAll('.btn[data-page]');
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = button.getAttribute('data-page');
            if (targetPage) {
                navigateToPage(targetPage);
                updateActiveNav(document.querySelector(`.nav-link[data-page="${targetPage}"]`));
            }
        });
    });
    
    // Scroll effect on navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function navigateToPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page with animation
    setTimeout(() => {
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            currentPage = pageId;
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Trigger AOS refresh
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }
    }, 100);
}

function updateActiveNav(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Parallax effect for hero elements
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroVisual = document.querySelector('.hero-visual');
        const floatingOrbs = document.querySelectorAll('.floating-orb');
        
        if (heroVisual && currentPage === 'home') {
            heroVisual.style.transform = `translateY(${scrollY * 0.1}px)`;
        }
        
        floatingOrbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.05;
            orb.style.transform = `translate(${Math.sin(scrollY * 0.001) * 20}px, ${scrollY * speed}px)`;
        });
    });
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    }
    
    // Animate counter numbers
    animateCounters();
    
    // Animate floating elements
    animateFloatingElements();
}

function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        const suffix = stat.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + suffix;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current) + suffix;
            }
        }, 20);
    });
}

function animateFloatingElements() {
    const floatingElements = document.querySelectorAll('.float-element');
    
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });
}

// ===== TUTOR GENERATION =====
function generateTutors() {
    const tutorsGrid = document.getElementById('tutorsGrid');
    if (!tutorsGrid) return;
    
    tutorsGrid.innerHTML = '';
    
    tutorsData.forEach((tutor, index) => {
        const tutorCard = createTutorCard(tutor, index);
        tutorsGrid.appendChild(tutorCard);
    });
    
    // Add hover effects to newly created cards
    const tutorCards = document.querySelectorAll('.tutor-card');
    tutorCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function createTutorCard(tutor, index) {
    const card = document.createElement('div');
    card.className = 'tutor-card';
    card.setAttribute('data-filter', tutor.filter);
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', `${index * 100}`);
    
    card.innerHTML = `
        <div class="tutor-avatar">${tutor.avatar}</div>
        <h3 class="tutor-name">${tutor.name}</h3>
        <p class="tutor-subject">${tutor.subject}</p>
        <p class="tutor-experience">${tutor.experience}</p>
        <div class="tutor-specialties">
            ${tutor.specialties.map(specialty => 
                `<span class="specialty-tag">${specialty}</span>`
            ).join('')}
        </div>
    `;
    
    return card;
}

// ===== TUTOR FILTERS =====
function initTutorFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterTutors(filter);
            updateActiveFilter(button);
        });
    });
}

function filterTutors(filter) {
    const tutorCards = document.querySelectorAll('.tutor-card');
    
    tutorCards.forEach(card => {
        const cardFilter = card.getAttribute('data-filter');
        
        if (filter === 'all' || cardFilter === filter) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

function updateActiveFilter(activeButton) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => button.classList.remove('active'));
    activeButton.classList.add('active');
}

// ===== WHATSAPP INTEGRATION =====
function initWhatsApp() {
    const whatsappButton = document.getElementById('whatsappFloat');
    if (!whatsappButton) return;
    
    whatsappButton.addEventListener('click', () => {
        const phoneNumber = '923193763775'; // Updated phone number without leading 0
        const message = encodeURIComponent('Hello! I am interested in BrightPath Home Tuitions services. Please provide more information.');
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappURL, '_blank');
    });
    
    // Animate WhatsApp button
    setInterval(() => {
        whatsappButton.style.transform = 'scale(1.1)';
        setTimeout(() => {
            whatsappButton.style.transform = 'scale(1)';
        }, 200);
    }, 3000);
}

// ===== CONTACT FORM =====
// Update contact form handler
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        fetch('handlers/contact_handler.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showNotification(data.message, 'success');
                this.reset();
            } else {
                showNotification(data.message, 'error');
            }
        })
        .catch(error => {
            showNotification('Error sending message. Please try again.', 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
}
function handleContactSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!validateForm(data)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Simulate form submission
    showLoadingSubmission();
    
    setTimeout(() => {
        hideLoadingSubmission();
        showNotification('Thank you! Your message has been sent successfully. We will contact you soon.', 'success');
        e.target.reset();
        
        // Compose WhatsApp message with form data
        const whatsappMessage = createWhatsAppMessage(data);
        const phoneNumber = '923193763775';
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Ask if they want to continue on WhatsApp
        setTimeout(() => {
            if (confirm('Would you like to continue this conversation on WhatsApp?')) {
                window.open(whatsappURL, '_blank');
            }
        }, 2000);
    }, 2000);
}

function validateForm(data) {
    const required = ['firstName', 'lastName', 'email', 'phone', 'studentClass', 'subjects'];
    
    for (let field of required) {
        if (!data[field] || data[field].trim() === '') {
            return false;
        }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
        return false;
    }
    
    return true;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove previous validation classes
    field.classList.remove('valid', 'invalid');
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    // Specific validation for different field types
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    }
    
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        isValid = phoneRegex.test(value);
    }
    
    // Add validation class
    field.classList.add(isValid ? 'valid' : 'invalid');
    
    return isValid;
}

function createWhatsAppMessage(data) {
    return `New Inquiry - BrightPath Home Tuitions

📋 Student Information:
Name: ${data.firstName} ${data.lastName}
Class: ${data.studentClass}
Subjects: ${data.subjects}

📞 Contact Details:
Email: ${data.email}
Phone: ${data.phone}

💬 Message:
${data.message || 'No additional message'}

Please contact me for more information about home tuition services.`;
}

function showLoadingSubmission() {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Store original text for later restoration
    submitButton.setAttribute('data-original-text', originalText);
}

function hideLoadingSubmission() {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitButton.getAttribute('data-original-text');
    
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">×</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Close functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: 10px;
    `;
    
    closeButton.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
}

function hideNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#10B981';
        case 'error': return '#EF4444';
        case 'warning': return '#F59E0B';
        default: return '#3B82F6';
    }
}

// ===== SMOOTH SCROLLING AND PERFORMANCE OPTIMIZATION =====
function optimizeScrolling() {
    let ticking = false;
    
    function updateScrollEffects() {
        // Your scroll effects here
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .tutor-card, .category-card, .pricing-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== KEYBOARD NAVIGATION SUPPORT =====
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC key to close mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
        
        // Tab navigation enhancement
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// ===== PAGE VISIBILITY API =====
function initPageVisibility() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations when page is hidden
            document.body.classList.add('page-hidden');
        } else {
            // Resume animations when page becomes visible
            document.body.classList.remove('page-hidden');
        }
    });
}

// ===== ENHANCED INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    optimizeScrolling();
    initIntersectionObserver();
    initKeyboardNavigation();
    initPageVisibility();
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting here if needed
});

// ===== RESIZE HANDLER =====
window.addEventListener('resize', debounce(() => {
    // Recalculate animations and layouts on resize
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}, 250));

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// ===== PRELOADER FOR IMAGES =====
function preloadImages() {
    const images = [
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ4IiBmaWxsPSIjZmZiNzMzIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iNCw0Ii8+CiAgPHBhdGggZD0iTTMwIDcwTDUwIDMwTDcwIDcwSDMwWiIgZmlsbD0iIzAwOTc4OCIvPgogIDxyZWN0IHg9IjQ1IiB5PSI0MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPGNpcmNsZSBjeD0iNDUiIGN5PSI0NSIgcj0iMyIgZmlsbD0iIzAwOTc4OCIvPgogIDxjaXJjbGUgY3g9IjU1IiBjeT0iNDUiIHI9IjMiIGZpbGw9IiMwMDk3ODgiLz4KPC9zdmc+Cg=='
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}