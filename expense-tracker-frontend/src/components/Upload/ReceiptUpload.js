import React from "react";
import "./ReceiptUpload.css";

const ReceiptUpload = () => (
  <div className="upload-container">
    <h3 className="upload-title">Upload Receipt</h3>
    <form className="upload-form">
      <input type="file" className="upload-input" />
      <button className="upload-btn" type="submit">Upload & Scan</button>
    </form>
    <p className="upload-desc">Use OCR to extract expense details from your receipt.</p>
  </div>
);

export default ReceiptUpload;