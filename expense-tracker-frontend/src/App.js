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
import API from "./api/api"; // <-- import your axios instance

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses after login
  useEffect(() => {
    const handleAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
    window.addEventListener("auth", handleAuth);
    return () => window.removeEventListener("auth", handleAuth);
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");
      if (isAuthenticated && token) {
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const res = await API.get("/expenses");
          setExpenses(res.data);
        } catch {
          setExpenses([]);
        }
      }
    };
    fetchExpenses();
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setExpenses([]);
  };

  const handleAddExpense = async (expense) => {
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const res = await API.post("/expenses", expense);
        setExpenses(prev => [...prev, res.data]);
      } catch {
        alert("Failed to add expense");
      }
    }
  };
  // For backend integration, update these to call your API
  const handleDeleteExpense = async (id) => {
  // If using backend:
  // await API.delete(`/expenses/${id}`);
  setExpenses(prev => prev.filter(exp => (exp._id || exp.id) !== id));
  };

  const handleModifyExpense = async (id, updatedExpense) => {
    // If using backend:
    // const res = await API.put(`/expenses/${id}`, updatedExpense);
    setExpenses(prev =>
      prev.map(exp =>
        (exp._id || exp.id) === id ? { ...exp, ...updatedExpense } : exp
      )
    );
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
                <Route path="/expenses" element={<div><AddExpense onAddExpense={handleAddExpense} /><ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense}
                onModifyExpense={handleModifyExpense}  /></div>} />
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