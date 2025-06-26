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
import API from "./api/api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);

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

  // LIFTED: fetchGoals function
  const refreshGoals = async () => {
    const token = localStorage.getItem("token");
    if (isAuthenticated && token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const res = await API.get("/goals");
        setGoals(res.data);
      } catch {
        setGoals([]);
      }
    }
  };
    const refreshExpenses = async () => {
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

  useEffect(() => {
    refreshExpenses();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setExpenses([]);
    setGoals([]);
  };

  const handleAddExpense = async (expense) => {
  const token = localStorage.getItem("token");
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      await API.post("/expenses", expense);
      refreshExpenses(); // Refetch after add
    } catch {
      alert("Failed to add expense");
    }
  }
};

  const handleDeleteExpense = async (id) => {
  const token = localStorage.getItem("token");
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      await API.delete(`/expenses/${id}`);
      refreshExpenses(); // Refetch after delete
    } catch {
      alert("Failed to delete expense");
    }
  }
};
  
  const handleModifyExpense = async (id, updatedExpense) => {
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        await API.put(`/expenses/${id}`, updatedExpense);
        refreshExpenses(); // Refetch after update
      } catch {
        alert("Failed to update expense");
      }
    }
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
                <Route path="/dashboard" element={<Dashboard expenses={expenses} goals={goals} />} />
                <Route path="/expenses" element={<div><AddExpense onAddExpense={handleAddExpense} /><ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} onModifyExpense={handleModifyExpense}/></div>} />
                <Route path="/goals" element={<Goals goals={goals} setGoals={setGoals} refreshGoals={refreshGoals} />} />
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