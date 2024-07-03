import React, { useEffect } from "react";
import HomeLayout from "../../../layouts/HomeLayout";
import { Divider, Drawer, Grid } from "@mui/material";
import HistoryChat from "./HistoryChat";
import Conversation from "./Conversation";
import { useParams } from "react-router-dom";
import { useDrawerState, useMessage } from "../../../hooks";

export function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const {
    newMessage,
    setNewMessage,
    messages,
    setMessages,
    conversations,
    setConversations,
    latestMessage,
    setLatestMessage,
  } = useMessage();


  useEffect(() => {
    if (messages.length > 1) {
      const copiedLatestMessage = messages[messages.length - 1];
      setLatestMessage(copiedLatestMessage);
    }
  }, [messages]);

  return (
    <Grid
      container
      item
      sx={{
        height: "100%",
        width: "100%",
        backgroundColor: "#f7f7ff",
      }}
    >
      <Grid item xs={3} sx={{ height: "100%" }}>
        <HistoryChat
          conversations={conversations}
          setConversations={setConversations}
          latestMessage={latestMessage}
        />
      </Grid>

      <Divider orientation="vertical" flexItem />

      <Grid item xs sx={{ height: "100%" }}>
        {id ? (
          <Conversation
            conversations={conversations}
            messages={messages}
            setConversations={setConversations}
            setLatestMessage={setLatestMessage}
            setMessages={setMessages}
            setNewMessage={setNewMessage}
          />
        ) : (
          <span
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              display: "flex",
              fontSize: "1.5rem",
              color: "grey",
            }}
          >
            Select a conversation
          </span>
        )}
      </Grid>
    </Grid>
  );
}

export default ChatPage;
