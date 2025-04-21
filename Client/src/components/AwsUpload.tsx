import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
import { Button,CircularProgress, Input } from '@mui/material';
import S3Service from '@/Services/awsService';

const AwsUpload= ({callback}:{callback:(path:string)=>void}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  

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
       const res=await S3Service .uploadFile(selectedFile, selectedFile.name,
         (progress: number) => {
        setUploadProgress(progress);
      })
      callback(res.Key);  // עדכון הנתיב רק לאחר שההעלאה הצליחה
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
      <Button onClick={handleUpload} disabled={!selectedFile}  >
        העלאה
      </Button>
      {uploadProgress > 0 && (
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