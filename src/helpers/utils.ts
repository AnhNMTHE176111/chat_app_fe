import notificationSound from "../assets/sounds/sounds_notification.mp3";
import { DOCUMENT_TITLE } from "../constants";

export const playNewMessageSound = () => {
  const sound = new Audio(notificationSound);
  sound.autoplay = true;
  sound.muted = false;
  sound.play();
};

let interval: any = null;
export const toggleTitle = (eventName: string) => {
  let toggle = false;
  if (interval !== null) {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    document.title = toggle ? eventName : DOCUMENT_TITLE;
    toggle = !toggle;
  }, 1000);

  window.addEventListener(
    "focus",
    () => {
      clearInterval(interval);
      interval = null;
      document.title = DOCUMENT_TITLE;
    },
    {
      once: true,
    }
  );
};

export const getSubjectName = (name: any) => {
  return name
    .split(" ")
    .filter((word: string) => /^[a-zA-Z]+$/.test(word))
    .pop();
};

export function slideText(text: string, length: number) {
  return text.length > length ? `${text.slice(0, length)}...` : text;
}
