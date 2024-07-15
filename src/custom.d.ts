declare module "*.mp3" {
  const src: string;
  export default src;
}
interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}
