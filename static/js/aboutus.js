// about.js
// ==========================
// Futuristic Cyberpunk UI JS
// ==========================

// Background animation
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
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }
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

// Stats counter animation
function animateCounter() {
  const counters = document.querySelectorAll('.stat-value');
  const speed = 200;
  
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-count');
    const count = +counter.innerText;
    
    if (count < target) {
      const increment = Math.ceil(target / speed);
      counter.innerText = Math.min(count + increment, target);
      setTimeout(animateCounter, 1);
    }
  });
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Start counter animation if stats are in view
  const missionSection = document.querySelector('.mission-section');
  if (missionSection) {
    const rect = missionSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      animateCounter();
    }
  }
  
  // Add hover effects to team cards
  const teamCards = document.querySelectorAll('.team-card');
  teamCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const imageGlow = card.querySelector('.image-glow');
      if (imageGlow) {
        imageGlow.style.background = 'rgba(0, 255, 204, 0.3)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const imageGlow = card.querySelector('.image-glow');
      if (imageGlow) {
        imageGlow.style.background = 'rgba(0, 255, 204, 0.2)';
      }
    });
  });
});