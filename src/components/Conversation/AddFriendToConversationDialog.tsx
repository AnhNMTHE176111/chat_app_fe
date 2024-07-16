import React, { useState } from "react";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { showNotificationAction } from "../../stores/notificationActionSlice";
import { useAppDispatch, useAuth } from "../../hooks";
import {
  findFriendByFullName,
  FriendListParams,
  getFriendListNotInGroup,
} from "../../services";
import MultiSelectCardList from "./MultiSelectCardList";

interface AddFriendToConversationDialogProps {
  dialogOpen: boolean;
  onCloseDialog: () => void;
  handleAddFriendToConversation: (selectedFriends: string[]) => void;
  conversation: any;
}

export const AddFriendToConversationDialog: React.FC<
  AddFriendToConversationDialogProps
> = ({
  dialogOpen,
  onCloseDialog,
  handleAddFriendToConversation,
  conversation,
}) => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [foundUsers, setFoundUsers] = useState<FriendListParams[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const dispatchNoti = useAppDispatch();

  const handleFindFriendNotInGroup = (name: string) => {
    if (!name) {
      dispatchNoti(
        showNotificationAction({
          message: "Name is required",
          severity: "error",
        })
      );
      return;
    }
    setLoading(true);
    getFriendListNotInGroup(conversation._id, name)
      .then((resp) => {
        if (resp.success) {
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

  const onAddFriendToConversation = () => {
    handleAddFriendToConversation(selectedFriends);
    onCloseDialog();
  };

  return (
    <Dialog open={dialogOpen} onClose={onCloseDialog}>
      <DialogTitle>Add Friend to Conversation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the name of the user you want to add
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          size="small"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          fullWidth
          sx={{ mb: 2 }}
          variant="standard"
        />
        {loading ? (
          <p>Loading...</p>
        ) : foundUsers.length === 0 ? (
          <span>No users found</span>
        ) : (
          <Container>
            <MultiSelectCardList
              friendList={foundUsers}
              selectedFriends={selectedFriends}
              setSelectedFriends={setSelectedFriends}
            />
          </Container>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleFindFriendNotInGroup(name)}>Find</Button>
        <Button onClick={onCloseDialog}>Cancel</Button>
        <Button
          onClick={onAddFriendToConversation}
          disabled={selectedFriends.length === 0}
        >
          Add to Conversation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFriendToConversationDialog;
