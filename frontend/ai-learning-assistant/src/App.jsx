import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import DocumentListPage from "./pages/Documents/DocumentListPage";
import DocumentDetailPage from "./pages/Documents/DocumentDetailPage";
import FlashcardListPage from "./pages/Flashcards/FlashcardListPage";
import FlashcardPage from "./pages/Flashcards/FlashcardPage";
import QuizTakePage from "./pages/Quizzes/QuizTakePage";
import QuizResultPage from "./pages/Quizzes/QuizResultPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import { useAuth } from "./context/AuthContext";

const APP_NAME = "AI Learning Assistant";

const PageTitle = ({ title, children }) => {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
  }, [title]);
  return children;
};

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<PageTitle title="Login"><LoginPage /></PageTitle>} />
        <Route path="/register" element={<PageTitle title="Register"><RegisterPage /></PageTitle>} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<PageTitle title="Dashboard"><DashboardPage /></PageTitle>} />
          <Route path="/documents" element={<PageTitle title="My Documents"><DocumentListPage /></PageTitle>} />
          <Route path="/documents/:id" element={<PageTitle title="Document Detail"><DocumentDetailPage /></PageTitle>} />
          <Route path="/flashcards" element={<PageTitle title="Flashcards"><FlashcardListPage /></PageTitle>} />
          <Route path="/documents/:id/flashcards" element={<PageTitle title="Study Flashcards"><FlashcardPage /></PageTitle>} />
          <Route path="/quizzes/:quizId" element={<PageTitle title="Take Quiz"><QuizTakePage /></PageTitle>} />
          <Route path="/quizzes/:quizId/results" element={<PageTitle title="Quiz Results"><QuizResultPage /></PageTitle>} />
          <Route path="/profile" element={<PageTitle title="Profile Settings"><ProfilePage /></PageTitle>} />
        </Route>

        <Route path="*" element={<PageTitle title="Page Not Found"><NotFoundPage /></PageTitle>} />
      </Routes>
    </Router>
  );
};

export default App;
