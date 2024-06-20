import { Divider, Grid, List, ListItem } from "@mui/material";
import { ChatElement, SearchInput } from "../../../components";
import { useForm } from "react-hook-form";
import { SearchParams } from "../../../services";
import { useEffect, useState } from "react";
import { getAllConversation } from "../../../services";
import { useMessage } from "../../../hooks";

export function HistoryChat() {
  const { control, handleSubmit } = useForm<SearchParams>();
  const { conversations, setConversations } = useMessage();

  useEffect(() => {
    getAllConversation()
      .then((response) => {
        if (response && response.data) {
          setConversations(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching conversations:", error);
      });
  }, []);

  return (
    <Grid item xs={12} sx={{ height: "100%" }}>
      <ListItem
        style={{
          height: "12%",
          backgroundColor: "white",
        }}
      >
        <SearchInput control={control} name="search" />
      </ListItem>

      <Divider />

      <List
        aria-labelledby="ellipsis-list-demo"
        sx={{
          "--ListItemDecorator-size": "56px",
          height: "88%",
          overflow: "auto",
          alignItems: "center",
        }}
      >
        {conversations.map((value: any) => (
          <ChatElement key={value._id} data={value} />
        ))}
      </List>
    </Grid>
  );
}

export default HistoryChat;
