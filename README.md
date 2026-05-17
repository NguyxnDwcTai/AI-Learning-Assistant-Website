<div align="center">

<img src="https://img.shields.io/badge/AI%20Powered-Gemini%202.5-blue?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI"/>
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
<img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
<img src="https://img.shields.io/badge/License-ISC-yellow.svg?style=for-the-badge" alt="ISC License"/>

<br/>
<br/>

<h1>🤖 AI-Powered Learning Assistant</h1>

<p align="center">
  <strong>Accelerate your learning journey with intelligent document analysis and an AI study companion.</strong><br/>
  Transform any PDF into interactive flashcards, dynamic quizzes, and a smart chat experience — powered by Google Gemini AI.
</p>

<br/>

<a href="https://github.com/NguyxnDwcTai/AI-Learning-Assistant-Website">
  <img src="https://img.shields.io/badge/⭐_Star_this_Repo-FFD700?style=for-the-badge" alt="Star this repo"/>
</a>
&nbsp;
<a href="https://github.com/NguyxnDwcTai/AI-Learning-Assistant-Website/issues">
  <img src="https://img.shields.io/badge/🐛_Report_Bug-FF4444?style=for-the-badge" alt="Report Bug"/>
</a>
&nbsp;
<a href="https://github.com/NguyxnDwcTai/AI-Learning-Assistant-Website/issues">
  <img src="https://img.shields.io/badge/✨_Request_Feature-00C48C?style=for-the-badge" alt="Request Feature"/>
</a>

</div>

---

## 📋 Table of Contents

- [✨ Overview](#-overview)
- [🎯 Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Environment Variables](#️-environment-variables)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [🤖 AI Integration](#-ai-integration)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## ✨ Overview

**AI-Powered Learning Assistant** is a full-stack educational platform designed to enhance your study workflow. By leveraging the advanced **Google Gemini AI**, the application analyzes your uploaded study materials and automatically generates study aids.

Whether you need to extract key concepts, drill down on terminology with flashcards, test your knowledge with quizzes, or just chat with an AI that perfectly understands your documents, this assistant has you covered.

> 🧠 **Study smarter, not harder** — turn any static document into an interactive learning experience.

---

## 🎯 Key Features

| Feature | Description |
|---|---|
| 📄 **Document Parsing** | Upload PDF documents to seamlessly extract and process text for AI analysis |
| 🤖 **Smart AI Chatbot** | Chat directly with an AI that understands the exact context of your uploaded materials |
| 🗂️ **Interactive Flashcards** | Auto-generate flashcards from your documents or manually create your own study decks |
| 📝 **Dynamic Quizzes** | Test your comprehension with AI-generated quizzes tailored to your content |
| 📈 **Progress Tracking** | Monitor your learning journey and track your performance over time |
| 🔐 **Secure Auth** | Robust JWT-based authentication system for user data privacy |
| 📱 **Modern UI** | Clean, responsive interface built with TailwindCSS and React |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│              React 19 + Vite + TailwindCSS                  │
│                                                             │
│   Dashboard ──► PDF Upload & Processing                     │
│        │                                                    │
│        ▼                                                    │
│   Study Modules: Chatbot / Flashcards / Quizzes             │
└──────────────────────────┬─────────────────────────────────┘
                           │  HTTP (Axios + JWT)
                           ▼
┌────────────────────────────────────────────────────────────┐
│                         SERVER                              │
│              Node.js + Express.js (REST API)                │
│                                                             │
│   PDF Parsing ───► pdf-parse & Multer                       │
│   AI Services ───► Google GenAI SDK (Gemini)                │
│   Core Logic ────► Auth / Users / Documents                 │
└──────────────────────────┬─────────────────────────────────┘
                           │  Mongoose ODM
                           ▼
                ┌─────────────────────┐
                │       MongoDB        │
                │  Users / Documents / │
                │   Flashcards / Data  │
                └─────────────────────┘
```

---

## 🛠️ Tech Stack

### 🖥️ Frontend
| Technology | Purpose |
|---|---|
| **React 19 & Vite** | UI Component Library & Fast Build Tool |
| **TailwindCSS 4** | Utility-first CSS Framework |
| **React Router DOM** | Client-side Routing |
| **Lucide React** | Beautiful, consistent icons |
| **React Markdown** | Rendering AI Chat & Content |

### ⚙️ Backend
| Technology | Purpose |
|---|---|
| **Node.js & Express.js** | JavaScript Runtime & Web Framework |
| **MongoDB & Mongoose** | NoSQL Database & Data Modeling |
| **@google/genai** | Google Gemini AI SDK Integration |
| **pdf-parse & Multer** | File Upload Handling & PDF Text Extraction |
| **JWT & bcryptjs** | Secure Authentication & Password Hashing |

---

## 📁 Project Structure

```text
AI-Learning-Assistant-Website/
│
├── 📂 backend/                 # Node.js Express Server
│   ├── 📂 config/              # Database and Multer configs
│   ├── 📂 controllers/         # Request handlers
│   ├── 📂 middleware/          # JWT Auth & Error handling
│   ├── 📂 models/              # Mongoose schemas
│   ├── 📂 routes/              # Express routes
│   ├── 📂 utils/               # AI Service, PDF parser, Text chunker
│   ├── 📜 server.js            # Entry point
│   └── 📜 package.json
│
└── 📂 frontend/                # React Frontend Application
    └── 📂 ai-learning-assistant/
        ├── 📂 src/
        │   ├── 📂 components/  # Reusable UI components
        │   ├── 📂 context/     # Global State & Auth Context
        │   ├── 📂 pages/       # Application views
        │   ├── 📂 services/    # Axios API integrations
        │   ├── 📂 utils/       # Helpers and Constants
        │   ├── 📜 App.jsx      # Root routing component
        │   └── 📜 main.jsx     # React DOM entry
        └── 📜 package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `/backend` directory based on this template:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# File Upload Limit
MAX_FILE_SIZE=10485760

# Google Gemini AI Integration
GEMINI_API_KEY=your_google_gemini_api_key
```

> 🔑 **Get your Gemini API Key** → [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18.x`
- **MongoDB Atlas** account or local MongoDB server
- **Google Gemini API Key**

### 1. Clone the Repository
```bash
git clone https://github.com/NguyxnDwcTai/AI-Learning-Assistant-Website.git
cd AI-Learning-Assistant-Website
```

### 2. Backend Setup
```bash
cd backend
npm install
# Configure your .env file here
npm run dev
```
*Server will start on `http://localhost:8000`*

### 3. Frontend Setup
```bash
cd ../frontend/ai-learning-assistant
npm install
npm run dev
```
*Application will be available at `http://localhost:5173`*

---

## 🤖 AI Integration

This platform heavily utilizes the **Google Gemini API** for intelligent document processing:
- **Context-Aware Chat:** When chatting, the AI is provided with chunked extracts of your PDF document to accurately answer questions based *only* on the material.
- **Flashcard & Quiz Generation:** The AI processes document chunks and outputs structured JSON (Questions, Answers, Multiple Choice options) that is directly parsed into the UI.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **ISC License**.

---

<div align="center">

**Made with ❤️ and powered by Google Gemini AI**

<br/>

<a href="https://github.com/NguyxnDwcTai/AI-Learning-Assistant-Website">
  <img src="https://img.shields.io/github/stars/NguyxnDwcTai/AI-Learning-Assistant-Website?style=social" alt="Stars"/>
</a>
&nbsp;
<a href="https://github.com/NguyxnDwcTai/AI-Learning-Assistant-Website/fork">
  <img src="https://img.shields.io/github/forks/NguyxnDwcTai/AI-Learning-Assistant-Website?style=social" alt="Forks"/>
</a>

</div>
