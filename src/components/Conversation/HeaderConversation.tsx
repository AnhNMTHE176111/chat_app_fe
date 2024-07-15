import {
  Box,
  IconButton,
  ListItemText,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { AvatarOnline } from "../HomeForm";
import { useCall, useAppDispatch, useAuth } from "../../hooks";
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

  const handleVoiceCall = () => {
    handleStartCall(conversation, CALL_TYPE.VOICE);
  };

  const handleVideoCall = () => {
    handleStartCall(conversation, CALL_TYPE.VIDEO);
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
        <Tooltip
          title="Add Friend"
          style={statusFriendReceiverId ? { display: "none" } : {}}
          onClick={handleAddFriend}
        >
          <IconButton>
            <PersonAddIcon />
          </IconButton>
        </Tooltip>
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
      </Box>
    </React.Fragment>
  );
};

export default HeaderConversation;
