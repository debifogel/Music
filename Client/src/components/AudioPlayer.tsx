import S3Service from "@/Services/awsService";
import ReactAudioPlayer from "react-audio-player";
// import { useLocation, useParams } from "react-router-dom";



import { useEffect, useState } from "react";

const AudioPlayer = ({ audioUrl }: { audioUrl: string }) => {
  const [presignedUrl, setPresignedUrl] = useState<string>("");

  useEffect(() => {
    const fetchPresignedUrl = async () => {
      const url = await S3Service.generatePresignedUrl(audioUrl);
      console.log(url)
      setPresignedUrl(url);
    };
    fetchPresignedUrl();
  }, [audioUrl]);

  return (
    <div>
      {presignedUrl ? (
        <ReactAudioPlayer
          src={presignedUrl}
          controls
          style={{
            width: "400px",
            height: "20px",
            borderRadius: "0px",
            colorScheme: "inherit",
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AudioPlayer;
