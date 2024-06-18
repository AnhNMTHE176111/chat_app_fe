import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout";

interface Emoji {
  id: string;
  emoji: string;
  description: string;
}

const EditEmoji: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy id từ URL
  const [emoji, setEmoji] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmoji = async (id: string) => {
      // Thay thế bằng mã gọi API thực tế của bạn để lấy emoji từ id
      const fetchedEmoji: Emoji = await new Promise((resolve) =>
        setTimeout(
          () => resolve({ id, emoji: "😀", description: "Happy face" }),
          500
        )
      );
      setEmoji(fetchedEmoji.emoji);
      setDescription(fetchedEmoji.description);
    };

    if (id) {
      fetchEmoji(id);
    }
  }, [id]);

  const handleSave = () => {
    // Code to update the emoji and description
    console.log("Emoji ID:", id);
    console.log("Updated Emoji:", emoji);
    console.log("Updated Description:", description);
  };

  const handleBack = () => {
    navigate("/admin/manage-emoji");
  };

  return (
    <AdminLayout>
      <Typography variant="h5" component="div" gutterBottom>
        Edit Emoji
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

export default EditEmoji;
