import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertColor,
  AlertPropsColorOverrides,
  Button,
  Divider,
  Grid,
  Snackbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HistoryChat from "./HistoryChat";
import Conversation from "./Conversation";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useMessage, useSocket } from "../../../hooks";
import { OverridableStringUnion } from "@mui/types";

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
  const { socket } = useSocket();

  useEffect(() => {
    if (messages.length > 1) {
      const copiedLatestMessage = messages[messages.length - 1];
      setLatestMessage(copiedLatestMessage);
    }
  }, [messages]);

  const { user } = useAuth();

  const [isNewRequest, setIsNewRequest] = useState(false);
  const [openNoti, setOpenNoti] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");
  const [severityNoti, setSeverityNoti] =
    useState<OverridableStringUnion<AlertColor, AlertPropsColorOverrides>>(
      "success"
    );
  const navigate = useNavigate();
  const handleCloseNoti = () => {
    setOpenNoti(false);
  };

  useEffect(() => {
    socket?.on("friendStatusChanged", (userId: string) => {
      if (userId !== user?.id) {
        setOpenNoti(true);
        setIsNewRequest(true);
        setNotiMessage(`New friend request`);
        setSeverityNoti("info");
      }
    });

    return () => {
      socket?.off("friendStatusChanged");
    };
  }, [socket]);

  const handleNavigateToNewRequest = () => {
    navigate("/contacts", {
      state: {
        newRequest: true,
      },
    });
  };

  const action = (
    <Button color="secondary" size="small" onClick={handleNavigateToNewRequest}>
      View New Request
    </Button>
  );

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
      <Snackbar
        open={openNoti}
        autoHideDuration={6000}
        onClose={handleCloseNoti}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseNoti} severity={severityNoti}>
          {notiMessage}{" "}
          {isNewRequest && (
            <Button
              color="secondary"
              size="small"
              onClick={handleNavigateToNewRequest}
            >
              View New Request
            </Button>
          )}
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default ChatPage;
