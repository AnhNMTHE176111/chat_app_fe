import { Box, IconButton, ListItemText, Tooltip } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { AvatarOnline } from "../HomeForm";
import { useCall, useAppDispatch, useAuth } from "../../hooks";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CallIcon from "@mui/icons-material/Call";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";
import { GROUP_CONVERSATION } from "../../constants";
import { addFriendRequest, getFriendById } from "../../services";
import { HeaderConversationSkeleton } from "../Skeleton";
import { showNotificationAction } from "../../stores/notificationActionSlice";

interface HeaderConversationProps {
  conversation: any;
  isOnline: boolean;
  statusFriendReceiverId: string;
  handleToggleDrawer: () => void;
  handleAddFriend: () => void;
  handleCall: () => void;
  handleVideoCall: () => void;
  open: boolean;
}

export const HeaderConversation: FC<HeaderConversationProps> = ({
  conversation,
  isOnline,
  statusFriendReceiverId,
  handleToggleDrawer,
  handleAddFriend,
  handleVideoCall,
  open,
}) => {

  const { handleStartCall } = useCall();

  const handleCall = () => {
    handleStartCall(conversation);
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
          <IconButton onClick={handleCall}>
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
