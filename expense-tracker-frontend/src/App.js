import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import NavBar from "./components/NavBar/NavBar";
import Dashboard from "./components/Dashboard/Dashboard";
import ExpenseList from "./components/Expenses/ExpenseList";
import AddExpense from "./components/Expenses/AddExpense";
import Goals from "./components/Goals/Goals";
import ReceiptUpload from "./components/Upload/ReceiptUpload";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Landing from "./components/Landing/Landing";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const handleAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
    window.addEventListener("auth", handleAuth);
    return () => window.removeEventListener("auth", handleAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const handleAddExpense = (expense) => {
    setExpenses(prev => [...prev, { ...expense, id: Date.now() }]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <NavBar onLogout={handleLogout} />}
        <div className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<Landing />} />
            {!isAuthenticated ? (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route path="/dashboard" element={<Dashboard expenses={expenses} />} />
                <Route path="/expenses" element={<div><AddExpense onAddExpense={handleAddExpense} /><ExpenseList expenses={expenses} /></div>} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/upload" element={<ReceiptUpload />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;