import {
  Box,
  IconButton,
  ListItemText,
  Tooltip,
  Snackbar,
  useMediaQuery,
  useTheme,
  Alert,
} from "@mui/material";
import React, { FC, useState } from "react";
import { AvatarOnline } from "../HomeForm";
import { useCall } from "../../hooks";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CallIcon from "@mui/icons-material/Call";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";
import { CALL_TYPE, GROUP_CONVERSATION } from "../../constants";
import { addFriendRequest, getFriendById } from "../../services";
import { HeaderConversationSkeleton } from "../Skeleton";
import { showNotificationAction } from "../../stores/notificationActionSlice";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { slideText } from "../../helpers/utils";

interface HeaderConversationProps {
  conversation: any;
  isOnline: boolean;
  statusFriendReceiverId: string;
  handleToggleDrawer: () => void;
  handleAddFriend: () => void;
  onClick?: () => void;
  open: boolean;
}

export const HeaderConversation: FC<HeaderConversationProps> = ({
  conversation,
  isOnline,
  statusFriendReceiverId,
  handleToggleDrawer,
  handleAddFriend,
  onClick,
  open,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
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
        <Tooltip title="Back">
          <IconButton onClick={onClick}>
            <ArrowBackIosIcon />
          </IconButton>
        </Tooltip>
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
          primary={isSmallScreen ? slideText(conversation?.title, 10) :  conversation?.title}
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
