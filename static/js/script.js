// script.js
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

// ==========================
// Drag & Drop file upload
// ==========================
document.addEventListener('DOMContentLoaded', function() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const submitBtn = document.getElementById('submitBtn');
  const uploadForm = document.getElementById('uploadForm');

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      dropZone.classList.add('dragover');
      dropZone.style.boxShadow = "0 0 25px cyan";
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
      dropZone.style.boxShadow = "none";
    });

    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      dropZone.style.boxShadow = "none";
      
      if (e.dataTransfer.files.length) {
        handleFileSelection(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        handleFileSelection(fileInput.files[0]);
      }
    });
  }

  function handleFileSelection(file) {
    if (file && file.name.toLowerCase().endsWith('.csv')) {
      fileInput.files = createFileList(file);
      dropZone.querySelector('p').textContent = file.name;
      dropZone.querySelector('i').className = 'fas fa-file-csv';
      submitBtn.disabled = false;
      
      // Add a checkmark animation
      dropZone.classList.add('file-selected');
    } else {
      alert('Please select a valid CSV file.');
    }
  }

  // Helper function to create a FileList-like object
  function createFileList(file) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
  }

  // Form submission handling
  if (uploadForm) {
    uploadForm.addEventListener('submit', function(e) {
      if (!fileInput.files.length) {
        e.preventDefault();
        alert('Please select a CSV file to upload.');
        return;
      }
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    });
  }
});

// add 
// ==========================
// Password strength meter
// ==========================
const passwordInput = document.getElementById("password");
if (passwordInput) {
  const strengthBar = document.getElementById("password-strength");
  
  passwordInput.addEventListener("input", () => {
    const val = passwordInput.value;
    let strength = 0;

    if (val.length > 0) strength++;
    if (val.length >= 8) strength++;
    if (val.match(/[a-z]/)) strength++;
    if (val.match(/[A-Z]/)) strength++;
    if (val.match(/[0-9]/)) strength++;
    if (val.match(/[^a-zA-Z0-9]/)) strength++;

    // Update strength bar
    strengthBar.className = "password-strength";
    if (strength > 0) {
      if (strength <= 2) {
        strengthBar.classList.add("weak");
      } else if (strength <= 4) {
        strengthBar.classList.add("medium");
      } else {
        strengthBar.classList.add("strong");
      }
    }
  });
}