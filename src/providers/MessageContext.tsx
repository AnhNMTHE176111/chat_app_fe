import { createContext, useCallback, useEffect, useState } from "react";
import { useSocket } from "../hooks";
import { useParams } from "react-router-dom";
import { toggleTitle } from "../helpers/utils";
import { SOCKET_EVENT } from "../constants";

export interface ChatContainerProps {
  setNewMessage: any;
  messages: any;
  setMessages: any;
  setLatestMessage: any;
  conversations: any;
  setConversations: any;
  onClick?: () => void;
}

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
      let currentConversation: any;
      setConversations((prevConversations) =>
        prevConversations.map((conversation) => {
          currentConversation =
            conversation._id === newMessage.conversation_id
              ? {
                  ...conversation,
                  latestMessage: newMessage,
                }
              : conversation;
          return currentConversation;
        })
      );

      // Update messages if user is in the conversation
      if (id && newMessage.conversation_id === id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }

      // Update latest message
      setLatestMessage(newMessage);
      setNewMessage(newMessage);

      // Toggle title with new message
      console.log("newMessage", newMessage);

      toggleTitle(`${currentConversation?.title} sent a new message`);
    },
    [id]
  );

  const handleDeletedMessageReceived = useCallback(
    (data: any) => {
      const message = data.message;

      // Update conversations with latest message
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation._id === message.conversation_id
            ? {
                ...conversation,
                latestMessage: message,
              }
            : conversation
        )
      );

      // Update messages if user is in the conversation
      if (id && message.conversation_id === id) {
        setMessages((prevMessages) =>
          prevMessages.filter((item: any) => item._id != message._id)
        );
      }

      // Update latest message
      setLatestMessage(message);
    },
    [id]
  );

  useEffect(() => {
    if (!socket) return;
    socket.on(SOCKET_EVENT.NEW_MESSAGE, handleMessageReceived);
    socket.on(SOCKET_EVENT.DELETED_MESSAGE, handleDeletedMessageReceived);
    return () => {
      socket.off(SOCKET_EVENT.NEW_MESSAGE, handleMessageReceived);
      socket.off(SOCKET_EVENT.DELETED_MESSAGE, handleDeletedMessageReceived);
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
