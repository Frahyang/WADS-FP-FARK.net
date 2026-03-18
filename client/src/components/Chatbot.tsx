import { useEffect } from "react";
// import ToothIcon from "../assets/tooth_vector.png";

declare global {
  interface Window {
    Chatbot?: {
      init: (config: { chatbotId: string }) => void;
    };
  }
}

const Chatbot = () => {
  useEffect(() => {
    if (!document.getElementById('denser-script')) {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/@denserai/embed-chat@1/dist/web.min.js";
      script.type = "module";
      script.id = "denser-script";
      script.onload = () => {
        window.Chatbot?.init({
          chatbotId: "591f83e5-36c5-49ea-9d9d-d12393d20192",
        });
      };
      document.body.appendChild(script);
    } else {
      window.Chatbot?.init({
        chatbotId: "591f83e5-36c5-49ea-9d9d-d12393d20192",
      });
    }
  }, []);

  return (
    <>
      <div id="denser-chatbot" />
    </>
  );
};

export default Chatbot;
