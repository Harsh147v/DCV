# 🚀 Analyze Data (DCV)

**Analyze Data** is a modern, AI-powered **Data Cleaning & Visualization Web Platform** built using **Flask, Python, and advanced frontend technologies**.  
It enables users to **upload datasets, clean inconsistencies, and generate interactive visualizations** — all from a futuristic, responsive dashboard.

---

## 🌐 Live Concept

> Upload ➜ Clean ➜ Visualize ➜ Analyze ➜ Export  
A complete **end-to-end data analytics workflow** in one platform.

---

## 🧠 What Problem Does It Solve?

Data analysts, students, and teams often struggle with:
- Dirty CSV files
- Missing values & duplicates
- Manual visualization setup
- Switching between multiple tools

**Analyze Data** solves this by offering:
- ⚡ Instant data cleaning
- 📊 Real-time chart generation
- 🧠 AI-assisted processing
- 🎨 Beautiful, interactive UI

---

## ✨ Key Features

### 🏠 Home Page
- High-impact hero section with animated visuals
- Clear product positioning & CTA
- Feature highlights (AI Analysis, Real-time Processing, Visualization)
- Testimonials & social proof
- Fully responsive design

---

### 📊 Dashboard
- Central command center after login
- Quick access tiles:
  - 🧹 Clean Data
  - 📈 Analyze Data
- Animated background (canvas + floating particles)
- User profile dropdown
- Live stats (users, files processed, accuracy)

---

### 🧹 Data Cleaning Studio
- Upload CSV files
- Smart cleaning options:
  - Remove duplicates
  - Fix missing values
  - Standardize formats
  - Remove outliers
- AI-style feedback after processing
- Download cleaned CSV
- Cleaning statistics (rows processed, issues fixed)

---

### 📈 Data Visualization Studio
- Upload CSV and instantly visualize data
- Supports:
  - Bar Charts
  - Line Charts
  - Scatter Plots
  - Pie / Doughnut Charts
  - Radar & Polar Area Charts
- Select:
  - X-axis & Y-axis columns
  - Chart type
  - Color themes
- Interactive charts using **Chart.js**
- Export charts & data

---

### 👥 About Us Page
- Project vision & mission
- Animated statistics
- Team profiles with social links
- Technology stack overview
- Values & future direction
- CTA for onboarding users

---

## 🧰 Tech Stack

### 🖥️ Frontend
- HTML5, CSS3
- JavaScript (Vanilla)
- Chart.js
- PapaParse (CSV parsing)
- Select2
- Google Fonts
- Font Awesome & 3D Icons
- Canvas animations & particle effects

### ⚙️ Backend
- Python
- Flask
- Jinja2 Templates

### 📂 File Handling
- CSV Upload & Processing
- Server-side cleaning logic
- Downloadable outputs

---

## 📁 Project Structure

```
DCV/
│
├── app.py                     # Main Flask application
│
├── templates/                 # HTML templates
│   ├── home.html
│   ├── dashboard.html
│   ├── clean.html
│   ├── visualize.html
│   └── aboutus.html
│
├── static/
│   ├── css/                   # Page-specific styles
│   ├── js/                    # Page-specific scripts
│   └── images/                # UI & illustration assets
│
├── uploads/                   # Uploaded CSV files
│
├── .gitignore
└── README.md
```

---

## 🏁 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Harsh147v/DCV.git
cd DCV
```

### 2️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```

### 3️⃣ Run the App
```bash
python app.py
```

### 4️⃣ Open in Browser
```
http://localhost:5000
```

---

## 🔐 Routes Overview

| Route        | Description               |
| ------------ | ------------------------- |
| `/`          | Home page                 |
| `/login`     | Login / Entry point       |
| `/dashboard` | Main dashboard            |
| `/clean`     | Data cleaning studio      |
| `/visualize` | Data visualization studio |
| `/aboutus`   | About the team & platform |

---

## 🚀 Future Enhancements

- 🔐 User authentication (JWT / Firebase)
- ☁️ Cloud storage (AWS / Firebase)
- 🧠 AI insights & anomaly detection
- 📤 Excel & JSON support
- 👥 Team collaboration & sharing
- 📱 Progressive Web App (PWA)

---

## 👨‍💻 Team

- **Harshvardhan Hatiya**  
  *Lead Developer – Backend & Data Visualization*  
  GitHub: https://github.com/Harsh147v

- **Nikhil Shimpy**  
  *UI/UX Designer & Frontend Developer*  
  GitHub: https://github.com/NikhilShimpy

---

## 📜 License

This project is currently **unlicensed**.  
You may add an **MIT License** or another open-source license as needed.

---

## ⭐ Support

If you like this project:

- ⭐ Star the repository  
- 🍴 Fork it  
- 🛠️ Contribute improvements  
- 📢 Share with others  

---

**Analyze Data — Turning Raw Data into Actionable Insights 🚀**