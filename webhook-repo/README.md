# 📡 GitHub Webhook Event Logger

A lightweight Flask-based server to receive GitHub Webhook events, store them in a MongoDB database, and visualize them on a live web dashboard.

---

## 📖 Project Overview

This application listens for webhook events (like `push`, `pull_request`, etc.) from a GitHub repository and logs them into a MongoDB collection. The events are displayed in real-time on a web page, showing details like event type, author, branch, and time of occurrence in human-readable format.

---

## 🚀 Features

- 📡 Receive GitHub Webhook events via Flask server
- 📝 Process and store events into MongoDB database
- 🖥️ Clean, responsive dashboard to view event details
- ⏰ Relative timestamp display (e.g. "5 minutes ago")
- 🔄 Auto-refreshing event list every 15 seconds
- 🗑️ Clear All Events button to reset event logs

---

## 📂 Project Structure

webhook-repo/
├── app.py # Flask server to handle webhooks
├── templates/
│ └── events.html # Event viewer page
├── static/
│ └── events.js # Frontend JavaScript logic
├── requirements.txt # (optional) Python dependencies
└── README.md # Project documentation

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies

pip install flask pymongo

2️⃣ Start Local MongoDB Server
Ensure your MongoDB is running locally at mongodb://localhost:27017

3️⃣ Run Flask App

.\.venv\Scripts\activate

python app.py   http://127.0.0.1:5000/events-page

4️⃣ Start Ngrok Tunnel (for GitHub to reach your localhost)

ngrok http 5000

5️⃣ Configure GitHub Webhook
In your repo → Settings → Webhooks → Add webhook

Payload URL: https://b5e6-152-57-96-251.ngrok-free.app/webhook

Content type: application/json

Events: Just the push event or Send me everything

🌐 Access Dashboard
Open in browser:

bash
Copy
Edit
http://localhost:5000/events-page
Example Event Display
Type: push

Author: username

To Branch: main

Time: 5 minutes ago

📦 Requirements
Python 3.x
Flask
PyMongo
MongoDB
Ngrok
Day.js (via CDN in HTML)

✨ Author

Manjunatha
📍 Bengaluru, Karnataka
📧 shankarmanjunath184@gmail.com
🌐 GitHub

📜 License
This project is for assessment/demo purposes only.


## ✅ How to Use
1. Copy this to your project directory as `README.md`
2. Add it to git:
   bash
   git add README.md
   git commit -m "Add project README"
   git push origin main
