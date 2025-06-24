import React, { useState } from 'react';
import axios from 'axios';
import './ReceiptUpload.css';

const ReceiptUpload = () => {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setExtractedData(null);
    setError('');
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
      // This endpoint doesn't exist yet. We will create it next.
      const res = await axios.post('http://localhost:5000/api/receipts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setExtractedData(res.data);
    } catch (err) {
      setError('Failed to process receipt. The backend may not be running or the endpoint is missing.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // A function to handle saving the expense (to be implemented)
  const handleSaveExpense = () => {
    // Here you would call your Redux action or another API to save the expense
    console.log('Saving expense:', extractedData);
    alert('Expense saved! (Functionality to be fully implemented)');
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
             {/* We will replace this pre with a form later */}
            <pre>{JSON.stringify(extractedData, null, 2)}</pre>
          </div>
          <button className="save-expense-btn" onClick={handleSaveExpense}>
            Confirm and Save Expense
          </button>
        </div>
      )}
    </div>
  );
};

export default ReceiptUpload;
