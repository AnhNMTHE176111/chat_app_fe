import { Divider, Grid, List, ListItem } from "@mui/material";
import { ChatElement, SearchInput } from "../../../components";
import { useForm } from "react-hook-form";
import { SearchParams } from "../../../services";
import { FC, useEffect } from "react";
import { getAllConversation } from "../../../services";
import { useMessage } from "../../../hooks";

interface HistoryChatProps {
  conversations: any;
  setConversations: any;
  latestMessage: any;
  onClick?: () => void;
}

export const HistoryChat: FC<HistoryChatProps> = ({
  conversations,
  setConversations,
  latestMessage,
  onClick,
}) => {
  const { control } = useForm<SearchParams>();
  const {} = useMessage();

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

  // useEffect(() => {
  //   if (conversations.length > 0) {
  //     const sortedConversations = [...conversations].sort((a, b) => {
  //       if (a.latestMessage && b.latestMessage) {
  //         return moment(b.latestMessage.createdAt).diff(
  //           moment(a.latestMessage.createdAt)
  //         );
  //       }
  //       return 0;
  //     });
  //     setConversations(sortedConversations);
  //   }
  // }, [conversations, setConversations]);

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
          <ChatElement
            key={value._id}
            data={value}
            latestMessage={latestMessage}
            onClick={onClick}
          />
        ))}
      </List>
    </Grid>
  );
};

export default HistoryChat;
