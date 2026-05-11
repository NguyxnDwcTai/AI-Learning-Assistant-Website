<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  
  <br />
  <br />
  
  <h1>🤖 AI-Powered Learning Assistant Website</h1>
  <p>An intelligent platform designed to accelerate learning through AI-driven document analysis, interactive flashcards, quizzes, and a smart chatbot powered by AI.</p>
</div>

---

## ✨ Features

- **🧠 Smart AI Chatbot**: Upload your documents and chat with an AI that understands the context of your study materials, powered by Google Gemini API.
- **📄 Document Parsing**: Seamlessly upload and parse PDF documents to extract text and analyze content for study.
- **🗂️ Interactive Flashcards**: Auto-generate or manually create flashcards from your study materials. Review them with an intuitive interface.
- **📝 Quizzes**: Test your knowledge with AI-generated quizzes based on your uploaded documents.
- **📈 Progress Tracking**: Keep track of your learning journey and monitor your performance over time.
- **🔐 Secure Authentication**: Full JWT-based user authentication and authorization system.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Markdown Rendering**: React Markdown & Syntax Highlighter

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **File Parsing**: `pdf-parse` & Multer
- **Security**: bcryptjs & jsonwebtoken

## 📁 Project Structure

```text
📦 AI-Powered Learning Assistant App
 ┣ 📂 backend                 # Node.js Express Server
 ┃ ┣ 📂 config                # Database and Multer configs
 ┃ ┣ 📂 controllers           # Request handlers
 ┃ ┣ 📂 middleware            # JWT Auth & Error handling
 ┃ ┣ 📂 models                # Mongoose schemas
 ┃ ┣ 📂 routes                # Express routes
 ┃ ┣ 📂 utils                 # Gemini Service, PDF parser, Text chunker
 ┃ ┣ 📜 server.js             # Entry point
 ┃ ┗ 📜 package.json
 ┗ 📂 frontend                # React Frontend Application
   ┗ 📂 ai-learning-assistant
     ┣ 📂 src
     ┃ ┣ 📂 components        # Reusable UI components
     ┃ ┣ 📂 context           # React Context (Auth)
     ┃ ┣ 📂 pages             # Application pages
     ┃ ┣ 📂 services          # Axios API services
     ┃ ┣ 📂 utils             # API paths and helpers
     ┃ ┣ 📜 App.jsx           # Root component
     ┃ ┗ 📜 main.jsx          # Entry point
     ┗ 📜 package.json
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/NguyxnDwcTai/AI-Learning-Assistant-Website.git
cd AI-Learning-Assistant-Website
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on the following template:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=8000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
MAX_FILE_SIZE=10485760
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend/ai-learning-assistant
npm install
```

Start the development server:
```bash
npm run dev
```

The application should now be running on `http://localhost:5173`.

## 🔒 Environment Variables

| Variable | Description |
| -------- | ----------- |
| `MONGODB_URI` | Your MongoDB connection string |
| `PORT` | Port for the backend server (default: 8000) |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `JWT_EXPIRE` | Expiration time for JWT (e.g., `7d`) |
| `GEMINI_API_KEY` | API Key for Google Gemini GenAI |
| `MAX_FILE_SIZE` | Maximum file upload size in bytes |

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📜 License
This project is licensed under the ISC License.
