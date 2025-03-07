import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/components/add/addComponent.module.css';



const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const router = useRouter();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadMessage(''); // Clear previous messages
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:4007/api/components/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadMessage(result.message);
        router.push('/equipment/dashboard/components'); // Navigate to components page after successful upload
      } else {
        const errorResult = await response.json();
        setUploadMessage('Error: ' + errorResult.message);
      }
    } catch (error) {
      setUploadMessage('An error occurred while uploading the file.');
      console.error('Upload error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleUpload} className={styles.form}>
        <div className={styles.divInput}>
          <label htmlFor="file">Upload Excel File</label>
          <input type="file" name="file" onChange={handleFileChange} />
        </div>
  
        <button type="submit">Upload and Proceed</button>
      </form>
      {uploadMessage && (
        <div className={styles.divInput}>
          <p>{uploadMessage}</p>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
