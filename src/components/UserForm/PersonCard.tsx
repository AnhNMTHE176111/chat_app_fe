import React, { useContext } from "react";
import { Message, MoreVert, PersonRemove, Preview } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { SocketContext } from "../../providers";

interface Option {
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

interface PersonCardProps {
  id: string;
  avatar: string;
  fullName: string;
  onViewProfile: (id: string) => void;
  onMessage: (id: string) => void;
  onUnfriend: (id: string) => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({
  id,
  avatar,
  fullName,
  onViewProfile,
  onMessage,
  onUnfriend,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { onlineUsers } = useContext(SocketContext);

  const options: Option[] = [
    {
      label: "View Profile",
      icon: <Preview />,
      action: () => onViewProfile(id),
    },
    {
      label: "Message",
      icon: <Message />,
      action: () => onMessage(id),
    },
    {
      label: "Unfriend",
      icon: <PersonRemove />,
      action: () => onUnfriend(id),
    },
    // {
    //   label: "Block",
    //   icon: <Block />,
    //   action: () => {},
    // },
  ];

  return (
    <Card sx={{ width: "100%", height: "100%" }}>
      <CardHeader
        avatar={<Avatar aria-label="user-avatar" src={avatar} />}
        action={
          <IconButton
            aria-label="more"
            id="long-button"
            aria-haspopup="true"
            onClick={handleClick}
            aria-controls={open ? "action-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
          >
            <MoreVert />
          </IconButton>
        }
        title={fullName}
        titleTypographyProps={{ fontWeight: "bold" }}
        subheader={onlineUsers.includes(id) ? "Online" : "Offline"}
        subheaderTypographyProps={{
          color: onlineUsers.includes(id) ? "green" : "gray",
          fontWeight: "bold",
        }}
      />
      <Menu
        anchorEl={anchorEl}
        id="action-menu"
        disableScrollLock={true}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        {options.map((option, index) => (
          <MenuItem onClick={option.action} key={index}>
            {option.icon}
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Card>
  );
};

export default PersonCard;
