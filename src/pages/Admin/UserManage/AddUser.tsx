import React from "react";
import {
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Typography,
} from "@mui/material";

interface AddUserProps {
  onClose: () => void;
}

export const AddUser: React.FC<AddUserProps> = ({ onClose }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    onClose(); // Close dialog after form submission
  };

  return (
    <>
      <DialogContent>
        <Typography variant="h6">Add User</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            id="FullName"
            label="FullName"
            type="text"
            fullWidth
            required
          />
          <TextField
            autoFocus
            margin="dense"
            id="Username"
            label="Username"
            type="text"
            fullWidth
            required
          />
          <TextField
            margin="dense"
            id="email"
            label="Email "
            type="email"
            fullWidth
            required
          />
          <TextField
            margin="dense"
            id="phone"
            label="Phone "
            type="Phone"
            fullWidth
            required
          />

          {/* Add more fields as needed */}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button type="submit" form="addUserForm" color="primary">
          Add
        </Button>
      </DialogActions>
    </>
  );
};

export default AddUser;
