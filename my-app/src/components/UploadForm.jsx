import React, { useState } from 'react';
import axios from 'axios';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a file.');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage('Upload failed.');
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <div className="mb-3">
        <input
          type="file"
          accept="application/pdf"
          className="form-control"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>
      <button className="btn btn-primary" type="submit">Upload</button>
      {message && <p className="mt-3 text-success">{message}</p>}
    </form>
  );
}

export default UploadForm;
