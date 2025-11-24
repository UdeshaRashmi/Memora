import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DeckProvider } from './context/DeckContext';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import DeckView from './pages/DeckView';
import DeckDetail from './pages/DeckDetail';
import StudyMode from './pages/StudyMode';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateDeck from './pages/CreateDeck';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <DeckProvider>
        <ProgressProvider>
          <ThemeProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } />
                  <Route path="/decks" element={
                    <ProtectedRoute>
                      <DeckView />
                    </ProtectedRoute>
                  } />
                  <Route path="/deck/:id" element={
                    <ProtectedRoute>
                      <DeckDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/create-deck" element={
                    <ProtectedRoute>
                      <CreateDeck />
                    </ProtectedRoute>
                  } />
                  <Route path="/study" element={
                    <ProtectedRoute>
                      <StudyMode />
                    </ProtectedRoute>
                  } />
                  <Route path="/study/:id" element={
                    <ProtectedRoute>
                      <StudyMode />
                    </ProtectedRoute>
                  } />
                  <Route path="/leaderboard" element={
                    <ProtectedRoute>
                      <Leaderboard />
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
            </Router>
          </ThemeProvider>
        </ProgressProvider>
      </DeckProvider>
    </AuthProvider>
  );
}

export default App;