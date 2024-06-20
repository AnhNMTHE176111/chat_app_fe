import { createContext, useEffect, useState } from "react";
import { useAuth, useSocket } from "../hooks";
import { useParams } from "react-router-dom";
import { playNewMessageSound, toggleTitle } from "../helpers/utils";

export const MessageContext = createContext<any>(null);

export const MessageContextProvider = ({ children }: { children: any }) => {
  const [newMessage, setNewMessage] = useState<any>();
  const [messages, setMessages] = useState<any[]>([]);
  const [latestMessage, setLatestMessage] = useState<any>();
  const [conversations, setConversations] = useState<any[]>([]);
  const { socket } = useSocket();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    socket?.on("new-message", (dataNewMessage: any) => {
      const newMessage = dataNewMessage.newMessage;
      //   playNewMessageSound();

      // set latest message for conversation
      for (let conversation of conversations) {
        if (conversation._id == newMessage.conversation_id) {
          conversation.latestMessage = newMessage;
          toggleTitle(`${conversation.title} send new message`);
          break;
        }
      }

      // set new message for conversation if user is in a conversation
      if (id && newMessage.conversation_id == id) {
        setMessages((prev) => [...prev, newMessage]);
      }
      setLatestMessage(newMessage);
      setNewMessage(newMessage);
    });

    return () => {
      socket?.off("new-message");
    };
  }, [socket, id, conversations]);

  return (
    <MessageContext.Provider
      value={{
        newMessage,
        setNewMessage,
        messages,
        setMessages,
        conversations,
        setConversations,
        latestMessage,
        setLatestMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
