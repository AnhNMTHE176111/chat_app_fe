import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout";

interface User {
  id: string;
  username: string;
  email: string;
}

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy id từ URL
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async (id: string) => {
      // Thay thế bằng mã gọi API thực tế của bạn để lấy thông tin người dùng từ id
      const fetchedUser: User = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              id,
              username: "john_doe",
              email: "john.doe@example.com",
            }),
          500
        )
      );
      setUsername(fetchedUser.username);
      setEmail(fetchedUser.email);
    };

    if (id) {
      fetchUser(id);
    }
  }, [id]);

  const handleSave = () => {};

  const handleBack = () => {
    navigate("/admin/manage-user");
  };

  return (
    <AdminLayout>
      <Typography variant="h5" component="div" gutterBottom>
        Edit User
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
          </Box>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default EditUser;
