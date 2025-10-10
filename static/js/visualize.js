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
// Data Visualization Logic
// ==========================
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Select2
  $('#xColumn, #yColumn, #chartType, #colorScheme').select2();
  
  // Get DOM elements
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('file');
  const generateBtn = document.getElementById('generateBtn');
  const uploadForm = document.getElementById('uploadForm');
  const chartActions = document.getElementById('chartActions');
  const downloadBtn = document.getElementById('downloadBtn');
  const exportDataBtn = document.getElementById('exportDataBtn');
  
  let chartInstance = null;
  let parsedData = null;
  let currentData = null;

  // Color schemes
  const colorSchemes = {
    cyberpunk: ['#00ffcc', '#ff00ff', '#0066ff', '#ff9900', '#cc00ff'],
    sunset: ['#ff512f', '#f09819', '#ff5f6d', '#ffc371', '#ff5f6d'],
    ocean: ['#00b4db', '#0083b0', '#00b4db', '#0083b0', '#00b4db'],
    forest: ['#56ab2f', '#a8e063', '#56ab2f', '#a8e063', '#56ab2f'],
    rainbow: ['#ff0000', '#ff9900', '#ffff00', '#00ff00', '#0000ff']
  };

  // Drag and drop functionality
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
      // Show loading state
      dropZone.querySelector('p').textContent = "Processing file...";
      dropZone.querySelector('i').className = 'fas fa-spinner fa-spin';
      
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
          parsedData = results.data;
          currentData = results.data;
          const columns = results.meta.fields;
          
          // Populate column selectors
          $('#xColumn, #yColumn').empty();
          columns.forEach(col => {
            $('#xColumn').append(new Option(col, col));
            $('#yColumn').append(new Option(col, col));
          });
          
          // Update UI
          dropZone.querySelector('p').textContent = file.name;
          dropZone.querySelector('i').className = 'fas fa-file-csv';
          generateBtn.disabled = false;
          
          // Add success animation
          dropZone.classList.add('file-selected');
        },
        error: function(error) {
          alert('Error parsing CSV file: ' + error);
          dropZone.querySelector('p').textContent = "Drop CSV file here or click to browse";
          dropZone.querySelector('i').className = 'fas fa-cloud-upload-alt';
        }
      });
    } else {
      alert('Please select a valid CSV file.');
    }
  }

  // Form submission - Generate Chart
  if (uploadForm) {
    uploadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!parsedData) {
        alert("Please upload a CSV file first!");
        return;
      }

      const xCol = $('#xColumn').val();
      const yCol = $('#yColumn').val();
      const chartType = $('#chartType').val();
      const colorScheme = $('#colorScheme').val();
      
      if (!xCol || !yCol) {
        alert("Please select both X and Y columns!");
        return;
      }

      // Show loading state
      generateBtn.disabled = true;
      generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
      
      // Process data
      const labels = parsedData.map(row => row[xCol]).filter(val => val !== undefined && val !== null);
      const values = parsedData.map(row => row[yCol]).filter(val => val !== undefined && val !== null);
      
      // Get colors based on selected scheme
      const colors = colorSchemes[colorScheme] || colorSchemes.cyberpunk;
      
      // Create chart
      setTimeout(() => {
        const ctx = document.getElementById('chart').getContext('2d');
        if (chartInstance) chartInstance.destroy();

        chartInstance = new Chart(ctx, {
          type: chartType === 'histogram' ? 'bar' : chartType,
          data: {
            labels: labels,
            datasets: [{
              label: `${yCol} vs ${xCol}`,
              data: values,
              borderColor: colors[0],
              backgroundColor: chartType === 'line' || chartType === 'scatter' 
                ? 'transparent' 
                : Array.isArray(colors) 
                  ? colors.map(color => color + '80') // Add transparency
                  : colors + '80',
              pointBackgroundColor: colors[1] || colors[0],
              borderWidth: 2,
              pointRadius: chartType === 'scatter' ? 5 : 3,
              pointHoverRadius: 7
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                labels: { 
                  color: '#00ffcc',
                  font: { size: 14 }
                } 
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#00ffcc',
                bodyColor: '#ffffff',
                borderColor: '#00ffcc',
                borderWidth: 1
              }
            },
            scales: {
              x: { 
                ticks: { color: '#00ffcc' },
                grid: { color: 'rgba(0, 255, 204, 0.1)' }
              },
              y: { 
                ticks: { color: '#00ffcc' },
                grid: { color: 'rgba(0, 255, 204, 0.1)' }
              }
            },
            animation: {
              duration: 2000,
              easing: 'easeOutQuart'
            }
          }
        });

        // Show chart actions
        chartActions.style.display = 'flex';
        
        // Reset button
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-chart-bar"></i> Generate Visualization';
      }, 1000);
    });
  }

  // Download chart as PNG
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      if (!chartInstance) {
        alert("No chart available to download!");
        return;
      }
      
      const link = document.createElement('a');
      link.href = chartInstance.toBase64Image();
      link.download = 'data_visualization.png';
      link.click();
    });
  }

  // Export data as CSV
  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', function() {
      if (!currentData) {
        alert("No data available to export!");
        return;
      }
      
      const csv = Papa.unparse(currentData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', 'visualization_data.csv');
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
});