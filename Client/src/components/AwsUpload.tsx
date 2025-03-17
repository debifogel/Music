import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import awsUploadService from '@/Services/awsUploadService';
import { Input } from '@mui/material';

const AwsUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID || '';
  const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || '';
  const bucketName = process.env.REACT_APP_AWS_BUCKET_NAME || '';
  const region = process.env.REACT_APP_AWS_REGION || '';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('בחר קובץ להעלאה.');
      return;
    }

    setUploadStatus('מעלה...');
    setUploadProgress(0);

    awsUploadService
      .uploadFile(selectedFile, { accessKeyId, secretAccessKey, bucketName, region }, (progress) => {
        setUploadProgress(progress);
      })
      .then((status: string) => {
        setUploadStatus(status);
      })
      .catch((error) => {
        setUploadStatus(error);
      });
  };

  return (
    <div className="space-y-4">
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!selectedFile}>
        העלה
      </Button>
      {uploadProgress > 0 && (
        <div className="space-y-2">
          <p>התקדמות: {uploadProgress}%</p>
          <progress value={uploadProgress} max="100" />
        </div>
      )}
      {uploadStatus && <p>סטטוס: {uploadStatus}</p>}
    </div>
  );
};

export default AwsUpload;