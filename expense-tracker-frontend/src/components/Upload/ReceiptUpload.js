import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import './ReceiptUpload.css';

const ReceiptUpload = () => {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', amount: '', date: '', category: '', currency: 'INR' });
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [saveError, setSaveError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setExtractedData(null);
    setError('');
    setForm({ name: '', amount: '', date: '', category: '', currency: 'INR' });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const res = await axios.post('https://ai-expense-tracker-back.onrender.com/api/receipts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setExtractedData(res.data);
      setForm({
        name: '',
        amount: res.data.amount || '',
        date: res.data.date || '',
        category: res.data.category || '',
        currency: 'INR',
      });
    } catch (err) {
      setError('Failed to process receipt. The backend may not be running or the endpoint is missing.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveExpense = async () => {
    setSaveLoading(true);
    setSuccessMsg('');
    setSaveError('');
    try {
      await API.post('/expenses', form);
      setSuccessMsg('Expense saved successfully! Redirecting to expenses...');
      setTimeout(() => {
        navigate('/expenses');
      }, 1500);
      setExtractedData(null);
      setForm({ name: '', amount: '', date: '', category: '', currency: 'INR' });
      setFile(null);
    } catch (err) {
      setSaveError('Failed to save expense. Please try again.');
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h3 className="upload-title">Upload Receipt</h3>
        <p className="upload-desc">Let AI scan your receipt and fill in the details.</p>
        <form className="upload-form" onSubmit={handleUpload}>
          <div className="file-input-wrapper">
            <input
              type="file"
              className="upload-input"
              id="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
            />
            <label htmlFor="file" className="file-input-label">
              {file ? file.name : 'Choose a file...'}
            </label>
          </div>
          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? 'Scanning...' : 'Upload & Scan'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>

      {extractedData && (
        <div className="extracted-data-card">
          <h4>Extracted Details</h4>
          <p className="extracted-data-desc">Please review the extracted information before saving.</p>
          <div className="extracted-form">
            <form>
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                type="text"
                placeholder="Expense Name (optional)"
                className="extracted-input"
              />
              <input
                name="amount"
                value={form.amount}
                onChange={handleFormChange}
                type="number"
                placeholder="Amount"
                className="extracted-input"
              />
              <input
                name="date"
                value={form.date}
                onChange={handleFormChange}
                type="text"
                placeholder="Date (dd/mm/yyyy)"
                className="extracted-input"
              />
              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
                className="extracted-input"
              >
                <option value="">Select</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Gifts">Gifts</option>
                <option value="Medical Fees">Medical Fees</option>
                <option value="Other">Other</option>
              </select>
              <select
                name="currency"
                value={form.currency}
                onChange={handleFormChange}
                className="extracted-input"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
            </form>
          </div>
          <button className="save-expense-btn" onClick={handleSaveExpense} disabled={saveLoading}>
            {saveLoading ? 'Saving...' : 'Confirm and Save Expense'}
          </button>
          {successMsg && <p className="success-message">{successMsg}</p>}
          {saveError && <p className="error-message">{saveError}</p>}
        </div>
      )}
    </div>
  );
};

export default ReceiptUpload;
