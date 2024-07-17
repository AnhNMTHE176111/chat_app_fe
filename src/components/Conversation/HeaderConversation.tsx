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
import React, { FC, useEffect, useState } from "react";
import { AvatarOnline } from "../HomeForm";
import { useCall } from "../../hooks";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CallIcon from "@mui/icons-material/Call";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";
import {
  CALL_TYPE,
  FRIEND_STATUS,
  GROUP_CONVERSATION,
  SINGLE_CONVERSATION,
} from "../../constants";
import { addFriendRequest, getFriendById } from "../../services";
import { HeaderConversationSkeleton } from "../Skeleton";
import { showNotificationAction } from "../../stores/notificationActionSlice";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
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
    if (isNotFriend || pendingStatusFriend) {
      setSnackbarOpen(true);
      return;
    }
    handleStartCall(conversation, CALL_TYPE.VOICE);
  };

  const handleVideoCall = () => {
    if (isNotFriend || pendingStatusFriend) {
      setSnackbarOpen(true);
      return;
    }
    handleStartCall(conversation, CALL_TYPE.VIDEO);
  };

  const [isFriend, setIsFriend] = useState(
    conversation?.type === SINGLE_CONVERSATION &&
      statusFriendReceiverId === FRIEND_STATUS.ACCEPT
  );
  const [isNotFriend, setIsNotFriend] = useState(
    conversation?.type === SINGLE_CONVERSATION &&
      statusFriendReceiverId === FRIEND_STATUS.REJECT
  );
  const [pendingStatusFriend, setPendingStatusFriend] = useState(
    conversation?.type === SINGLE_CONVERSATION &&
      statusFriendReceiverId === FRIEND_STATUS.PENDING
  );

  useEffect(() => {
    setIsFriend(
      conversation?.type === SINGLE_CONVERSATION &&
        statusFriendReceiverId === FRIEND_STATUS.ACCEPT
    );
    setIsNotFriend(
      conversation?.type === SINGLE_CONVERSATION &&
        statusFriendReceiverId === FRIEND_STATUS.REJECT
    );
    setPendingStatusFriend(
      conversation?.type === SINGLE_CONVERSATION &&
        statusFriendReceiverId === FRIEND_STATUS.PENDING
    );
  }, [statusFriendReceiverId, conversation]);

  const showAddFriendIcon =
    (conversation?.type === SINGLE_CONVERSATION &&
      statusFriendReceiverId !== FRIEND_STATUS.ACCEPT) ||
    conversation?.type === GROUP_CONVERSATION
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
          primary={
            isSmallScreen
              ? slideText(conversation?.title, 10)
              : conversation?.title
          }
          secondary={isOnline ? "Online" : "Offline"}
        />
      </Box>
      <Box>
        {pendingStatusFriend && (
          <Tooltip title="Request Sent">
            <IconButton onClick={handleAddFriend}>
              <PersonRemoveIcon />
            </IconButton>
          </Tooltip>
        )}
        {conversation?.type === GROUP_CONVERSATION && (
          <Tooltip title="Add member">
            <IconButton onClick={handleAddFriend}>
              <GroupAddIcon />
            </IconButton>
          </Tooltip>
        )}
        {isNotFriend && !pendingStatusFriend && (
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
