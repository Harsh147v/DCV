from flask import Flask, render_template, request, redirect, url_for, session, send_from_directory
from werkzeug.utils import secure_filename
import firebase_admin
from firebase_admin import credentials, auth, firestore
import pandas as pd
import numpy as np
import requests
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import os
import random
import json

# ----------------- 🔐 ENVIRONMENT VARIABLES -----------------
FIREBASE_API_KEY = os.environ.get("FIREBASE_API_KEY")
SECRET_KEY = os.environ.get("SECRET_KEY")

# ----------------- 🔹 FLASK APP -----------------
app = Flask(__name__)
app.secret_key = SECRET_KEY
app.debug = False

# ----------------- 🔥 FIREBASE SETUP -----------------
if not firebase_admin._apps:
    cred = credentials.Certificate(
        json.loads(os.environ.get("FIREBASE_SERVICE_ACCOUNT"))
    )
    firebase_admin.initialize_app(cred, {
        "storageBucket": "dcv-app-e256d.firebasestorage.app"
    })

db = firestore.client()

# ----------------- 🔹 CONSTANT (VERCEL SAFE) -----------------
UPLOAD_DIR = "/tmp"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ----------------- 🔹 HELPER: VERIFY USER -----------------
def verify_user(email, password):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    response = requests.post(url, json=payload)
    return response.json()

# ----------------- 🔹 ROUTES -----------------

@app.route("/")
def home():
    return render_template("home.html")

# ---------- SIGNUP ----------
@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]

        try:
            user = auth.create_user(
                email=email,
                password=password,
                display_name=username
            )
            db.collection("users").document(user.uid).set({
                "username": username,
                "email": email
            })
            return redirect(url_for("login"))
        except Exception as e:
            return f"Error: {e}"

    return render_template("signup.html")

# ---------- LOGIN ----------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        result = verify_user(email, password)

        if "idToken" in result:
            user_doc = db.collection("users").where("email", "==", email).get()
            username = user_doc[0].to_dict().get("username") if user_doc else email

            session["user"] = username
            session["email"] = email
            return redirect(url_for("dashboard"))

        error_message = result.get("error", {}).get("message", "Invalid credentials")
        return render_template("login.html", error=error_message)

    return render_template("login.html")

# ---------- DASHBOARD ----------
@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect(url_for("login"))
    return render_template("dashboard.html", username=session["user"])

# ---------- CLEAN DATA ----------
@app.route("/clean", methods=["GET", "POST"])
def clean_data():
    if "user" not in session:
        return redirect(url_for("login"))

    if request.method == "POST":
        file = request.files.get("file")
        if not file:
            return "No file uploaded"

        df = pd.read_csv(file)

        # 🔹 Cleaning Steps
        df.replace([np.inf, -np.inf], np.nan, inplace=True)
        df.drop_duplicates(inplace=True)

        str_cols = df.select_dtypes(include=["object"]).columns
        for col in str_cols:
            df[col] = df[col].astype(str).str.strip()

        for col in df.columns:
            if df[col].dtype in [np.float64, np.int64]:
                df[col].fillna(df[col].median(), inplace=True)
            else:
                df[col].fillna(
                    df[col].mode()[0] if not df[col].mode().empty else "Unknown",
                    inplace=True
                )

        for col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="ignore")

        num_cols = df.select_dtypes(include=[np.number]).columns
        for col in num_cols:
            if (df[col] >= 0).sum() > 0:
                df = df[df[col] >= 0]

        for col in num_cols:
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower = Q1 - 1.5 * IQR
            upper = Q3 + 1.5 * IQR
            df[col] = np.where(df[col] < lower, lower,
                               np.where(df[col] > upper, upper, df[col]))

        filename = secure_filename(f"cleaned_{file.filename}")
        filepath = os.path.join(UPLOAD_DIR, filename)
        df.to_csv(filepath, index=False)

        return f"""
        ✅ Data fully cleaned! 
        <a href='{url_for("download_file", filename=filename)}'>Download Cleaned File</a>
        """

    return render_template("clean.html")

@app.route("/download/<filename>")
def download_file(filename):
    return send_from_directory(UPLOAD_DIR, filename, as_attachment=True)

# ---------- VISUALIZE DATA ----------
@app.route("/visualize", methods=["GET", "POST"])
def visualize_data():
    if request.method == "POST":

        file = request.files.get("file")
        if file:
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_DIR, filename)
            file.save(filepath)

            df = pd.read_csv(filepath)
            return render_template(
                "visualize.html",
                columns=df.columns,
                filename=filename,
                chart=None
            )

        if request.form.get("csv_uploaded"):
            filename = request.form["filename"]
            filepath = os.path.join(UPLOAD_DIR, filename)
            df = pd.read_csv(filepath)

            x_col = request.form.get("x_column")
            y_col = request.form.get("y_column")
            chart_type = request.form.get("chart_type")

            plt.figure(figsize=(8, 6))
            if chart_type == "line":
                sns.lineplot(data=df, x=x_col, y=y_col)
            elif chart_type == "bar":
                sns.barplot(data=df, x=x_col, y=y_col)
            elif chart_type == "scatter":
                sns.scatterplot(data=df, x=x_col, y=y_col)
            elif chart_type == "hist":
                sns.histplot(df[x_col], kde=True)
            elif chart_type == "box":
                sns.boxplot(data=df, x=x_col, y=y_col)
            elif chart_type == "pie":
                df[x_col].value_counts().plot.pie(autopct="%1.1f%%")

            plt.tight_layout()
            chart_name = f"chart_{random.randint(1000,9999)}.png"
            chart_path = os.path.join(UPLOAD_DIR, chart_name)
            plt.savefig(chart_path)
            plt.close()

            return render_template(
                "visualize.html",
                columns=df.columns,
                filename=filename,
                chart=url_for("download_file", filename=chart_name)
            )

    return render_template("visualize.html", columns=[], filename=None, chart=None)

# ---------- ABOUT ----------
@app.route("/aboutus")
def about_us():
    return render_template("aboutus.html")

# ---------- LOGOUT ----------
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))
