// import { Divider, Grid, List, ListItem } from "@mui/material";
// import { ChatElement, SearchInput } from "../../../components";
// import { useForm } from "react-hook-form";
// import { SearchParams } from "../../../services";
// import { useEffect, useState } from "react";
// import { getAllConversation } from "../../../services";

// export function HistoryChat() {
//   const { control, handleSubmit } = useForm<SearchParams>();
//   const [conversations, setConversations] = useState<any[]>([]);

//   const data = [
//     {
//       name: "name 1",
//       message: "title 1",
//       time: "10:00",
//       online: true,
//       unread: true,
//       id: "1",
//     },
//     {
//       name: "name 2",
//       message: "title 2",
//       time: "10:00",
//       online: false,
//       unread: false,
//       id: "2",
//     },
//   ];

//   useEffect(() => {
//     getAllConversation()
//       .then((response) => {
//         if (response && response.data) {
//           setConversations(response.data);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching conversations:", error);
//       });
//   }, []);

//   return (
//     <Grid item xs={12} sx={{ height: "100%" }}>
//       <ListItem
//         style={{
//           height: "12%",
//           backgroundColor: "white",
//         }}
//       >
//         <SearchInput control={control} name="search" />
//       </ListItem>

//       <Divider />

//       <List
//         aria-labelledby="ellipsis-list-demo"
//         sx={{
//           "--ListItemDecorator-size": "56px",
//           height: "88%",
//           overflow: "auto",
//           alignItems: "center",
//         }}
//       >
//         {conversations.map((value: any) => (
//           <ChatElement key={value._id} data={value} />
//         ))}
//       </List>
//     </Grid>
//   );
// }

// export default HistoryChat;
