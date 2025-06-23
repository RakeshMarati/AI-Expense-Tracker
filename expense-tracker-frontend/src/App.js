import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import './App.css';
import Dashboard from "./components/Dashboard/Dashboard";
import ExpenseList from "./components/Expenses/ExpenseList";
import AddExpense from "./components/Expenses/AddExpense";
import Goals from "./components/Goals/Goals";
import ReceiptUpload from "./components/Upload/ReceiptUpload";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [expenses, setExpenses] = useState([
    // Optionally, fetch from API or leave empty
  ]);

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
        {isAuthenticated && (
          <nav className="bg-white shadow mb-8">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <span className="text-xl font-bold text-blue-600">AI Expense Tracker</span>
              <div className="space-x-4">
                <Link to="/" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
                <Link to="/expenses" className="text-gray-700 hover:text-blue-600">Expenses</Link>
                <Link to="/goals" className="text-gray-700 hover:text-blue-600">Goals</Link>
                <Link to="/upload" className="text-gray-700 hover:text-blue-600">Upload Receipt</Link>
                <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">Logout</button>
              </div>
            </div>
          </nav>
        )}
        <div className="container mx-auto px-4">
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/expenses" element={<div><AddExpense onAddExpense={handleAddExpense} /><ExpenseList expenses={expenses} /></div>} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/upload" element={<ReceiptUpload />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
