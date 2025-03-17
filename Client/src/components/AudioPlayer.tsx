import ReactAudioPlayer from 'react-audio-player';

interface AudioPlayerProps {
  audioUrl: string;
}

function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  return <ReactAudioPlayer src={audioUrl} controls />;
}

export default AudioPlayer;