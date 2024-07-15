import React, { FC, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import MultiSelectCardList from "./MultiSelectCardList";
import {
  createGroupConversation,
  findUserByEmail,
  FriendListParams,
  getFriendList,
} from "../../services";
import { useAuth, useUploadFile } from "../../hooks";

interface CreateGroupDialogProps {
  open: boolean;
  onClose: () => void;
  conversation: any;
}

const CreateGroupDialog: FC<CreateGroupDialogProps> = ({
  open,
  onClose,
  conversation,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [searchResults, setSearchResults] = useState<FriendListParams[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { handleUploadFile, progressUpload } = useUploadFile(); // Hook để xử lý tải lên tệp

  const [file, setFile] = useState<File | null>(null); // State để lưu trữ tệp hình ảnh đã chọn

  useEffect(() => {
    if (open && user) {
      setLoading(true);
      getFriendList(user.id)
        .then((res) => {
          const friendList = res.data;
          const participantsIds = conversation.participants.map(
            (participant: any) => participant._id
          );
          const filteredFriendList = friendList.filter(
            (friend) => !participantsIds.includes(friend.id)
          );

          setSearchResults(filteredFriendList);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [open, user, conversation.participants]);

  const handleSearch = () => {
    setLoading(true);
    findUserByEmail(email)
      .then((res) => {
        setSearchResults(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleCreateGroup = async () => {
    const participantsIds = conversation.participants.map(
      (participant: any) => participant._id
    );

    // Tải lên hình ảnh nếu có
    let uploadedImageUrl = "";
    if (file) {
      const uploadResult = await handleUploadFile(
        file,
        "group-conversation-images"
      );
      if (uploadResult) {
        uploadedImageUrl = uploadResult.url;
      }
    }

    const groupData = {
      title: title || conversation?.title || "Group",
      picture: uploadedImageUrl, // Sử dụng URL hình ảnh đã tải lên
      participants: [...participantsIds, ...selectedFriends],
    };
    createGroupConversation(groupData)
      .then((res) => {
        console.log(res);
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleColseDialog = () => {
    setLoading(false);
    setSearchResults([]);
    setSelectedFriends([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} style={{ overflow: "auto" }}>
      <DialogTitle>Create Group</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <TextField
            label="Search by Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Search"}
          </Button>
        </Box>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <input
            type="file"
            accept=".jpg, .png"
            onChange={(e) => setFile(e.target.files?.[0] || null)} // Lưu trữ tệp hình ảnh đã chọn
            style={{ display: "none" }}
            id="upload-picture-input"
          />
          <label htmlFor="upload-picture-input">
            <Button variant="outlined" component="span">
              Upload Picture
            </Button>
          </label>
          {file && <Typography>{file.name}</Typography>}
        </Box>
        {searchResults.length !== 0 && (
          <Box>
            <Typography variant="h6">Friend List</Typography>
            <MultiSelectCardList
              friendList={searchResults}
              selectedFriends={selectedFriends}
              setSelectedFriends={setSelectedFriends}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleColseDialog}>Cancel</Button>
        <Button onClick={handleCreateGroup}>Create Group</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGroupDialog;
