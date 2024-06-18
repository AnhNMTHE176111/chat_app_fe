import React, { useState } from "react";
import {
  Button,
  TextField,
  Paper,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface User {
  id?: number;
  username: string;
  email: string;
  phone: string;
}

const AddUser: React.FC = () => {
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = (): void => {
    // Code to save the user data
    console.log("Saving user:", user);
  };

  const handleBack = (): void => {
    navigate("/admin/manage-user");
  };

  return (
    <Box
      sx={{
        padding: "24px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        marginTop: "24px",
        marginBottom: "24px",
        marginLeft: "24px",
        marginRight: "24px",
      }}
    >
      <Paper>
        <Toolbar>
          <IconButton onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Add User
          </Typography>
        </Toolbar>
        <Box
          sx={{
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginTop: "16px",
          }}
        >
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            value={user.username}
            onChange={handleInputChange}
            margin="normal"
            fullWidth
          />
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            value={user.email}
            onChange={handleInputChange}
            margin="normal"
            fullWidth
          />
          <TextField
            name="phone"
            label="Phone"
            variant="outlined"
            value={user.phone}
            onChange={handleInputChange}
            margin="normal"
            fullWidth
          />
        </Box>
        <Toolbar>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ marginRight: "16px" }}
          >
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={handleBack}>
            Back
          </Button>
        </Toolbar>
      </Paper>
    </Box>
  );
};

export default AddUser;
