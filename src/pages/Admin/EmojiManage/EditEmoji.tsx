import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

// Sample data type
interface Emoji {
  id: number;
  emoji: string;
  name: string;
  description: string;
  imageURL: string;
}

interface Props {
  emoji: Emoji;
  open: boolean;
  onClose: () => void;
  onSave: (emoji: Emoji) => void;
}

export const EditEmoji: React.FC<Props> = ({ emoji, open, onClose, onSave }) => {
  const [editedEmoji, setEditedEmoji] = useState<Emoji>(emoji);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedEmoji((prevEmoji) => ({
      ...prevEmoji,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedEmoji);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Emoji</DialogTitle>
      <DialogContent>
      <TextField
          fullWidth
          label="Emoji"
          name="emoji"
          value={editedEmoji.emoji}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={editedEmoji.name}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={editedEmoji.description}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Image URL"
          name="imageURL"
          value={editedEmoji.imageURL}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmoji;
