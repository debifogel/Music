import S3Service from "@/Services/awsService";
import ReactAudioPlayer from "react-audio-player";
// import { useLocation, useParams } from "react-router-dom";



const AudioPlayer= ({audioUrl}:{audioUrl:string}) => {
  // const { title } = useParams(); // Get title from URL
  // const location = useLocation();
  // const audioUrl = location.state?.audioUrl; 
  // const songId = location.state?.songId; 

  return (
    <><div>
      <ReactAudioPlayer src={S3Service.generatePresignedUrl(audioUrl)} controls style={{ width: "400px", height: "20px", borderRadius:"0px", colorScheme:"inherit"}} />
    </div>
    </>
  );
};

export default AudioPlayer;
