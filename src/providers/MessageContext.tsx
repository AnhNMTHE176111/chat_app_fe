import { createContext, useCallback, useEffect, useState } from "react";
import { useSocket } from "../hooks";
import { useParams } from "react-router-dom";
import { toggleTitle } from "../helpers/utils";

export const MessageContext = createContext<any>(null);

export const MessageContextProvider = ({ children }: { children: any }) => {
  const [newMessage, setNewMessage] = useState<any>();
  const [messages, setMessages] = useState<any[]>([]);
  const [latestMessage, setLatestMessage] = useState<any>();
  const [conversations, setConversations] = useState<any[]>([]);
  const { socket } = useSocket();
  const { id } = useParams<{ id: string }>();

  const handleMessageReceived = useCallback(
    (dataNewMessage: any) => {
      const newMessage = dataNewMessage.newMessage;

      // Update conversations with latest message
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation._id === newMessage.conversation_id
            ? {
                ...conversation,
                latestMessage: newMessage,
              }
            : conversation
        )
      );

      // Update messages if user is in the conversation
      if (id && newMessage.conversation_id === id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }

      // Update latest message
      setLatestMessage(newMessage);
      setNewMessage(newMessage);

      // Toggle title with new message
      toggleTitle(`${newMessage.conversation_title} sent a new message`);
    },
    [id]
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("new-message", handleMessageReceived);

    return () => {
      socket.off("new-message", handleMessageReceived);
    };
  }, [socket, handleMessageReceived]);

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
