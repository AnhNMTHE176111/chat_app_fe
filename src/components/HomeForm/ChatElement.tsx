// import { Avatar, Badge, Box, Stack, Typography, styled } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useAuth, useSocket } from "../../hooks";
// import { GROUP_CONVERSATION, SINGLE_CONVERSATION } from "../../constants";
// import { AvatarOnline } from "./AvatarOnline";

// const StyledChatBox = styled(Box)(({ theme }) => ({
//   "&:hover": {
//     cursor: "pointer",
//   },
// }));

// export const ChatElement = ({ data }: { data: any }) => {
//   const { id } = useParams<{ id: string }>();
//   const [conversation, setConversation] = useState(data);
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { onlineUsers } = useSocket();

//   useEffect(() => {
//     let online = false;
//     online = conversation.participants.some((participant: any) => {
//       return (
//         participant._id.toString() !== user?.id &&
//         onlineUsers.includes(participant._id.toString())
//       );
//     });
//     setConversation((prev: any) => ({
//       ...prev,
//       online: online,
//     }));
//   }, [onlineUsers]);

//   const handleSelectConversation = () => {
//     navigate(`/chat/${conversation._id}`, {
//       state: {
//         conversation: conversation,
//       },
//     });
//   };

//   const isSelected = id === conversation._id;

//   return (
//     <StyledChatBox
//       onClick={handleSelectConversation}
//       sx={{
//         width: "80%",
//         borderRadius: 5,
//         backgroundColor: isSelected ? "#5c94f4" : "white",
//         margin: "0 auto",
//         marginBottom: 1,
//       }}
//       p={2}
//     >
//       <Stack
//         direction={"row"}
//         alignItems={"center"}
//         justifyContent={"space-between"}
//       >
//         <Stack direction={"row"} spacing={2}>
//           <AvatarOnline
//             isOnline={conversation.online}
//             srcImage={conversation.picture}
//           />
//           <Stack spacing={0.3}>
//             <Typography
//               variant="subtitle2"
//               color={isSelected ? "white" : "black"}
//             >
//               {conversation.title}
//             </Typography>
//             <Typography
//               variant="caption"
//               fontWeight={conversation.unread ? 700 : 400}
//               color={isSelected ? "white" : "black"}
//             >
//               {conversation.message?.slice(0, 20)}
//             </Typography>
//           </Stack>
//         </Stack>
//         <Stack spacing={2} direction={"row"}>
//           <Typography sx={{ fontWeight: 600 }} variant="caption">
//             {conversation.time}
//           </Typography>
//         </Stack>
//       </Stack>
//     </StyledChatBox>
//   );
// };

// export default ChatElement;
