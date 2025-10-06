import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../../store/slices/authSlice";
import "./Register.css";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    mobile: "",
    email: "",
    password: ""
  });
  const [validationError, setValidationError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validateMobile = (mobile) => /^\d{10}$/.test(mobile);
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(password);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    dispatch(clearError());
    
    if (!validateMobile(form.mobile)) {
      setValidationError("Mobile number must be 10 digits.");
      return;
    }
    if (!validatePassword(form.password)) {
      setValidationError("Password must have at least one letter, one number, and one special character.");
      return;
    }
    
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      window.dispatchEvent(new Event("auth"));
      navigate("/dashboard");
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input className="register-input" type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
        <input className="register-input" type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
        <input className="register-input" type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} required />
        <select className="register-input" name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input className="register-input" type="text" name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} required />
        <input className="register-input" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input className="register-input" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button className="register-btn" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {(error || validationError) && <div className="register-error">{error || validationError}</div>}
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?
        <a href="/login" className="register-link">Login</a>
      </p>
    </div>
  );
};

export default Register;