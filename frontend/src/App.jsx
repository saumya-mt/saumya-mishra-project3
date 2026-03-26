import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import CustomGamePage from "./pages/CustomGamePage";
import GamePage from "./pages/GamePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RulesPage from "./pages/RulesPage";
import ScoresPage from "./pages/ScoresPage";
import SelectionPage from "./pages/SelectionPage";

function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/games" element={<SelectionPage />} />
          <Route path="/custom" element={<CustomGamePage />} />
          <Route path="/game/:gameId" element={<GamePage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/scores" element={<ScoresPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
