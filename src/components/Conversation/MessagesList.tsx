import {
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Popper,
  Tooltip,
  Typography,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ReplyIcon from "@mui/icons-material/Reply";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { FC, useEffect, useRef, useState } from "react";
import { sxCenterRowFlex } from "../../css/css_type";
import { MESSAGE_TYPE, SOCKET_EVENT } from "../../constants";
import DescriptionIcon from "@mui/icons-material/Description";
import moment from "moment";
import { saveAs } from "file-saver";
import { useAuth, useSocket } from "../../hooks";
import { MessagesListSkeleton } from "../Skeleton";
import { debounce } from "lodash";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface MessagesListProps {
  messages: any[];
  handleOpenPreviewImageDialog: (imageLink: string) => void;
  isLoading: boolean;
  lastMessageRef: any;
}

export const MessagesList: FC<MessagesListProps> = ({
  messages,
  isLoading,
  handleOpenPreviewImageDialog,
  lastMessageRef,
}) => {
  const { user } = useAuth();
  const topMessageRef = useRef<any>();
  const chatContainerRef = useRef<any>();
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [loadingImageFail, setLoadingImageFail] = useState<boolean>(false);
  const [isMyMessageEl, setIsMyMessageEl] = useState<boolean>();
  const timerRef = useRef<any>(null);

  useEffect(() => {
    moveToLastMessage();
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadingImage) {
        setLoadingImageFail(true);
        setLoadingImage(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [loadingImage]);

  const moveToLastMessage = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  const handleImageLoad = () => {
    setLoadingImage(false);
    setLoadingImageFail(false);
  };

  const handleImageError = () => {
    setLoadingImage(false);
    setLoadingImageFail(true);
  };

  const [showMessageOptionIndex, setShowMessageOptionIndex] = useState<any>();
  const handleOnMouseEnter = (index: any) => {
    setShowMessageOptionIndex(index);
  };
  const handleOnMouseLeave = () => {
    setShowMessageOptionIndex(null);
  };

  /** MESSAGE OPTION */
  const [anchorElReaction, setAnchorElReaction] = useState<any | null>(null);
  const [currentMessageId, setCurrentMessageId] = useState<any>(null);
  const { socket } = useSocket();

  const handleOpenReaction = (index: any, msgId: any) => {
    const a = document.getElementById(`message-box-${index}`);
    setAnchorElReaction(a);
    setCurrentMessageId(msgId);
  };
  const handleCloseReaction = () => {
    setAnchorElReaction(null);
    setCurrentMessageId(null);
  };
  const openReaction = Boolean(anchorElReaction);

  const handleReaction = (emoji: EmojiClickData) => {
    const emojiIcon = emoji.emoji;
    messages.map((message: any) => {
      if (message._id == currentMessageId) {
        let reactionIndex = message.reaction.findIndex(
          (reaction: any) => reaction.emoji === emojiIcon
        );
        if (reactionIndex === -1) {
          message.reaction.push({ emoji: emojiIcon, count: 1 });
        } else {
          message.reaction[reactionIndex].count++;
        }
        console.log("message", message);
      }
      return message;
    });
    socket?.emit(SOCKET_EVENT.REACT_MESSAGE, {
      messageId: currentMessageId,
      emoji: emojiIcon,
    });
    handleCloseReaction();
  };

  return (
    <Container
      ref={chatContainerRef}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        maxHeight: "100%",
      }}
      id="scrollableDiv"
    >
      <Popover
        open={openReaction}
        anchorEl={anchorElReaction}
        onClose={handleCloseReaction}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <EmojiPicker
          reactionsDefaultOpen={true}
          allowExpandReactions={false}
          onReactionClick={handleReaction}
        />
      </Popover>

      {isLoading ? (
        <MessagesListSkeleton />
      ) : (
        <List dense={true}>
          {messages.map((message: any, index: any) => {
            const isMyMessage = message.sender_id._id == user?.id;
            const isLastFromSender =
              index == messages.length - 1 ||
              messages[index + 1].sender_id._id != message.sender_id._id;
            const time = moment(message.createdAt).format("HH:mm");
            const fullTime = moment(message.createdAt).format(
              "dddd MMMM Do, HH:mm A"
            );
            let emojiContent = "";
            let numOfEmoji = 0;
            message.reaction.map((emoji: any) => {
              emojiContent += emoji.emoji;
              numOfEmoji += emoji.count;
            });
            emojiContent += numOfEmoji;

            return (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: isMyMessage ? "flex-end" : "flex-start",
                  marginBottom: numOfEmoji !== 0 ? "10px" : "",
                }}
                ref={topMessageRef}
                onMouseEnter={() => handleOnMouseEnter(index)}
                onMouseLeave={() => handleOnMouseLeave()}
              >
                {!isMyMessage && isLastFromSender ? (
                  <ListItemAvatar>
                    <Avatar src={message.sender_id.avatar} />
                  </ListItemAvatar>
                ) : (
                  <ListItemAvatar sx={{ visibility: "hidden" }}>
                    <Avatar />
                  </ListItemAvatar>
                )}

                {isMyMessage && showMessageOptionIndex == index && (
                  <Box id={`message-option-${index}`}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenReaction(index, message._id)}
                    >
                      <ThumbUpIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => console.log("Hello 2")}
                    >
                      <ReplyIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => console.log("Hello 3")}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}

                <Box
                  sx={{
                    backgroundColor: isMyMessage ? "#bbdefb" : "#e0e0e0",
                    borderRadius: "8px",
                    width: "fit-content",
                    maxWidth:
                      message.messageType === MESSAGE_TYPE.IMAGE
                        ? "30%"
                        : "40%",
                    padding: "8px 12px",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    position: "relative",
                  }}
                  id={`message-box-${index}`}
                  ref={lastMessageRef}
                >
                  <Tooltip title={fullTime} placement="left-start">
                    <Box>
                      {message.messageType === MESSAGE_TYPE.IMAGE && (
                        <Box
                          component="div"
                          sx={{
                            width: "100%",
                          }}
                        >
                          {loadingImage && (
                            <Box
                              sx={{
                                minHeight: "300px",
                                width: "200px",
                                ...sxCenterRowFlex,
                                justifyContent: "center",
                              }}
                            >
                              <CircularProgress color="secondary" />
                            </Box>
                          )}
                          <img
                            style={{
                              width: "100%",
                              height: "auto",
                              objectFit: "cover",
                              display: loadingImage ? "none" : "block",
                            }}
                            src={message.attachmentLink}
                            alt={loadingImageFail ? "Image Fail" : "Image"}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            onClick={() =>
                              handleOpenPreviewImageDialog(
                                message.attachmentLink
                              )
                            }
                          />
                        </Box>
                      )}

                      {message.messageType === MESSAGE_TYPE.FILE && (
                        <Box sx={{ ...sxCenterRowFlex }}>
                          <Button
                            variant="outlined"
                            startIcon={<DescriptionIcon />}
                            onClick={() => {
                              saveAs(
                                message.attachmentLink,
                                message.attachmentName
                              );
                            }}
                          >
                            {message.attachmentName ?? "File"}
                          </Button>
                        </Box>
                      )}

                      {message.messageType === MESSAGE_TYPE.TEXT && (
                        <ListItemText
                          secondary={
                            isLastFromSender && (
                              <React.Fragment>
                                <Typography variant="caption" align="center">
                                  {time}
                                </Typography>
                              </React.Fragment>
                            )
                          }
                        >
                          {message.content
                            .split("\n")
                            .map((text: any, index: any) => (
                              <React.Fragment key={index}>
                                <Typography variant="body1">
                                  {text}
                                  <br />
                                </Typography>
                              </React.Fragment>
                            ))}
                        </ListItemText>
                      )}
                    </Box>
                  </Tooltip>
                  {numOfEmoji != 0 && (
                    <Badge
                      badgeContent={emojiContent}
                      color="primary"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        ...(!isMyMessage ? { right: 0 } : { left: 0 }),
                        "& .MuiBadge-badge": {
                          width: "auto",
                          height: "24px",
                          fontSize: "14px",
                          padding: "0 8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          whiteSpace: "nowrap",
                        },
                      }}
                    />
                  )}
                </Box>

                {!isMyMessage && showMessageOptionIndex == index && (
                  <Box id={`message-option-${index}`}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenReaction(index, message._id)}
                    >
                      <ThumbUpIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => console.log("Hello 2")}
                    >
                      <ReplyIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => console.log("Hello 3")}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </ListItem>
            );
          })}
          <div ref={lastMessageRef} />
        </List>
      )}
    </Container>
  );
};

export default MessagesList;
