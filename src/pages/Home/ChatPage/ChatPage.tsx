import React, { useEffect, useState } from "react";
import HomeLayout from "../../../layouts/HomeLayout";
import { Divider, Drawer, Grid, useMediaQuery, useTheme } from "@mui/material";
import HistoryChat from "./HistoryChat";
import Conversation from "./Conversation";
import { useParams } from "react-router-dom";
import { useDrawerState, useMessage } from "../../../hooks";

export function ChatPage() {
  const theme = useTheme();
  const [showListConversations, setShowListConversations] = useState(true);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
    console.log("showListConversations", showListConversations);
  }, [showListConversations]);

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
      {!isSmallScreen && (
        <>
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
        </>
      )}

      {isSmallScreen && (
        <>
          {showListConversations && (
            <Grid item xs={12} sx={{ height: "100%" }}>
              <HistoryChat
                conversations={conversations}
                setConversations={setConversations}
                latestMessage={latestMessage}
                onClick={() => setShowListConversations(false)}
              />
            </Grid>
          )}

          {id && !showListConversations && (
            <Grid item xs={12} sx={{ height: "100%" }}>
              <Conversation
                conversations={conversations}
                messages={messages}
                setConversations={setConversations}
                setLatestMessage={setLatestMessage}
                setMessages={setMessages}
                setNewMessage={setNewMessage}
                onClick={() => setShowListConversations(true)}
              />
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
}

export default ChatPage;
