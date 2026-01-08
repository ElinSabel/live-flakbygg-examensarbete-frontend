import { useEffect, useState } from "react";
import { connectSocket } from "../services/socketServices";
import {
  joinRequestChat,
  offNewMessage,
  onNewMessage,
  sendMessage,
} from "../hooks/useSockets";
import { fetchChatMessages } from "../services/chatServices";
import { useTranslation } from "react-i18next";

interface Message {
  sender: string;
  text: string;
  createdAt: string;
}

type Props = {
  requestId: string;
  token: string | null;
  user: any;
  request: any;
};

export const RequestChat = ({ requestId, token, user, request }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [socketReady, setSocketReady] = useState(false);
   const { t } = useTranslation();

  const isMyMessage = (msg: Message) => msg.sender === user?._id;


  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);

    const initChat = async () => {
      setSocketReady(true);
      await joinRequestChat(requestId);

      onNewMessage((msg: Message) => {
        setMessages((prev) => [
          ...prev,
          {
            ...msg,
            createdAt: msg.createdAt || new Date().toISOString(),
          },
        ]);
      });
    };

    socket.connected ? initChat() : socket.once("connect", initChat);

    fetchChatMessages(requestId, token)
      .then((res) =>
        setMessages(
          res.messages.map((msg: any) => ({
            ...msg,
            createdAt: msg.createdAt || new Date().toISOString(),
          }))
        )
      )
      .catch(console.error);

    return () => {
      socket.off("connect", initChat);
      offNewMessage();
    };
  }, [requestId, token]);

  const handleSend = () => {
    if (!text.trim() || !socketReady) return;

    sendMessage(requestId, text);
    setText("");
  };

  return (
    <div className="chatWrapper">
      <h2>{t("chat")}</h2>

      <div className="chatMessages">
        {messages.map((msg, i) => {
  const mine = isMyMessage(msg);

  let senderName = "";
  if (!mine && user.role === "customer") {

    senderName = request.sellerId?.firstname ?? "Seller";
  }

  
  return (
    <div
      key={i}
      className={`chatMessage ${mine ? "mine" : "theirs"}`}
      >
      {!mine && senderName && (
        <div className="chat-sender">{senderName}</div>
      )}

      <div className="chatBubble">
        <div className="chatText">{msg.text}</div>
        <small className="chatTime">
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </small>
      </div>
    </div>
  );
})}
      </div>

      <div className="chatInputRow">
        <input
          className="chatInput"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("chatPlaceholder")}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={!socketReady}
        />
        <button
          className={`btn chat ${!socketReady ? "disabled" : ""}`}
          disabled={!socketReady}
          onClick={handleSend}
        >
          {t("send")}
        </button>
      </div>
    </div>
  );
};