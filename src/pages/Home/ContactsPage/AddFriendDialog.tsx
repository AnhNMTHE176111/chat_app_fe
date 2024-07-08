import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import React from "react";

import { Message, MoreVert, PersonAdd, Preview } from "@mui/icons-material";
import {
  addFriendRequest,
  findUserByEmail,
  FriendListParams,
} from "../../../services";
import { useAppDispatch, useAuth } from "../../../hooks";
import { showNotificationAction } from "../../../stores/notificationActionSlice";
import { ProfileCard } from "../../../components";
import { useNavigate } from "react-router-dom";

interface Option {
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

interface AddFriendDialogProps {
  dialogOpen: boolean;
  onCloseDialog: () => void;
}

export const AddFriendDialog: React.FC<AddFriendDialogProps> = ({
  dialogOpen,
  onCloseDialog,
}) => {
  const { user } = useAuth();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [foundUsers, setFoundUsers] = React.useState<FriendListParams[]>([]);
  const dispatchNoti = useAppDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openProfileDialog, setOpenProfileDialog] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<null | string>(
    null
  );
  const open = Boolean(anchorEl);

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    userId: string
  ) => {
    setAnchorEl(event.currentTarget);
    console.log(userId);
    setSelectedUserId(userId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleFindByEmail = (email: string) => {
    if (!email) {
      dispatchNoti(
        showNotificationAction({
          message: "Email is required",
          severity: "error",
        })
      );
      return;
    }
    setLoading(true);
    findUserByEmail(email)
      .then((resp) => {
        if (resp.success) {
          console.log(resp.data);
          setFoundUsers(resp.data);
        }
      })
      .catch((error) => {
        dispatchNoti(
          showNotificationAction({
            message: error?.message?.data?.message || "Something went wrong",
            severity: "error",
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onMessage = (id: string) => {
    if (user?.id) {
      navigate(`/chat/${id}`);
    }
  };

  const onAddFriend = (id: string) => {
    if (user?.id) {
      addFriendRequest(user.id, {
        friendId: id,
      })
        .then((res) => {
          console.log(res);
          if (res.success) {
            setSelectedUserId(null);
            setFoundUsers([]);
            dispatchNoti(
              showNotificationAction({
                message: "Request sent successfully",
                severity: "success",
              })
            );
          }
        })
        .catch((err) => {
          console.log(err);
          dispatchNoti(
            showNotificationAction({
              message: err?.message?.data?.message || "Something went wrong",
              severity: "error",
            })
          );
        });
    }
  };

  const options: Option[] = [
    {
      label: "Profile",
      icon: <Preview />,
      action: () => setOpenProfileDialog(true),
    },
    {
      label: "Message",
      icon: <Message />,
      action: () => onMessage(selectedUserId as string),
    },
    {
      label: "Add Friend",
      icon: <PersonAdd />,
      action: () => onAddFriend(selectedUserId as string),
    },
  ];

  return (
    <Dialog open={dialogOpen} onClose={onCloseDialog}>
      <DialogTitle>Add Friend</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the email address of the user you want to add
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          size="small"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          fullWidth
          sx={{ mb: 2 }}
          variant="standard"
        />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Container>
            {foundUsers.length === 0 ? (
              <span>No users found</span>
            ) : (
              foundUsers.map((user, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardHeader
                    avatar={
                      <Avatar src={user.avatar} aria-label="user-avatar" />
                    }
                    title={user.fullName}
                    action={
                      <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-haspopup="true"
                        onClick={(e) => handleClick(e, user.id)}
                        aria-controls={open ? "action-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                      >
                        <MoreVert />
                      </IconButton>
                    }
                  />
                </Card>
              ))
            )}
          </Container>
        )}
        <Menu
          anchorEl={anchorEl}
          id="action-menu"
          disableScrollLock={true}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: "left", vertical: "top" }}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        >
          {selectedUserId &&
            options.map((option, index) => (
              <MenuItem onClick={option.action} key={index}>
                {option.icon}
                {option.label}
              </MenuItem>
            ))}
          {selectedUserId && (
            <ProfileCard
              id={selectedUserId}
              open={openProfileDialog}
              onClose={() => setOpenProfileDialog(false)}
            />
          )}
        </Menu>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleFindByEmail(email)}>Find</Button>
        <Button onClick={onCloseDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFriendDialog;
