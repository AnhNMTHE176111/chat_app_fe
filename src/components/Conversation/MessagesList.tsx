import {
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
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
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { getSubjectName, slideText } from "../../helpers/utils";
import "../../css/MessageAnimation.css";

interface MessagesListProps {
  messages: any[];
  setMessages: React.Dispatch<any>;
  handleOpenPreviewImageDialog: (imageLink: string) => void;
  isLoading: boolean;
  lastMessageRef: any;
  setThreadMessage: React.Dispatch<any>;
  receiver: any;
  conversation: any;
}

interface MessageOptionsProps {
  index: number;
  message: any;
  handleThreadMessage: (message: any) => void;
  handleOpenReaction: (index: any, msgId: any) => void;
  handleOpenDialogDelete: () => void;
}

const editContentThread = (message: any, lengthSlide: number) => {
  let content = "";
  switch (message.messageType) {
    case MESSAGE_TYPE.FILE:
      content = "File";
      break;
    case MESSAGE_TYPE.IMAGE:
      content = "Image";
      break;
    case MESSAGE_TYPE.TEXT:
      content = slideText(message.content, lengthSlide);
      break;
    default:
      break;
  }
  return content;
};

const MessageOptions: FC<MessageOptionsProps> = ({
  index,
  message,
  handleOpenReaction,
  handleThreadMessage,
  handleOpenDialogDelete,
}) => {
  return (
    <Box id={`message-option-${index}`}>
      <IconButton
        size="small"
        onClick={() => handleOpenReaction(index, message._id)}
      >
        <ThumbUpIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => handleThreadMessage(message)}>
        <ReplyIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={handleOpenDialogDelete}>
        <DeleteOutlineOutlinedIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export const MessagesList: FC<MessagesListProps> = ({
  conversation,
  messages,
  setMessages,
  isLoading,
  handleOpenPreviewImageDialog,
  lastMessageRef,
  setThreadMessage,
  receiver,
}) => {
  const { user } = useAuth();
  const topMessageRef = useRef<any>();
  const chatContainerRef = useRef<any>();
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [loadingImageFail, setLoadingImageFail] = useState<boolean>(false);
  const [isMyMessageEl, setIsMyMessageEl] = useState<boolean>();
  const timerRef = useRef<any>(null);
  const threadMessagesRef: any = {};
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const scrollToThreadMessage = (messageId: any) => {
    if (threadMessagesRef[messageId]) {
      setHighlightedMessageId(messageId);
      threadMessagesRef[messageId].scrollIntoView({ behavior: "auto" });
    }
  };

  useEffect(() => {
    moveToLastMessage();
    setHighlightedMessageId(null);
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
      conversation: conversation,
    });
    handleCloseReaction();
    setHighlightedMessageId(null);
  };

  const handleThreadMessage = (message: any) => {
    const subjectName =
      message.sender_id._id == user?.id
        ? "You"
        : getSubjectName(message.sender_id.fullName);
    const replyTo = `Reply to ${subjectName}`;
    let content = editContentThread(message, 50);
    setHighlightedMessageId(null);
    setThreadMessage({ message: message, replyTo: replyTo, content: content });
    handleCloseReaction();
  };

  /** Dialog delete message */
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [deleteIsMyMessage, setDeleteIsMyMessage] = useState(false);
  const [currentDeleteMessage, setCurrentDeleteMessage] = useState<any>(null);

  const handleOpenDialogDelete = (message: any, isMyMessage: boolean) => {
    setOpenDialogDelete(true);
    setDeleteIsMyMessage(isMyMessage);
    setCurrentDeleteMessage(message);
  };

  const handleCloseDialogDelete = () => {
    setOpenDialogDelete(false);
    setDeleteIsMyMessage(false);
    setCurrentDeleteMessage(null);
  };

  const handleDeleteMessage = () => {
    if (currentDeleteMessage) {
      socket?.emit(SOCKET_EVENT.DELETE_MESSAGE, {
        message: currentDeleteMessage,
        isMyMessage: deleteIsMyMessage,
        hiddenFor: user?.id,
        receiver: receiver,
        conversation: conversation
      });
      const updatedMessages = messages.filter(
        (item: any) => item._id != currentDeleteMessage._id
      );
      setMessages(updatedMessages);
    }
    handleCloseDialogDelete();
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

      <Dialog
        open={openDialogDelete}
        onClose={handleCloseDialogDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {deleteIsMyMessage
            ? "Permanently delete your messages?"
            : "Delete someone else's messages?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {deleteIsMyMessage
              ? "Neither anyone nor you can see this message after deletion."
              : "This message will no longer be visible to you, but it will still appear elsewhere"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogDelete}>Disagree</Button>
          <Button onClick={handleDeleteMessage} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      {isLoading ? (
        <MessagesListSkeleton />
      ) : (
        <List dense={true}>
          {messages.map((message: any, index: any) => {
            let isHidden = message.hiddenFor.includes(user?.id);
            let breakTime = false;
            if (index > 0) {
              breakTime =
                moment(message.createdAt).diff(
                  moment(messages[index - 1].createdAt),
                  "hours"
                ) >= 2;
            }
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
            let threadContent = "";
            if (message.thread) {
              threadContent = editContentThread(message.thread, 15);
            }

            return (
              <React.Fragment key={message._id}>
                {breakTime && (
                  <Typography
                    textAlign={"center"}
                    fontSize={12}
                    sx={{
                      display: isHidden ? "none" : "",
                      margin: "20px 0",
                    }}
                  >
                    {fullTime}
                  </Typography>
                )}
                <ListItem
                  sx={{
                    display: isHidden ? "none" : "flex",
                    justifyContent: isMyMessage ? "flex-end" : "flex-start",
                    marginBottom: numOfEmoji !== 0 ? "10px" : "",
                  }}
                  ref={(ref) => {
                    threadMessagesRef[message._id] = ref;
                  }}
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
                    <MessageOptions
                      index={index}
                      message={message}
                      handleOpenReaction={handleOpenReaction}
                      handleThreadMessage={handleThreadMessage}
                      handleOpenDialogDelete={() =>
                        handleOpenDialogDelete(message, isMyMessage)
                      }
                    />
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
                      padding: "4px 8px",
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      position: "relative",
                      marginTop: message.thread ? "25px" : "0",
                      border:
                        highlightedMessageId == message._id
                          ? "2px solid white"
                          : "none",
                    }}
                    className={
                      highlightedMessageId === message._id ? "highlighted" : ""
                    }
                    id={`message-box-${index}`}
                    ref={lastMessageRef}
                  >
                    {message.thread && (
                      <Box
                        onClick={() =>
                          scrollToThreadMessage(message.thread._id)
                        }
                      >
                        <Paper
                          elevation={3}
                          sx={{
                            position: "absolute",
                            top: -25,
                            ...(isMyMessage ? { right: 0 } : { left: 0 }),
                            width: "auto",
                            height: "24px",
                            fontSize: "14px",
                            padding: "0 8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <ReplyRoundedIcon fontSize="small" />
                          {threadContent}
                        </Paper>
                      </Box>
                    )}

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
                    <MessageOptions
                      index={index}
                      message={message}
                      handleOpenReaction={handleOpenReaction}
                      handleThreadMessage={handleThreadMessage}
                      handleOpenDialogDelete={() =>
                        handleOpenDialogDelete(message, isMyMessage)
                      }
                    />
                  )}
                </ListItem>
              </React.Fragment>
            );
          })}
          <div ref={lastMessageRef} />
        </List>
      )}
    </Container>
  );
};

export default MessagesList;
