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
      const res = await API.post('/receipts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setExtractedData(res.data);
      setForm({
        name: res.data.merchant || '',
        amount: res.data.amount || '',
        date: res.data.date || '',
        category: res.data.category || '',
        currency: res.data.currency || 'INR',
        paymentMethod: res.data.paymentMethod || '',
        items: res.data.items || [],
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

  // Helper to fix date format to YYYY-MM-DD
  function fixDateFormat(dateStr) {
    if (/^\d{2}-\d{2}-\d{2}$/.test(dateStr)) {
      const [yy, mm, dd] = dateStr.split("-");
      return `20${yy}-${mm}-${dd}`;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    return "";
  }

  const handleSaveExpense = async () => {
    setSaveLoading(true);
    setSuccessMsg('');
    setSaveError('');
    try {
      // Fix date and name before sending
      const fixedForm = {
        ...form,
        date: fixDateFormat(form.date),
        name: form.name || extractedData?.merchant || "Unknown Expense"
      };
      await API.post('/expenses', fixedForm);
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

          {/* Preview in expenses list format */}
          <table className="expense-table" style={{ marginBottom: '1rem' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{form.name}</td>
                <td>{form.amount}</td>
                <td>{form.category}</td>
                <td>{form.date}</td>
                <td>{form.paymentMethod}</td>
              </tr>
            </tbody>
          </table>

          {/* Only show items if present and non-empty */}
          {Array.isArray(form.items) && form.items.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <strong>Items:</strong>
              <ul>
                {form.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} - Qty: {item.quantity} - Price: {item.price}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="extracted-form">
            <form>
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                type="text"
                placeholder="Merchant / Vendor / Place"
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
                placeholder="Date (yyyy-mm-dd)"
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
                <option value="Religious">Religious</option>
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
              {form.paymentMethod !== undefined && (
                <input
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleFormChange}
                  type="text"
                  placeholder="Payment Method (optional)"
                  className="extracted-input"
                />
              )}
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
