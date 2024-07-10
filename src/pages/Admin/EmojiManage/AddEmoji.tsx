import React, { useState } from "react";
import {
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Typography,
} from "@mui/material";

interface AddEmojiProps {
  onClose: () => void;
}

export const AddEmoji: React.FC<AddEmojiProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    // For example, you could create a new emoji object and add it to the list
    const newEmoji = { id: Date.now(), name, emoji, description, imageURL };
    console.log(newEmoji);
    onClose(); // Close dialog after form submission
  };

  return (
    <>
      <DialogContent>
        <Typography variant="h6">Add Emoji</Typography>
        <form id="addEmojiForm" onSubmit={handleSubmit}>
          
          <TextField
            margin="dense"
            id="emoji"
            label="Emoji"
            type="text"
            fullWidth
            required
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            id="imageURL"
            label="Image URL"
            type="text"
            fullWidth
            required
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button type="submit" form="addEmojiForm" color="primary">
          Add
        </Button>
      </DialogActions>
    </>
  );
};

export default AddEmoji;
