import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a file.');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post('https://ssp-gpvi.onrender.com/upload', formData);
      setMessage(res.data.message);
      fetchUploadedFiles();
    } catch (err) {
      setMessage('Upload failed.');
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const res = await axios.get('https://ssp-gpvi.onrender.com/files');
      setUploadedFiles(res.data);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  return (
    <div className="container mt-5 bg-light border rounded p-4 custom-container">
      <div className="text-center mb-5">
        <img src="/govt-logo.png" alt="Government Logo" className="gov-logo mb-3" />
        <h1 className="main-heading">SSP - Government of India</h1>
        <p className="sub-heading">Student Scholarship Portal - Announcements Upload</p>
      </div>

      <div className="card p-4 mb-4 shadow-sm upload-card">
        <form onSubmit={handleUpload}>
          <div className="mb-3">
            <label className="form-label fw-bold">Upload Announcement (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <button className="btn btn-primary w-100" type="submit">Upload</button>
        </form>
        {message && <p className="mt-3 text-success text-center fw-semibold">{message}</p>}
      </div>

      <h4 className="text-dark mb-3 border-bottom pb-2">📜 Uploaded Announcements</h4>
      <ul className="list-group">
        {uploadedFiles.map((file, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            {file.name}
            <a
              href={`data:application/pdf;base64,${file.data}`}
              download={file.name}
              className="btn btn-outline-success btn-sm"
            >
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;