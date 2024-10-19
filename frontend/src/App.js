import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import Learn from './components/Learn';
import Leaderboard from './components/Leaderboard';
import Game from './components/Game';
import Lesson from './components/Lesson';
import CompleteProfile from './components/CompleteProfile';
import ExpenseTracker from './components/ExpenseTracker';
import Quiz from './components/Quiz';
import Login from './components/Login';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
    }
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const handleLogin = (newUserId) => {
    setIsAuthenticated(true);
    setUserId(newUserId);
    localStorage.setItem('userId', newUserId);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem('userId');
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin}/>} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
              <>
                <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/complete-profile-info/:userId" element={<CompleteProfile />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/learn/:lessonId" element={<Lesson />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/game" element={<Game />} />
                  <Route path="/quiz/:lessonId" element={<Quiz />} />
                  <Route path="/expense-tracker" element={<ExpenseTracker />} />
                  <Route path="/child-expense-tracker/:childId" element={<ExpenseTracker />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </>
            </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;