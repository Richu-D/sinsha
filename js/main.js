// ============================================
// Main JavaScript for Sinsha's Birthday Site
// ============================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initNavigation();
    initTyped();
    initAOS();
    initGSAP();
    initWishes();
    initMusicPlayer();
    initConfetti();
    initSmoothScroll();
    initBirthdayTextClickConfetti();
    setTimeout(() => {
        createConfetti();
    });
});

function initBirthdayTextClickConfetti() {
    const birthdayText = document.getElementById('birthdayText');
    birthdayText.addEventListener('click', () => {
        createConfetti();
    });
}


// ============================================
// Navigation Toggle
// ============================================
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// ============================================
// Typed.js - Typing Effect
// ============================================
function initTyped() {
    const typedElement = document.getElementById('typedText');
    if (typedElement && typeof Typed !== 'undefined') {
        new Typed('#typedText', {
            strings: [
                "MBBS student in Russia 🇷🇺",
                "Passionate about medicine 💉",
                "Dedicated to healing ❤️",
                "Making dreams come true ✨"
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    } else {
        // Fallback if Typed.js fails to load
        if (typedElement) {
            typedElement.textContent = "MBBS student in Russia 🇷🇺";
        }
    }
}

// ============================================
// AOS - Animate On Scroll
// ============================================
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            delay: 0
        });
    }
}

// ============================================
// GSAP Animations
// ============================================
function initGSAP() {
    // Ensure hero content is visible even if GSAP fails to load
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const avatar = document.querySelector('.avatar-img');
    const birthdayBtn = document.getElementById('birthdayBtn');
    
    if (heroContent) heroContent.style.opacity = '1';
    if (heroTitle) heroTitle.style.opacity = '1';
    if (heroSubtitle) heroSubtitle.style.opacity = '1';
    if (avatar) avatar.style.opacity = '1';
    if (birthdayBtn) birthdayBtn.style.opacity = '1';
    
    if (typeof gsap !== 'undefined') {
        // Hero section entrance animation
        if (heroContent) {
            // Ensure content is visible by default
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
            // Animate from hidden state
            gsap.from(heroContent, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out'
            });
        }

        if (avatar) {
            // Ensure avatar is visible by default
            avatar.style.opacity = '1';
            avatar.style.transform = 'scale(1) rotate(0deg)';
            // Animate from hidden state
            gsap.from(avatar, {
                scale: 0,
                rotation: 360,
                duration: 1,
                ease: 'back.out(1.7)',
                delay: 0.3
            });
        }

        // Timeline items animation on scroll
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        gsap.to(entry.target, {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            duration: 0.8,
                            ease: 'power2.out'
                        });
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(item);
            
            // Set initial state - mobile vertical, desktop horizontal
            const isMobile = window.innerWidth < 768;
            gsap.set(item, {
                opacity: 0,
                x: isMobile ? 0 : (index % 2 === 0 ? -50 : 50),
                y: isMobile ? 30 : 0
            });
        });

        // Gallery items stagger animation
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            const flipCard = item.querySelector('.flip-card');
            if (flipCard) {
                gsap.set(flipCard, { opacity: 0, y: 50, rotationY: -15 });
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            gsap.to(flipCard, {
                                opacity: 1,
                                y: 0,
                                rotationY: 0,
                                duration: 0.8,
                                delay: index * 0.1,
                                ease: 'power3.out'
                            });
                        }
                    });
                }, { threshold: 0.1 });

                observer.observe(item);
            }
        });
    }
}

// ============================================
// Wishes Form
// ============================================
function initWishes() {
    const wishForm = document.getElementById('wishForm');
    const wishesGrid = document.getElementById('wishesGrid');
    
    // Load existing wishes from localStorage
    loadWishes();

    if (wishForm) {
        const scriptURL = "https://script.google.com/macros/s/AKfycbw1jlTXg3Y9GVB496o0J2f4X31LV0tSV-shzoteVh5q2odSKmQzIxDTM3Um0B9FaSPV/exec"; // paste the web app URL here

        wishForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = {
                name: document.getElementById("name").value.trim(),
                phone: document.getElementById("phone").value.trim(),
                wish: document.getElementById("wish").value.trim()
            };

            // Validate required fields
            if (!data.name || !data.phone || !data.wish) {
                const msgElement = document.getElementById("msg");
                if (msgElement) {
                    msgElement.innerText = "❌ Please fill in all fields!";
                    msgElement.style.color = "#FF6B9D";
                }
                return;
            }

            try {
                await fetch(scriptURL, {
                    method: "POST",
                    body: (`name=${data.name}&phone=${data.phone}&wish=${data.wish}`),
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                });

                const msgElement = document.getElementById("msg");
                if (msgElement) {
                    msgElement.innerText = "✨ Wish submitted successfully!";
                    msgElement.style.color = "#28a745";
                }

                // Also save to localStorage and display locally
                const wish = {
                    id: Date.now(),
                    name: data.name,
                    message: data.wish,
                    date: new Date().toLocaleDateString()
                };
                
                saveWish(wish);
                addWishCard(wish);
                
                wishForm.reset();

                // Show success animation
                if (typeof gsap !== 'undefined' && wishesGrid) {
                    const newCard = wishesGrid.lastElementChild;
                    if (newCard) {
                        gsap.from(newCard, {
                            opacity: 0,
                            scale: 0.8,
                            y: 20,
                            duration: 0.5,
                            ease: 'back.out(1.2)'
                        });
                    }
                }

                // Clear message after 3 seconds
                setTimeout(() => {
                    const msgElement = document.getElementById("msg");
                    if (msgElement) {
                        msgElement.innerText = "";
                    }
                }, 3000);

            } catch (error) {
                const msgElement = document.getElementById("msg");
                if (msgElement) {
                    msgElement.innerText = "❌ Something went wrong!";
                    msgElement.style.color = "#dc3545";
                }
                console.error('Error submitting wish:', error);
            }
        });
    }
}

function saveWish(wish) {
    const wishes = getWishes();
    wishes.push(wish);
    localStorage.setItem('sinshaWishes', JSON.stringify(wishes));
}

function getWishes() {
    const wishes = localStorage.getItem('sinshaWishes');
    return wishes ? JSON.parse(wishes) : [];
}

function loadWishes() {
    const wishes = getWishes();
    const wishesGrid = document.getElementById('wishesGrid');
    
    if (wishesGrid) {
        wishesGrid.innerHTML = '';
        wishes.forEach(wish => {
            addWishCard(wish);
        });
    }
}

function addWishCard(wish) {
    const wishesGrid = document.getElementById('wishesGrid');
    if (!wishesGrid) return;
    
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.setAttribute('data-aos', 'fade-up');
    card.innerHTML = `
        <div class="wish-card-author">${escapeHtml(wish.name)}</div>
        <div class="wish-card-message">${escapeHtml(wish.message)}</div>
        <small style="color: #999; font-size: 0.75rem; margin-top: 0.5rem; display: block;">${wish.date}</small>
    `;
    
    wishesGrid.appendChild(card);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Music Player
// ============================================
let audioElement = null;
let isPlaying = false;
let shouldAutoPlay = true; // Flag to track if we should try to auto-play

function initMusicPlayer() {
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const floatingPlayBtn = document.getElementById('floatingPlayBtn');
    const floatingPlayIcon = document.getElementById('floatingPlayIcon');
    
    // Create audio element
    audioElement = new Audio('assets/music/happy-birthday-song.mp3');
    audioElement.loop = true;
    
    // Try to play automatically on page load
    attemptAutoPlay();
    
    // Listen for user interactions to retry playback if autoplay was blocked
    const interactionEvents = ['click', 'touchstart', 'keydown', 'mousemove', 'scroll'];
    interactionEvents.forEach(eventType => {
        document.addEventListener(eventType, handleUserInteraction, { once: false, passive: true });
    });
    
    // Update play/pause state function
    function updatePlayState(playing) {
        isPlaying = playing;
        if (playIcon) {
            playIcon.textContent = isPlaying ? '⏸️' : '▶️';
        }
        if (floatingPlayIcon) {
            floatingPlayIcon.textContent = isPlaying ? '⏸️' : '▶️';
        }
    }
    
    // Attempt to auto-play
    function attemptAutoPlay() {
        if (audioElement && shouldAutoPlay) {
            audioElement.play()
                .then(() => {
                    isPlaying = true;
                    updatePlayState(true);
                    shouldAutoPlay = false; // Successfully started, no need to retry
                })
                .catch((error) => {
                    // Autoplay was prevented - will retry on user interaction
                    console.log('Autoplay prevented, waiting for user interaction');
                    isPlaying = false;
                    updatePlayState(false);
                    // Keep shouldAutoPlay = true to retry on interaction
                });
        }
    }
    
    // Handle user interaction - retry playback if it was blocked
    function handleUserInteraction() {
        // If autoplay was blocked, try again on first user interaction
        if (shouldAutoPlay && audioElement && !isPlaying) {
            shouldAutoPlay = false; // Only try once after interaction
            attemptAutoPlay();
        }
    }
    
    // Toggle play/pause function
    function togglePlayPause() {
        if (!audioElement) return;
        
        // User explicitly interacted, stop trying auto-play
        shouldAutoPlay = false;
        
        if (isPlaying) {
            audioElement.pause();
            updatePlayState(false);
        } else {
            audioElement.play()
                .then(() => {
                    updatePlayState(true);
                })
                .catch((error) => {
                    console.error('Error playing audio:', error);
                    updatePlayState(false);
                });
        }
    }
    
    // Setup button click handlers
    if (playBtn) {
        playBtn.addEventListener('click', togglePlayPause);
    }
    
    if (floatingPlayBtn) {
        floatingPlayBtn.addEventListener('click', togglePlayPause);
    }
    
    // Sync state when audio ends or pauses
    audioElement.addEventListener('pause', () => {
        if (isPlaying) {
            updatePlayState(false);
        }
    });
    
    audioElement.addEventListener('play', () => {
        if (!isPlaying) {
            updatePlayState(true);
        }
    });
}

// ============================================
// Confetti Animation
// ============================================
function initConfetti() {
    // Create confetti canvas if it doesn't exist
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Store canvas and context globally for use in createConfetti
    window.confettiCanvas = canvas;
    window.confettiCtx = ctx;
}

function createConfetti() {
    const canvas = window.confettiCanvas;
    const ctx = window.confettiCtx;
    
    if (!canvas || !ctx) return;
    
    const confetti = [];
    const colors = ['#FF6B9D', '#FFB6C1', '#FFD700', '#FF69B4', '#FF1493', '#FFB6C1'];
    
    // Create confetti particles
    for (let i = 0; i < 100; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: -20,
            radius: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 5 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
    
    // Animate confetti
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((particle, index) => {
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate((particle.rotation * Math.PI) / 180);
            
            ctx.beginPath();
            ctx.arc(0, 0, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            ctx.restore();
            
            particle.y += particle.speed;
            particle.x += Math.sin(particle.y * 0.01) * 2;
            particle.rotation += particle.rotationSpeed;
            
            // Remove particles that are off screen
            if (particle.y > canvas.height + 20) {
                confetti.splice(index, 1);
            }
        });
        
        if (confetti.length > 0) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
    
    // Also trigger confetti on page load after a delay
    if (!window.confettiTriggered) {
        setTimeout(() => {
            createConfetti();
            window.confettiTriggered = true;
        }, 1000);
    }
}

// ============================================
// Smooth Scroll
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Navbar Background on Scroll
// ============================================
window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        }
    }
});
