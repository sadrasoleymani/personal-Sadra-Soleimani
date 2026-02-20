// ===== Main JavaScript File =====
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initNavbar();
    initThemeToggle();
    initMobileMenu();
    initProgressBars();
    initContactForm();
    initAOS();
    initSmoothScroll();
    initStickyCodeBox();
    initPhotoEffects();
    initCodeHoverEffect();
});

// ===== Custom Cursor =====
function initCursor() {
    const cursor = document.querySelector('.cursor-follower');
    if (!cursor) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    function animate() {
        const speed = 0.1;
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-item, .interest-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(2)`;
            cursor.style.background = 'var(--secondary)';
            cursor.style.mixBlendMode = 'difference';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1)`;
            cursor.style.background = 'var(--primary)';
        });
    });
}

// ===== Navbar Scroll Effect =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        // Add scrolled class
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active link on scroll
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== Theme Toggle =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', () => {
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
        
        // Trigger animation
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close menu on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// ===== Progress Bars Animation =====
function initProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.getAttribute('data-width') || '0';
                fill.style.width = width + '%';
            }
        });
    }, { threshold: 0.5 });
    
    progressFills.forEach(fill => observer.observe(fill));
}

// ===== Contact Form =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        button.disabled = true;
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success message
        button.innerHTML = '<i class="fas fa-check"></i> Sent!';
        button.style.background = 'var(--success)';
        
        // Reset form
        form.reset();
        
        // Restore button
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 3000);
        
        // Show success notification
        showNotification('Message sent successfully!', 'success');
    });
    
    // Form validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            showNotification('Please fill all fields correctly', 'error');
        });
    });
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = type === 'success' ? 'var(--success)' : 'var(--danger)';
    notification.style.color = 'white';
    notification.style.padding = '1rem 2rem';
    notification.style.borderRadius = '50px';
    notification.style.boxShadow = 'var(--shadow-lg)';
    notification.style.zIndex = '9999';
    notification.style.animation = 'slideIn 0.3s ease';
    
    // Add animation styles
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== Simple AOS Implementation =====
function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    elements.forEach(el => observer.observe(el));
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== Sticky Code Box =====
function initStickyCodeBox() {
    const stickyBox = document.querySelector('.sticky-code');
    const navbar = document.getElementById('navbar');
    const homeSection = document.getElementById('home');
    
    if (!stickyBox || !navbar || !homeSection) return;
    
    let navbarHeight = navbar.offsetHeight;
    let homeSectionTop = homeSection.offsetTop;
    let homeSectionHeight = homeSection.offsetHeight;
    let stickyBoxHeight = stickyBox.offsetHeight;
    
    window.addEventListener('resize', () => {
        navbarHeight = navbar.offsetHeight;
        homeSectionTop = homeSection.offsetTop;
        homeSectionHeight = homeSection.offsetHeight;
        stickyBoxHeight = stickyBox.offsetHeight;
    });
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const maxScroll = homeSectionTop + homeSectionHeight - stickyBoxHeight - navbarHeight - 100;
        
        if (scrollY > maxScroll) {
            stickyBox.style.position = 'absolute';
            stickyBox.style.top = (homeSectionHeight - stickyBoxHeight - navbarHeight - 100) + 'px';
        } else {
            stickyBox.style.position = 'sticky';
            stickyBox.style.top = navbarHeight + 20 + 'px';
        }
        
        // Opacity effect near the end
        const distanceToEnd = maxScroll - scrollY;
        if (distanceToEnd < 100) {
            const opacity = Math.max(0.3, distanceToEnd / 100);
            stickyBox.style.opacity = opacity;
        } else {
            stickyBox.style.opacity = 1;
        }
    });
}

// ===== Photo Effects =====
function initPhotoEffects() {
    const photoFrame = document.querySelector('.photo-frame');
    if (!photoFrame) return;
    
    photoFrame.addEventListener('mousemove', (e) => {
        const rect = photoFrame.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        const decorations = document.querySelectorAll('.decoration-1, .decoration-2, .decoration-3');
        decorations.forEach((dec, index) => {
            const intensity = (index + 1) * 0.5;
            dec.style.transform = `rotateX(${rotateX * intensity}deg) rotateY(${rotateY * intensity}deg)`;
        });
    });
    
    photoFrame.addEventListener('mouseleave', () => {
        const decorations = document.querySelectorAll('.decoration-1, .decoration-2, .decoration-3');
        decorations.forEach(dec => {
            dec.style.transform = 'rotateX(0) rotateY(0)';
        });
    });
    
    // Profile image fallback
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        profileImage.loading = 'lazy';
        
        profileImage.onerror = function() {
            this.style.display = 'none';
            this.parentElement.classList.add('no-image');
            this.parentElement.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
            this.parentElement.style.display = 'flex';
            this.parentElement.style.alignItems = 'center';
            this.parentElement.style.justifyContent = 'center';
            this.parentElement.innerHTML += '<span style="font-size: 4rem; opacity: 0.5;">📸</span>';
        };
    }
}

// ===== Code Hover Effect =====
function initCodeHoverEffect() {
    const codeLines = document.querySelectorAll('.window-content .code-var, .window-content .code-func, .window-content .code-string, .window-content .code-keyword');
    
    codeLines.forEach(line => {
        line.addEventListener('mouseenter', () => {
            line.style.textShadow = '0 0 10px currentColor';
            line.style.transition = 'text-shadow 0.3s';
        });
        
        line.addEventListener('mouseleave', () => {
            line.style.textShadow = 'none';
        });
    });
}

// ===== Parallax Effect =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const homeVisual = document.querySelector('.home-visual');
    const floatingShapes = document.querySelectorAll('.floating-shape');
    
    if (homeVisual && window.innerWidth > 768) {
        const rate = scrolled * 0.1;
        homeVisual.style.transform = `translateY(${rate}px)`;
    }
    
    floatingShapes.forEach(shape => {
        const rate = scrolled * 0.05;
        shape.style.transform = `translate(${rate}px, ${-rate}px)`;
    });
});

// ===== Copy Email to Clipboard =====
document.querySelectorAll('.info-item a[href^="mailto:"]').forEach(emailLink => {
    emailLink.addEventListener('click', (e) => {
        e.preventDefault();
        const email = emailLink.getAttribute('href').replace('mailto:', '');
        
        navigator.clipboard.writeText(email).then(() => {
            showNotification('Email copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy email', 'error');
        });
    });
});

// ===== Loading Animation =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add animation delays to cloud items
    const cloudItems = document.querySelectorAll('.cloud-item');
    cloudItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});

// ===== Typing Effect for Code Box (Optional) =====
function initTypingEffect() {
    const codeElement = document.querySelector('.window-content code');
    if (!codeElement) return;
    
    const originalHTML = codeElement.innerHTML;
    const plainText = codeElement.innerText;
    
    // Only do this on first visit to home section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Uncomment for typing effect
                // typeCode(codeElement, plainText);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(codeElement);
}

function typeCode(element, text, index = 0) {
    if (index < text.length) {
        element.innerHTML += text.charAt(index);
        setTimeout(() => typeCode(element, text, index + 1), 20);
    }
}

// Uncomment if you want typing effect
// initTypingEffect();