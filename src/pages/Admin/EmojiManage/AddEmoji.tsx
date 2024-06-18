import React, { useState } from "react";
import { Box, TextField, Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout";

const AddEmoji: React.FC = () => {
  const [emoji, setEmoji] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();

  const handleSave = () => {
    // Code to save the emoji and description
    console.log("Emoji:", emoji);
    console.log("Description:", description);
  };

  const handleBack = () => {
    navigate("/admin/manage-emoji");
  };

  return (
    <AdminLayout>
      <Typography variant="h5" component="div" gutterBottom>
        Add Emoji
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Emoji"
            variant="outlined"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

export default AddEmoji;
