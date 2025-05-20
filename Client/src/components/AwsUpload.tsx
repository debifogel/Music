import React, { useState } from 'react';
import { Button, CircularProgress, Input } from '@mui/material';
import S3Service from '@/Services/awsService';
import { UploadIcon } from 'lucide-react';

const AwsUpload = ({ callback }: { callback: (file: File, path: string) => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus('');
      setUploadProgress(0);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('בחר קובץ להעלאה.');
      return;
    }

    setUploading(true);
    setUploadStatus('מעלה...');
    setUploadProgress(0);
    setUploadError(null);

    try {
      const res = await S3Service.uploadFile(
        selectedFile,
        selectedFile.name,
        (progress: number) => {
          setUploadProgress(progress);
        }
      );
      callback(selectedFile, res.Key);
      setUploadStatus('✅ העלאה הצליחה!');
    } catch (error: any) {
      console.error('שגיאה בהעלאה:', error);
      setUploadError(error.message || 'שגיאה בהעלאה.');
      setUploadStatus('❌ שגיאה בהעלאה.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input type="file" onChange={handleFileChange} />
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        variant="contained"
        color="primary"
      >
        <UploadIcon className="mr-2 h-4 w-4" />

        הוספת השיר
      </Button>

      {uploading && (
        <div className="space-y-2">
          <p>התקדמות: {uploadProgress}%</p>
          <CircularProgress variant="determinate" value={uploadProgress} />
        </div>
      )}

      {uploadStatus && <p>סטטוס: {uploadStatus}</p>}
      {uploadError && <p style={{ color: 'red' }}>שגיאה: {uploadError}</p>}
    </div>
  );
};

export default AwsUpload;
