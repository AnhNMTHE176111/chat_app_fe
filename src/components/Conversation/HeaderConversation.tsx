import {
  Alert,
  Box,
  IconButton,
  ListItemText,
  Snackbar,
  Tooltip,
} from "@mui/material";
import React, { FC, useState } from "react";
import { AvatarOnline } from "../HomeForm";
import { useCall } from "../../hooks";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CallIcon from "@mui/icons-material/Call";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";
import { CALL_TYPE } from "../../constants";

interface HeaderConversationProps {
  conversation: any;
  isOnline: boolean;
  statusFriendReceiverId: string;
  handleToggleDrawer: () => void;
  handleAddFriend: () => void;
  open: boolean;
}

export const HeaderConversation: FC<HeaderConversationProps> = ({
  conversation,
  isOnline,
  statusFriendReceiverId,
  handleToggleDrawer,
  handleAddFriend,
  open,
}) => {
  const { handleStartCall } = useCall();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleVoiceCall = () => {
    if (conversation.type === "single" && statusFriendReceiverId !== "accept") {
      setSnackbarOpen(true);
      return;
    }
    handleStartCall(conversation, CALL_TYPE.VOICE);
  };

  const handleVideoCall = () => {
    if (conversation.type === "single" && statusFriendReceiverId !== "accept") {
      setSnackbarOpen(true);
      return;
    }
    handleStartCall(conversation, CALL_TYPE.VIDEO);
  };

  const showAddFriendIcon =
    (conversation.type === "single" && statusFriendReceiverId !== "accept") ||
    conversation.type === "group"
      ? true
      : false;

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          width: "fit-content",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {conversation && (
          <AvatarOnline
            srcImage={conversation?.picture}
            title={conversation?.title}
            isOnline={isOnline}
          />
        )}
        <ListItemText
          sx={{
            marginLeft: "10px",
          }}
          primary={conversation?.title}
          secondary={isOnline ? "Online" : "Offline"}
        />
      </Box>
      <Box>
        {showAddFriendIcon && (
          <Tooltip title="Add Friend">
            <IconButton onClick={handleAddFriend}>
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Call">
          <IconButton onClick={handleVoiceCall}>
            <CallIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Video Call">
          <IconButton onClick={handleVideoCall}>
            <VideoCameraFrontIcon />
          </IconButton>
        </Tooltip>
        {open ? (
          <Tooltip title="Close Conversation Information">
            <IconButton onClick={handleToggleDrawer}>
              <ViewSidebarOutlinedIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Open Conversation Information">
            <IconButton onClick={handleToggleDrawer}>
              <ViewSidebarIcon />
            </IconButton>
          </Tooltip>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            You must be friends to use this feature.
          </Alert>
        </Snackbar>
      </Box>
    </React.Fragment>
  );
};

export default HeaderConversation;
