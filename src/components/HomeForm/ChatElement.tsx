import { Avatar, Badge, Box, Stack, Typography, styled } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useMessage, useSocket } from "../../hooks";
import {
  GROUP_CONVERSATION,
  MESSAGE_TYPE,
  SINGLE_CONVERSATION,
} from "../../constants";
import { AvatarOnline } from "./AvatarOnline";
import moment from "moment";
import { SOCKET_EVENT } from "../../constants";
import { getSubjectName, slideText } from "../../helpers/utils";
import { ChatContainerProps } from "../../providers";

const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

interface ChatElementProps {
  data: any;
  latestMessage: any;
  onClick?: () => void;
}

export const ChatElement: FC<ChatElementProps> = ({
  data,
  latestMessage,
  onClick,
}) => {
  /** Gloabl Variable */
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { onlineUsers } = useSocket();
  const { user } = useAuth();
  const { socket } = useSocket();

  /** Current Variable */
  const [conversation, setConversation] = useState(data);
  const [latestMsg, setLatestMsg] = useState<any>(data.latestMessage);
  const [latestMessageContent, setLatestMessageContent] = useState<string>(
    modifyContentLastestMessage(data.latestMessage || null)
  );
  const [latestMessageTime, setLatestMessageTime] = useState<string>();
  // moment(data.latestMessage.createdAt).fromNow()
  // moment(new Date()).fromNow()
  const [isRead, setIsRead] = useState<boolean>(
    data?.latestMessage?.readBy?.includes(user?.id)
  );

  /** Attribute CSS When Selected or Read */
  const isSelected = id === conversation._id;
  const messageColor = isSelected ? "white" : "black";
  const messageWeight = isRead ? 0 : 600;

  useEffect(() => {
    if (latestMessage && latestMessage?.conversation_id == conversation._id) {
      setLatestMsg(latestMessage);
      setLatestMessageContent(modifyContentLastestMessage(latestMessage));
      setLatestMessageTime(moment(latestMessage.createdAt).fromNow());
      setIsRead(latestMessage.readBy.includes(user?.id));
    }
  }, [latestMessage]);

  useEffect(() => {
    let interval = setInterval(() => {
      if (latestMsg) {
        setLatestMessageTime(moment(latestMsg.createdAt).fromNow());
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [latestMsg]);

  useEffect(() => {
    if (latestMsg) {
      if (id && latestMsg.conversation_id == id && !isRead) {
        socket.emit(SOCKET_EVENT.READ_MESSAGE, {
          userId: user?.id,
          messageId: latestMsg._id,
          createdAt: latestMsg.createdAt,
          conversation_id: latestMsg.conversation_id,
        });
        latestMsg.readBy.push(user?.id);
        setIsRead(
          latestMsg.conversation_id == id && latestMsg.readBy.includes(user?.id)
        );
      }
    }
  }, [id, socket, latestMessage, data.latestMessage, user?.id]);

  useEffect(() => {
    let online = false;
    online = conversation.participants.some((participant: any) => {
      return (
        participant._id.toString() !== user?.id &&
        onlineUsers.includes(participant._id.toString())
      );
    });
    setConversation((prev: any) => ({
      ...prev,
      online: online,
    }));
  }, [onlineUsers]);

  const handleSelectConversation = () => {
    if (onClick) {
      onClick();
    }
    navigate(`/chat/${conversation._id}`, {
      state: {
        conversation: conversation,
      },
    });
  };

  // Cannot access 'user' before initialization

  function modifyContentLastestMessage(objectMessage: any) {
    if (objectMessage == null) {
      return "";
    }
    const subjectName = getSubjectName(objectMessage.sender_id.fullName);
    let subject =
      objectMessage.sender_id._id == user?.id
        ? "You"
        : subjectName || "Someone";

    let content = "";
    switch (objectMessage.messageType) {
      case MESSAGE_TYPE.TEXT:
        content = slideText(objectMessage.content, 15);
        if (conversation.type === GROUP_CONVERSATION) {
          return `${subject}: ${content}`;
        }
        return subject !== "You" ? content : `${subject}: ${content}`;

      case MESSAGE_TYPE.FILE:
      case MESSAGE_TYPE.VOICE:
      case MESSAGE_TYPE.IMAGE:
        const messageTypes = {
          [MESSAGE_TYPE.FILE]: "send a file",
          [MESSAGE_TYPE.VOICE]: "send a voice",
          [MESSAGE_TYPE.IMAGE]: "send an image",
        };
        content = messageTypes[objectMessage.messageType];
        break;

      default:
        content = "send a message";
        break;
    }

    return `${subject} ${content}`;
  }

  return (
    <StyledChatBox
      onClick={handleSelectConversation}
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
        <Stack direction={"row"} spacing={2} sx={{ width: "100%" }}>
          <AvatarOnline
            isOnline={conversation.online}
            title={conversation.title}
            srcImage={conversation.picture}
          />
          <Stack spacing={0.3} sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
                width: "100%",
              }}
            >
              <Typography
                variant="subtitle2"
                color={messageColor}
                fontWeight={messageWeight}
              >
                {slideText(conversation.title, 20)}
              </Typography>
              <Typography
                variant="caption"
                fontSize={12}
                color={messageColor}
                fontWeight={messageWeight}
              >
                {latestMessageTime}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              color={messageColor}
              fontWeight={messageWeight}
            >
              {latestMessageContent}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export default ChatElement;
