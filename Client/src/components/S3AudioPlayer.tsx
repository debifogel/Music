import  { useState } from 'react';
import awsService from '@/Services/awsService';
import AudioPlayer from './AudioPlayer';

interface S3AudioPlayerProps {
  key: string; // שם הקובץ ב-S3
}

function S3AudioPlayer({ key }: S3AudioPlayerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleDownloadAndPlay = async () => {
    try {
      const data = await awsService.downloadFile(key);
      const blob = new Blob([data.Body as ArrayBuffer], { type: data.ContentType });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error('שגיאה בהורדה והשמעה:', error);
    }
  };

  return (
    <div>
      <button onClick={handleDownloadAndPlay}>השמע אודיו</button>
      {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
    </div>
  );
}

export default S3AudioPlayer;