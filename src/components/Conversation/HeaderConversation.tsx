import { Box, Grid, IconButton, ListItemText, Tooltip } from "@mui/material";
import React, { FC } from "react";
import { AvatarOnline } from "../HomeForm";
import { useDrawerState } from "../../hooks";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CallIcon from "@mui/icons-material/Call";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";

interface HeaderConversation {
  conversation: any;
  isOnline: boolean;
}

export const HeaderConversation: FC<HeaderConversation> = ({
  conversation,
  isOnline,
}) => {
  const { handleToggleDrawer, open } = useDrawerState();

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
        <Tooltip title="Add Friend">
          <IconButton>
            <PersonAddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Call">
          <IconButton>
            <CallIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Video Call">
          <IconButton>
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
