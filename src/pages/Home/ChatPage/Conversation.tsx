import { Avatar, Button, Grid, Input, Typography } from "@mui/material";
import { AttachFile, Send } from "@mui/icons-material";

export function Conversation() {
  const data = [
    { id: 1, message: "message 1", time: "10:00", online: true, unread: true },
  ];

  return (
    <Grid container xs sx={{ height: "100%", backgroundColor: "#f7f7ff" }}>
      <Grid
        item
        xs={12}
        sx={{
          height: "10%",
          alignItems: "center",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "flex-start",
          padding: "0 10px",
        }}
      >
        <Avatar src="" />
        <Typography variant="subtitle1">Name</Typography>
      </Grid>

      <Grid item xs={12} sx={{ height: "80%" }}></Grid>

      <Grid
        container
        xs={12}
        sx={{
          height: "10%",
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid item xs={1}>
          <Button>
            <AttachFile />
          </Button>
        </Grid>
        <Grid item xs={10}>
          <Input placeholder="Write a message" fullWidth />
        </Grid>
        <Grid item xs={1}>
          <Button>
            <Send />
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Conversation;
