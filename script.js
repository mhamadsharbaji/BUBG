document.addEventListener('DOMContentLoaded', () => {
  const image = document.querySelector('.scroll-image');
  const section = document.querySelector('.next-section');
  const cinematicParagraph = document.querySelector('.cinematic-paragraph');
  const lines = document.querySelectorAll('.cinematic-paragraph p');
  const particleContainer = document.querySelector('.particle-container');

  if(!image || !section || !cinematicParagraph || !lines.length || !particleContainer) return;

  let animationTriggered = false;
  
  // Particle System
  class ParticleSystem {
    constructor(container) {
      this.container = container;
      this.particles = [];
      this.isActive = false;
      this.init();
    }

    init() {
      // Create initial particles
      for (let i = 0; i < 30; i++) {
        this.createBullet();
        this.createDust();
        this.createShell();
      }
      
      // Start animation loop
      this.animate();
    }

    createBullet() {
      const bullet = document.createElement('div');
      bullet.className = 'bullet';
      
      // Random starting position
      bullet.style.left = Math.random() * 100 + '%';
      bullet.style.top = Math.random() * 100 + '%';
      
      // Store custom properties for animation
      bullet.dataset.speed = 2 + Math.random() * 3;
      bullet.dataset.angle = Math.random() * 360;
      bullet.dataset.life = 0;
      bullet.dataset.maxLife = 100 + Math.random() * 100;
      
      this.container.appendChild(bullet);
      this.particles.push(bullet);
    }

    createDust() {
      const dust = document.createElement('div');
      dust.className = 'dust';
      
      dust.style.left = Math.random() * 100 + '%';
      dust.style.top = Math.random() * 100 + '%';
      
      dust.dataset.speed = 0.5 + Math.random() * 1;
      dust.dataset.scale = 0.5 + Math.random() * 1.5;
      dust.dataset.life = 0;
      dust.dataset.maxLife = 150 + Math.random() * 100;
      
      this.container.appendChild(dust);
      this.particles.push(dust);
    }

    createShell() {
      const shell = document.createElement('div');
      shell.className = 'shell';
      
      shell.style.left = Math.random() * 100 + '%';
      shell.style.top = Math.random() * 100 + '%';
      
      shell.dataset.speed = 1 + Math.random() * 2;
      shell.dataset.rotation = 0;
      shell.dataset.life = 0;
      shell.dataset.maxLife = 80 + Math.random() * 70;
      
      this.container.appendChild(shell);
      this.particles.push(shell);
    }

    createMuzzleFlash(x, y) {
      const flash = document.createElement('div');
      flash.className = 'muzzle-flash';
      flash.style.left = x + '%';
      flash.style.top = y + '%';
      
      // Animate and remove
      flash.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(2)' }
      ], {
        duration: 200,
        easing: 'ease-out'
      });
      
      this.container.appendChild(flash);
      setTimeout(() => flash.remove(), 200);
    }

    createImpactDust(x, y) {
      const dust = document.createElement('div');
      dust.className = 'impact-dust';
      dust.style.left = x + '%';
      dust.style.top = y + '%';
      
      dust.animate([
        { opacity: 0.8, transform: 'scale(0.5)' },
        { opacity: 0, transform: 'scale(2)' }
      ], {
        duration: 500,
        easing: 'ease-out'
      });
      
      this.container.appendChild(dust);
      setTimeout(() => dust.remove(), 500);
    }

    animate() {
      if (!this.isActive) return;
      
      this.particles.forEach(particle => {
        if (!particle.parentNode) return;
        
        // Update life
        let life = parseFloat(particle.dataset.life || 0);
        const maxLife = parseFloat(particle.dataset.maxLife || 100);
        
        life += 1;
        
        if (life >= maxLife) {
          // Reset particle
          life = 0;
          particle.style.left = Math.random() * 100 + '%';
          particle.style.top = Math.random() * 100 + '%';
          
          // Randomly create effects
          if (Math.random() < 0.1) {
            this.createMuzzleFlash(
              parseFloat(particle.style.left),
              parseFloat(particle.style.top)
            );
          }
          
          if (Math.random() < 0.2) {
            this.createImpactDust(
              parseFloat(particle.style.left),
              parseFloat(particle.style.top)
            );
          }
        }
        
        // Move particle based on type
        if (particle.classList.contains('bullet')) {
          // Bullets move in straight lines
          const angle = parseFloat(particle.dataset.angle || 0) * Math.PI / 180;
          const speed = parseFloat(particle.dataset.speed || 2);
          
          let left = parseFloat(particle.style.left) + Math.cos(angle) * speed * 0.1;
          let top = parseFloat(particle.style.top) + Math.sin(angle) * speed * 0.1;
          
          // Wrap around screen
          if (left > 100) left = 0;
          if (left < 0) left = 100;
          if (top > 100) top = 0;
          if (top < 0) top = 100;
          
          particle.style.left = left + '%';
          particle.style.top = top + '%';
          
          // Fade in/out based on life
          const opacity = Math.sin(life / maxLife * Math.PI);
          particle.style.opacity = opacity * 0.8;
          
        } else if (particle.classList.contains('dust')) {
          // Dust drifts and fades
          const speed = parseFloat(particle.dataset.speed || 0.5);
          const scale = parseFloat(particle.dataset.scale || 1);
          
          let left = parseFloat(particle.style.left) + (Math.random() - 0.5) * speed * 0.2;
          let top = parseFloat(particle.style.top) + (Math.random() - 0.5) * speed * 0.2;
          
          // Keep within bounds
          left = Math.max(0, Math.min(100, left));
          top = Math.max(0, Math.min(100, top));
          
          particle.style.left = left + '%';
          particle.style.top = top + '%';
          particle.style.transform = `scale(${scale})`;
          
          // Dust fades in and out slowly
          const opacity = 0.3 + 0.3 * Math.sin(life / 50);
          particle.style.opacity = opacity;
          
        } else if (particle.classList.contains('shell')) {
          // Shells fall and rotate
          const speed = parseFloat(particle.dataset.speed || 1);
          let rotation = parseFloat(particle.dataset.rotation || 0);
          
          let left = parseFloat(particle.style.left) + (Math.random() - 0.5) * speed * 0.2;
          let top = parseFloat(particle.style.top) + speed * 0.1;
          
          rotation += speed * 2;
          
          // Reset when reaching bottom
          if (top > 100) {
            top = 0;
            left = Math.random() * 100;
          }
          
          particle.style.left = left + '%';
          particle.style.top = top + '%';
          particle.style.transform = `rotate(${rotation}deg)`;
          particle.dataset.rotation = rotation;
          
          // Shells fade in and out
          const opacity = Math.sin(life / maxLife * Math.PI) * 0.7;
          particle.style.opacity = opacity;
        }
        
        particle.dataset.life = life;
      });
      
      requestAnimationFrame(() => this.animate());
    }

    start() {
      this.isActive = true;
      this.animate();
    }

    stop() {
      this.isActive = false;
    }
  }

  // Initialize particle system
  const particleSystem = new ParticleSystem(particleContainer);

  window.addEventListener('scroll', () => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    // Scroll image scale
    if(sectionTop < windowHeight && sectionTop > -windowHeight){
      const scrollPercent = 1 - (sectionTop / windowHeight);
      const minScale = 0.5;
      const maxScale = 1.2;
      const scale = minScale + scrollPercent * (maxScale - minScale);
      image.style.transform = `translateX(-50%) scale(${scale})`;

      const minOpacity = 0.8;
      const maxOpacity = 1;
      const opacity = minOpacity + scrollPercent * (maxOpacity - minOpacity);
      image.style.opacity = opacity;
      
      // Start particles when section is visible
      if (sectionTop < windowHeight && !particleSystem.isActive) {
        particleSystem.start();
      }
    }

    // Typing effect trigger
    if (!animationTriggered && sectionTop < windowHeight * 0.8) {
      cinematicParagraph.classList.add('animate');
      animationTriggered = true;
      
      // Add completed class to lines
      const typingConfig = [
        { line: '.line1', duration: 3000, delay: 0 },
        { line: '.line2', duration: 3000, delay: 3500 },
        { line: '.line3', duration: 3000, delay: 7000 },
        { line: '.line4', duration: 3000, delay: 10500 },
        { line: '.line5', duration: 3000, delay: 14000 }
      ];
      
      typingConfig.forEach(config => {
        setTimeout(() => {
          const element = document.querySelector(config.line);
          if (element) element.classList.add('completed');
        }, config.delay + config.duration);
      });
    }
  });
});

// Add this to your existing JavaScript

// Countdown Timer
function updateCountdown() {
  const countdownElement = document.querySelector('.countdown');
  if (!countdownElement) return;
  
  let seconds = 45;
  setInterval(() => {
    seconds--;
    if (seconds < 0) seconds = 45;
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    countdownElement.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, 1000);
}

// Stats Counter Animation
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    let current = 0;
    const increment = target / 50; // Divide animation into 50 steps
    
    const updateNumber = () => {
      current += increment;
      if (current < target) {
        stat.textContent = Math.floor(current);
        requestAnimationFrame(updateNumber);
      } else {
        stat.textContent = target;
      }
    };
    
    updateNumber();
  });
}

// Intersection Observer for section three animations
const battleSection = document.querySelector('.battle-section');
if (battleSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Start stats counter when section becomes visible
        animateStats();
        
        // Add battle class for additional animations
        entry.target.classList.add('battle-visible');
      }
    });
  }, { threshold: 0.3 });
  
  observer.observe(battleSection);
}

// Initialize countdown
updateCountdown();

// Add parallax effect to background
window.addEventListener('scroll', () => {
  const battleBg = document.querySelector('.battle-bg');
  if (battleBg) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;
    battleBg.style.transform = `translateY(${rate}px)`;
  }
});

// Add this to your existing JavaScript

// Mode Rotation Timer
function startModeTimer() {
  const hoursEl = document.querySelector('.timer-hours');
  const minutesEl = document.querySelector('.timer-minutes');
  const secondsEl = document.querySelector('.timer-seconds');
  
  if (!hoursEl || !minutesEl || !secondsEl) return;
  
  let hours = 2;
  let minutes = 15;
  let seconds = 30;
  
  setInterval(() => {
    seconds--;
    
    if (seconds < 0) {
      seconds = 59;
      minutes--;
    }
    
    if (minutes < 0) {
      minutes = 59;
      hours--;
    }
    
    if (hours < 0) {
      hours = 2;
      minutes = 15;
      seconds = 30;
    }
    
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
  }, 1000);
}

// Intersection Observer for game modes section
const modesSection = document.querySelector('.game-modes-section');
if (modesSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('modes-visible');
        
        // Animate cards sequentially
        const cards = entry.target.querySelectorAll('.mode-card');
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 200);
        });
      }
    });
  }, { threshold: 0.2 });
  
  observer.observe(modesSection);
}

// Initialize timer
startModeTimer();

// Parallax effect for background
window.addEventListener('scroll', () => {
  const modesBg = document.querySelector('.modes-background');
  if (modesBg) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    modesBg.style.transform = `translateY(${rate}px)`;
  }
});

// Add this to your existing JavaScript

// Image Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = document.querySelector('.modal-close');
  const prevBtn = document.querySelector('.modal-prev');
  const nextBtn = document.querySelector('.modal-next');
  const galleryPieces = document.querySelectorAll('.gallery-piece');
  
  let currentImageIndex = 0;
  const images = [];

  // Collect all images data
  galleryPieces.forEach((piece, index) => {
    const img = piece.querySelector('.dynamic-image');
    const caption = piece.querySelector('.caption-main')?.textContent || 'PUBG Experience';
    const subCaption = piece.querySelector('.caption-sub')?.textContent || '';
    
    images.push({
      src: img.src,
      alt: img.alt,
      caption: caption,
      subCaption: subCaption,
      element: piece
    });

    // Add click event to each piece
    piece.addEventListener('click', function(e) {
      e.stopPropagation();
      const imageSrc = this.querySelector('.dynamic-image').src;
      const mainCaption = this.querySelector('.caption-main')?.textContent || 'PUBG Experience';
      const subCaption = this.querySelector('.caption-sub')?.textContent || '';
      
      currentImageIndex = index;
      openModal(imageSrc, mainCaption, subCaption);
    });
  });

  // Open modal function
  function openModal(src, caption, subCaption) {
    modalImg.src = src;
    modalCaption.innerHTML = `${caption} <span style="font-size: 14px; color: #888; display: block;">${subCaption}</span>`;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Add glitch effect on open
    modalImg.style.animation = 'glitchModal 0.5s ease';
    setTimeout(() => {
      modalImg.style.animation = '';
    }, 500);
  }

  // Close modal
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  });

  // Click outside to close
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  });

  // Previous image
  prevBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    const imgData = images[currentImageIndex];
    modalImg.src = imgData.src;
    modalCaption.innerHTML = `${imgData.caption} <span style="font-size: 14px; color: #888; display: block;">${imgData.subCaption}</span>`;
    
    // Add slide animation
    modalImg.style.animation = 'slideLeft 0.3s ease';
    setTimeout(() => {
      modalImg.style.animation = '';
    }, 300);
  });

  // Next image
  nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    const imgData = images[currentImageIndex];
    modalImg.src = imgData.src;
    modalCaption.innerHTML = `${imgData.caption} <span style="font-size: 14px; color: #888; display: block;">${imgData.subCaption}</span>`;
    
    // Add slide animation
    modalImg.style.animation = 'slideRight 0.3s ease';
    setTimeout(() => {
      modalImg.style.animation = '';
    }, 300);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('show')) return;
    
    if (e.key === 'Escape') {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    } else if (e.key === 'ArrowLeft') {
      prevBtn.click();
    } else if (e.key === 'ArrowRight') {
      nextBtn.click();
    }
  });

  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glitchModal {
      0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
      10% { transform: translate(-10px, 5px); filter: hue-rotate(90deg); }
      20% { transform: translate(10px, -5px); filter: hue-rotate(180deg); }
      30% { transform: translate(-5px, -5px); filter: hue-rotate(270deg); }
      40% { transform: translate(5px, 5px); filter: hue-rotate(360deg); }
      50% { transform: translate(-5px, 0); filter: hue-rotate(0deg); }
    }
    
    @keyframes slideLeft {
      from { transform: translateX(-50px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideRight {
      from { transform: translateX(50px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
});

// Add this to your existing JavaScript file

// Image Rotation Gallery
document.addEventListener('DOMContentLoaded', function() {
  // Gallery image rotation
  const galleryImages = document.querySelectorAll('.gallery-img');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const currentImgSpan = document.getElementById('currentImgNum');
  const countdownSpan = document.getElementById('countdown');
  
  if (!galleryImages.length) return;
  
  let currentIndex = 0;
  let countdown = 3;
  let intervalId;
  
  // Function to show image by index
  function showImage(index) {
    // Update images
    galleryImages.forEach(img => img.classList.remove('active'));
    galleryImages[index].classList.add('active');
    
    // Update thumbnails
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnails[index].classList.add('active');
    
    // Update counter
    if (currentImgSpan) {
      currentImgSpan.textContent = index + 1;
    }
    
    // Reset countdown
    countdown = 3;
    if (countdownSpan) {
      countdownSpan.textContent = countdown;
    }
  }
  
  // Function to next image
  function nextImage() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    showImage(currentIndex);
  }
  
  // Start auto rotation
  function startRotation() {
    if (intervalId) clearInterval(intervalId);
    
    intervalId = setInterval(() => {
      countdown--;
      if (countdownSpan) {
        countdownSpan.textContent = countdown;
      }
      
      if (countdown <= 0) {
        nextImage();
      }
    }, 1000);
  }
  
  // Click on thumbnails
  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      currentIndex = index;
      showImage(currentIndex);
      
      // Restart countdown
      countdown = 3;
      if (countdownSpan) {
        countdownSpan.textContent = countdown;
      }
      
      // Reset interval
      if (intervalId) {
        clearInterval(intervalId);
        startRotation();
      }
    });
  });
  
  // Start rotation
  startRotation();
  
  // Form submission
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Show sending status
      if (formStatus) {
        formStatus.textContent = 'TRANSMITTING MESSAGE...';
        formStatus.style.color = '#ffcc00';
      }
      
      // Simulate form submission (replace with actual AJAX call)
      setTimeout(() => {
        if (formStatus) {
          formStatus.textContent = '✓ MESSAGE SENT SUCCESSFULLY!';
          formStatus.style.color = '#00ff00';
        }
        contactForm.reset();
        
        // Reset status after 3 seconds
        setTimeout(() => {
          if (formStatus) {
            formStatus.textContent = '';
          }
        }, 3000);
      }, 1500);
    });
  }
  
  // Input animations
  const formInputs = document.querySelectorAll('.form-input, .form-textarea');
  
  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
    });
  });
});

// Add this to your existing JavaScript file

// Map Pins Interaction
document.addEventListener('DOMContentLoaded', function() {
  const pinContainers = document.querySelectorAll('.pin-container');
  const locationBtns = document.querySelectorAll('.location-btn');
  
  if (!pinContainers.length) return;
  
  // Function to close all popups
  function closeAllPopups() {
    document.querySelectorAll('.pin-popup').forEach(popup => {
      popup.classList.remove('active');
    });
    
    locationBtns.forEach(btn => {
      btn.classList.remove('active');
    });
  }
  
  // Open popup for specific location
  function openPopup(locationId) {
    closeAllPopups();
    
    const popup = document.getElementById(`popup-${locationId}`);
    if (popup) {
      popup.classList.add('active');
    }
    
    // Highlight corresponding button
    locationBtns.forEach(btn => {
      if (btn.dataset.location === locationId) {
        btn.classList.add('active');
      }
    });
  }
  
  // Add click event to pins
  pinContainers.forEach(container => {
    const pin = container.querySelector('.pin');
    const location = container.dataset.location;
    
    if (pin && location) {
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        openPopup(location);
      });
      
      // Hover effect to show pin label (already in CSS)
    }
  });
  
  // Add click event to location buttons
  locationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const location = btn.dataset.location;
      openPopup(location);
      
      // Find the pin position and animate to it (optional)
      const pin = document.querySelector(`.pin[style*="top:"][data-location="${location}"]`);
      if (pin) {
        pin.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    });
  });
  
  // Close popup when clicking close button
  document.querySelectorAll('.popup-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllPopups();
    });
  });
  
  // Close popup when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.pin-popup') && !e.target.closest('.pin')) {
      closeAllPopups();
    }
  });
  
  // Escape key to close popup
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllPopups();
    }
  });
  
  // Add data-location to pins for button navigation
  pinContainers.forEach(container => {
    const pin = container.querySelector('.pin');
    if (pin) {
      pin.dataset.location = container.dataset.location;
    }
  });
});




// Background Image Rotation
document.addEventListener('DOMContentLoaded', function() {
  const bgImages = document.querySelectorAll('.bg-rotating-image');
  
  if (!bgImages.length) return;
  
  let currentIndex = 0;
  
  function nextBgImage() {
    bgImages[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % bgImages.length;
    bgImages[currentIndex].classList.add('active');
  }
  
  setInterval(nextBgImage, 3000);
});

// Add this to your existing JavaScript file

// Add this to your existing JavaScript file

// Map Pins with Multiple Images
document.addEventListener('DOMContentLoaded', function() {
  const pinContainers = document.querySelectorAll('.pin-container');
  
  pinContainers.forEach(container => {
    const popup = container.querySelector('.pin-popup');
    if (!popup) return;
    
    const images = popup.querySelectorAll('.popup-image');
    const dots = popup.querySelectorAll('.nav-dot');
    let currentIndex = 0;
    let rotationInterval;
    
    // Function to show specific image
    function showImage(index) {
      images.forEach(img => img.classList.remove('active'));
      images[index].classList.add('active');
      
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
      
      currentIndex = index;
    }
    
    // Function to next image
    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    }
    
    // Start rotation when popup is opened
    function startRotation() {
      if (rotationInterval) clearInterval(rotationInterval);
      rotationInterval = setInterval(nextImage, 1500);
    }
    
    // Stop rotation when popup is closed
    function stopRotation() {
      if (rotationInterval) {
        clearInterval(rotationInterval);
        rotationInterval = null;
      }
    }
    
    // Click on dots to manually change image
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(index);
        stopRotation();
        startRotation();
      });
    });
    
    // Open popup on pin click
    const pin = container.querySelector('.pin');
    if (pin) {
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        
        document.querySelectorAll('.pin-popup').forEach(p => {
          if (p !== popup) p.classList.remove('active');
        });
        
        popup.classList.add('active');
        showImage(0);
        startRotation();
      });
    }
    
    // Close popup when clicking close button
    const closeBtn = popup.querySelector('.popup-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        popup.classList.remove('active');
        stopRotation();
      });
    }
  });
  
  // Close popup when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.pin-popup') && !e.target.closest('.pin')) {
      document.querySelectorAll('.pin-popup').forEach(popup => {
        popup.classList.remove('active');
      });
    }
  });
  
  // Location buttons functionality
  const locationBtns = document.querySelectorAll('.location-btn');
  
  locationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const location = btn.dataset.location;
      const pinContainer = document.querySelector(`.pin-container[data-location="${location}"]`);
      
      if (pinContainer) {
        document.querySelector('.map-wrapper').scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        
        const pin = pinContainer.querySelector('.pin');
        if (pin) {
          setTimeout(() => pin.click(), 500);
        }
      }
    });
  });
});