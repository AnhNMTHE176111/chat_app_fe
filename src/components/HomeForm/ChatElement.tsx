import { Avatar, Badge, Box, Stack, Typography, styled } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export const ChatElement = (data: any) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const data1 = data.data;
  const StyledChatBox = styled(Box)(({ theme }) => ({
    "&:hover": {
      cursor: "pointer",
    },
  }));

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  const isSelected = id === data1.id;

  return (
    <StyledChatBox
      onClick={() => navigate(`/chat/${data1.id}`)}
      sx={{
        width: "80%",
        borderRadius: 5,
        backgroundColor: isSelected ? "#5c94f4" : "white",
        margin: "0 auto",
        marginBottom: 1,
      }}
      p={2}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack direction={"row"} spacing={2}>
          {data1.online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar src="" />
            </StyledBadge>
          ) : (
            <Avatar src="" />
          )}
          <Stack spacing={0.3}>
            <Typography
              variant="subtitle2"
              color={isSelected ? "white" : "black"}
            >
              {data1.name}
            </Typography>
            <Typography
              variant="caption"
              fontWeight={data1.unread ? 700 : 400}
              color={isSelected ? "white" : "black"}
            >
              {data1.message?.slice(0, 20)}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} direction={"row"}>
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            {data1.time}
          </Typography>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export default ChatElement;
