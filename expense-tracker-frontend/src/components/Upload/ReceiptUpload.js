import React from "react";

const ReceiptUpload = () => (
  <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
    <h3 className="font-semibold mb-4">Upload Receipt</h3>
    <form className="space-y-4">
      <input type="file" className="block w-full text-sm text-gray-500" />
      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Upload & Scan</button>
    </form>
    <p className="mt-4 text-gray-500 text-sm">Use OCR to extract expense details from your receipt.</p>
  </div>
);

export default ReceiptUpload;