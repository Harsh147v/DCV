// Cyberpunk Background Animation
const canvas = document.getElementById("bg-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.color = `hsl(${Math.random() * 60 + 180}, 100%, 70%)`;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      this.draw();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 150; i++) particles.push(new Particle());
  }
  
  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 - dist/600})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => p.update());
    connectParticles();
    requestAnimationFrame(animate);
  }
  
  initParticles();
  animate();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  });
}

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Enhanced 3D Tile Effects
document.querySelectorAll(".hero-tile").forEach(tile => {
  tile.addEventListener("mousemove", (e) => {
    const rect = tile.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const angleY = (x - centerX) / 25;
    const angleX = (centerY - y) / 25;
    
    const glow = tile.parentElement.querySelector('.tile-glow');
    const img = tile.querySelector('.tile-image');
    
    tile.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
    if (img) {
      img.style.transform = `translateZ(20px) rotateY(${angleY}deg) rotateX(${angleX}deg)`;
    }
    glow.style.opacity = '0.7';
    glow.style.transform = `perspective(1000px) translateZ(0)`;
  });
  
  tile.addEventListener("mouseleave", () => {
    tile.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    const img = tile.querySelector('.tile-image');
    if (img) {
      img.style.transform = 'translateZ(0) rotateY(0) rotateX(0)';
    }
    const glow = tile.parentElement.querySelector('.tile-glow');
    glow.style.opacity = '0';
  });
});

// Feature card hover effect
document.querySelectorAll(".feature-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const angleY = (x - centerX) / 20;
    const angleX = (centerY - y) / 20;
    const img = card.querySelector('.feature-image');
    
    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
    if (img) {
      img.style.transform = `translateZ(20px) rotateY(${angleY}deg) rotateX(${angleX}deg)`;
    }
  });
  
  card.addEventListener("mouseleave", () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    const img = card.querySelector('.feature-image');
    if (img) {
      img.style.transform = 'translateZ(0) rotateY(0) rotateX(0)';
    }
  });
});

// Stats counter animation
function animateCounter() {
  const counters = document.querySelectorAll('.stat-value');
  
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-count');
    const count = +counter.innerText;
    
    if (count < target) {
      // Calculate increment to ensure we reach the target
      const increment = Math.ceil(target / 100);
      counter.innerText = Math.min(count + increment, target);
      setTimeout(animateCounter, 20);
    }
  });
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.3,
  rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('stats-section')) {
        animateCounter();
      }
      
      if (entry.target.classList.contains('animate-fade')) {
        entry.target.style.animation = 'fadeIn 1.5s ease forwards';
      }
      
      if (entry.target.classList.contains('animate-slide')) {
        entry.target.style.animation = 'slideIn 1s ease forwards';
      }
      
      if (entry.target.classList.contains('animate-zoom')) {
        entry.target.style.animation = 'zoomIn 1s ease forwards';
      }
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.stats-section, .animate-fade, .animate-slide, .animate-zoom').forEach(el => {
  observer.observe(el);
});

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Animate hero elements
  setTimeout(() => {
    const heroTitle = document.querySelector('.hero-section h1');
    if (heroTitle) {
      heroTitle.style.opacity = "1";
      heroTitle.style.transform = "translateY(0)";
    }
  }, 300);
  
  // Start counter animation if stats are in view
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      animateCounter();
    }
  }
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

// Preload images for better performance
function preloadImages() {
  const images = [
    "https://cdn3d.iconscout.com/3d/premium/thumb/ai-3d-5617592-4674325.png",
    "https://cdn3d.iconscout.com/3d/premium/thumb/user-3812318-3187499.png",
    "https://cdn3d.iconscout.com/3d/premium/thumb/data-cleansing-9299975.png",
    "https://cdn3d.iconscout.com/3d/premium/thumb/data-visualization-9299976.png",
    "https://cdn3d.iconscout.com/3d/premium/thumb/data-analysis-9299974.png",
    "https://cdn3d.iconscout.com/3d/premium/thumb/artificial-intelligence-3d-icon-9301881.png",
    "https://cdn3d.iconscout.com/3d/premium/thumb/upload-data-9299978.png",
    "https://cdn3d.iconscout.com/3d/premium/thumb/data-chart-9299973.png",
    "https://cdn3d.iconscout.com/3d/premium/thumb/team-collaboration-9299977.png",
    "https://cdn3d.iconscout.com/3d/premium/thumb/responsive-design-9299979.png",
    "https://cdn3d.iconscout.com/3d/premium/thumb/twitter-4460334-3696582.png",
    "https://cdn3d.iconscout.com/3d/premium/thumb/github-4460329-3696577.png",
    "https://cdn3d.iconscout.com/3d/premium/thumb/linkedin-4460333-3696581.png",
    "https://cdn3d.iconscout.com/3d/premium/thumb/discord-4460330-3696578.png"
  ];
  
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// Preload images when page loads
window.addEventListener('load', preloadImages);