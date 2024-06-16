import React from "react";
import HomeLayout from "../../../layouts/HomeLayout";
import { Divider, Grid } from "@mui/material";
import HistoryChat from "./HistoryChat";
import Conversation from "./Conversation";
import { useParams } from "react-router-dom";

export function ChatPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <HomeLayout>
      <Grid
        container
        sx={{
          height: "100%",
          width: "100%",
          backgroundColor: "#f7f7ff",
        }}
      >
        <Grid item xs={3} sx={{ height: "100%" }}>
          <HistoryChat />
        </Grid>

        <Divider orientation="vertical" flexItem />

        <Grid container xs sx={{ height: "100%" }}>
          {id ? (
            <Conversation />
          ) : (
            <span
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                display: "flex",
                fontSize: "1.5rem",
                color: "grey",
              }}
            >
              Select a conversation
            </span>
          )}
        </Grid>
      </Grid>
    </HomeLayout>
  );
}

export default ChatPage;
