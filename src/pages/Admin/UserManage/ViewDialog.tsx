import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface ViewDialogProps {
  open: boolean;
  onClose: () => void;
  userData: {
    id: number;
    username: string;
    fullname: string;
    age: number;
    phone: string;    // New field: phone
    address: string;  // New field: address
  };
}

export const ViewDialog: React.FC<ViewDialogProps> = ({
  open,
  onClose,
  userData,
}) => {
  const { id, username, fullname, age, phone, address } = userData;

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>User Details</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="ID"
          variant="outlined"
          value={id}
          InputProps={{ readOnly: true }}
          sx={{ mb: 1 }} // Add margin-bottom to the TextField
        />
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          value={username}
          InputProps={{ readOnly: true }}
          sx={{ mb: 1 }} // Add margin-bottom to the TextField
        />
        <TextField
          fullWidth
          label="Fullname"
          variant="outlined"
          value={fullname}
          InputProps={{ readOnly: true }}
          sx={{ mb: 1 }} // Add margin-bottom to the TextField
        />
        <TextField
          fullWidth
          label="Age"
          variant="outlined"
          value={age}
          InputProps={{ readOnly: true }}
          sx={{ mb: 1 }} // Add margin-bottom to the TextField
        />
        <TextField
          fullWidth
          label="Phone"
          variant="outlined"
          value={phone}
          InputProps={{ readOnly: true }}
          sx={{ mb: 1 }} // Add margin-bottom to the TextField
        />
        <TextField
          fullWidth
          label="Address"
          variant="outlined"
          value={address}
          InputProps={{ readOnly: true }}
          sx={{ mb: 1 }} // Add margin-bottom to the TextField
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDialog;
