import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import awsUploadService from '@/Services/awsService'; // יש לוודא שהשירות מתאים
import { Input } from '@mui/material';

const AwsUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const bucketName = process.env.REACT_APP_AWS_BUCKET_NAME || '';
  const region = process.env.REACT_APP_AWS_REGION || '';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('בחר קובץ להעלאה.');
      return;
    }

    setUploadStatus('מעלה...');
    setUploadProgress(0);
    setUploadError(null);

    try {
      if (!bucketName || !region) {
        throw new Error("משתני סביבה חסרים")
      }
      await awsUploadService.uploadFile(selectedFile, (progress: number) => {
        setUploadProgress(progress);
      });
      setUploadStatus('העלאה הצליחה!');
    } catch (error: any) {
      console.error('שגיאה בהעלאה:', error);
      setUploadError(error.message || 'שגיאה בהעלאה.');
      setUploadStatus('שגיאה בהעלאה.');
    }
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
      {uploadError && <p style={{ color: 'red' }}>שגיאה: {uploadError}</p>}
    </div>
  );
};

export default AwsUpload;