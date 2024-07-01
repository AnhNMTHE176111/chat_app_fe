import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AttachFile, Send } from "@mui/icons-material";
import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import {
  getConversationByID,
  getMessagesConversation,
  loadMoreMessageConversation,
  sendMessage,
} from "../../../services";
import {
  CircularProgressWithLabel,
  DialogViewImage,
  HeaderConversation,
  ConversationOptions,
  ImagePreview,
  InputMessage,
} from "../../../components";
import {
  useAuth,
  useDrawerState,
  useMessage,
  useSocket,
  useUploadFile,
} from "../../../hooks";
import moment from "moment";
import DescriptionIcon from "@mui/icons-material/Description";
import { MESSAGE_TYPE, SOCKET_EVENT } from "../../../constants";
import InfiniteScroll from "react-infinite-scroll-component";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import * as _ from "lodash";
import { saveAs } from "file-saver";
import { sxCenterRowFlex } from "../../../css/css_type";

const drawerWidth = 300;

export function Conversation() {
  const location = useLocation();
  const [conversation, setConversation] = useState(
    location.state?.conversation || null
  );

  const { id } = useParams<string>();
  const { onlineUsers, socket } = useSocket();
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(
    conversation?.online ? conversation?.online : false
  );

  const topMessageRef = useRef<any>();
  const chatContainerRef = useRef<any>();
  const observer = useRef<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [loadingImageFail, setLoadingImageFail] = useState<boolean>(false);
  const [anchorElMessage, setAnchorElMessage] = useState<any | null>(null);

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    const boxElement = document.getElementById(`message-box-${index}`);
    if (boxElement) {
      setAnchorElMessage(boxElement);
    } else {
      setAnchorElMessage(null);
    }
  };

  const handlePopoverClose = () => {
    setAnchorElMessage(null);
  };
  const openPopover = Boolean(anchorElMessage);

  const [receiver, setReceiver] = useState();
  const { handleUploadFile, progressUpload } = useUploadFile();
  const [isLoadMoreMsg, setIsLoadMoreMsg] = useState(false);
  const lastMessageRef = useRef<any>(null);

  const {
    setNewMessage,
    messages,
    setMessages,
    setLatestMessage,
    conversations,
    setConversations,
  } = useMessage();

  const { open } = useDrawerState();

  /** Preview Image */
  const [openPreviewImage, setOpenPreviewImage] = useState<boolean>(false);
  const [previewImageLink, setPreviewImageLink] = useState<string>("");
  const handleClosePreviewImageDialog = () => {
    setOpenPreviewImage(false);
  };
  const handleOpenPreviewImageDialog = (imageLink: string) => {
    setOpenPreviewImage(true);
    setPreviewImageLink(imageLink);
  };

  useEffect(() => {
    if (id) {
      setLoadingImage(true);
      const fetch = async () => {
        try {
          const result = await getConversationByID(id);
          setConversation(result.data);
        } catch (error) {}
      };
      if (!conversation || conversation.id != id) {
        fetch();
      }
      getMessagesConversation(id)
        .then((result) => {
          setMessages(result.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          moveToLastMessage();
        });
    }
  }, [id]);

  useEffect(() => {
    if (conversation) {
      const onlineUsersInConversation = conversation.participants.filter(
        (participant: any) =>
          participant._id.toString() !== user?.id &&
          onlineUsers.includes(participant._id.toString())
      );

      setReceiver(onlineUsersInConversation);

      if (onlineUsersInConversation) {
        setIsOnline(onlineUsersInConversation.length > 0);
      }
    }
  }, [id, onlineUsers, conversation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadingImage) {
        setLoadingImageFail(true);
        setLoadingImage(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [loadingImage]);

  const handleImageLoad = () => {
    setLoadingImage(false);
    setLoadingImageFail(false);
  };

  const handleImageError = () => {
    setLoadingImage(false);
    setLoadingImageFail(true);
  };

  const handleSendMessage = async (
    message: string,
    file: File | null,
    fileDestination: string
  ) => {
    let messageType = "text";
    let resultUpload = null;

    if (file) {
      try {
        resultUpload = await handleUploadFile(file, fileDestination);
      } catch (error) {
        console.log(error);
      }
      messageType = MESSAGE_TYPE.FILE;
      if (file.type.startsWith("image/")) {
        messageType = MESSAGE_TYPE.IMAGE;
      }
    }

    sendMessage(conversation?._id, {
      content: message,
      receiver: receiver,
      messageType: messageType,
      attachmentLink: resultUpload?.url,
      attachmentName: file?.name || null,
      attachmentSize: resultUpload?.size,
    }).then((result: any) => {
      socket?.emit(SOCKET_EVENT.SEND_MESSAGE, { message: message });

      const updatedConversations = conversations.map((conversation: any) => {
        if (conversation._id == id) {
          return {
            ...conversation,
            latestMessage: result.data,
          };
        }
        return conversation;
      });
      setConversations(updatedConversations);
      setLatestMessage(result.data);
      setNewMessage(result.data);
      setMessages((prev: any) => [...prev, result.data]);
      moveToLastMessage();
    });
  };

  /** Infinite Scroll */
  // useEffect(() => {
  //   if (observer.current) {
  //     observer.current.disconnect();
  //     console.log(observer.current);
  //   }
  //   observer.current = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting) {
  //         loadMoreData();
  //       }
  //     },
  //     {
  //       root: chatContainerRef.current,
  //       threshold: 1,
  //       rootMargin: "0px 1px",
  //     }
  //   );
  //   if (topMessageRef.current) {
  //     observer.current.observe(topMessageRef.current);
  //   }
  //   return () => {
  //     if (observer.current) observer.current.disconnect();
  //   };
  // }, [topMessageRef, messages]);

  const moveToLastMessage = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  const loadMoreData = () => {
    if (id) {
      setIsLoading(true);
      setIsLoadMoreMsg(true);
      return loadMoreMessageConversation(id, messages[0].createdAt)
        .then((result: any) => {
          setMessages((prev: any) => [...result.data, ...prev]);
        })
        .catch((error) => {
          console.log("error", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <Grid container sx={{ height: "100%" }}>
      <DialogViewImage
        open={openPreviewImage}
        onClose={handleClosePreviewImageDialog}
        image={previewImageLink}
      />
      <Grid
        item
        xs={open ? 8 : 12}
        sx={{
          height: "100%",
          backgroundColor: "#f7f7ff",
        }}
      >
        {/* HEADER CONVERSATION */}
        <Grid
          item
          xs={12}
          sx={{
            height: "10%",
            alignItems: "center",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 10px",
          }}
        >
          <HeaderConversation conversation={conversation} isOnline={isOnline} />
        </Grid>

        {/* MESSAGE CONTAINER */}
        <Grid item xs={12} sx={{ height: "80%" }}>
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
            {/* <InfiniteScroll
              dataLength={messages.length}
              next={loadMoreData}
              style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
              inverse={true} //
              hasMore={true}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableDiv"
            > */}
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

                return (
                  <ListItem
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: isMyMessage ? "flex-end" : "flex-start",
                    }}
                    ref={topMessageRef}
                    onMouseEnter={(event) => handlePopoverOpen(event, index)}
                    onMouseLeave={handlePopoverClose}
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
                    {/* <Popover
                      sx={{
                        pointerEvents: "none",
                      }}
                      open={openPopover}
                      anchorEl={anchorElMessage}
                      anchorOrigin={{
                        vertical: "center",
                        horizontal: isMyMessage ? "left" : "right",
                      }}
                      transformOrigin={{
                        vertical: "center",
                        horizontal: isMyMessage ? "right" : "left",
                      }}
                      onClose={handlePopoverClose}
                      disableRestoreFocus
                    >
                      <IconButton size="small">
                        <ThumbUpIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <ReplyIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Popover> */}
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
                                    <Typography
                                      variant="caption"
                                      align="center"
                                    >
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
                    </Box>
                  </ListItem>
                );
              })}
              <div ref={lastMessageRef} />
            </List>
            {/* </InfiniteScroll> */}
          </Container>
        </Grid>

        {/* INPUT MESSAGE */}
        <Grid
          container
          item
          xs={12}
          sx={{
            height: "10%",
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <InputMessage
            conversationId={id}
            handleSendMessage={handleSendMessage}
            progressUpload={progressUpload}
          />
        </Grid>
      </Grid>

      {open && (
        <Grid
          container
          item
          xs={open ? 4 : 0}
          sx={{
            height: "100%",
          }}
        >
          <ConversationOptions
            open={open}
            conversation={conversation}
            isOnline={isOnline}
            id={id}
            handleOpenPreviewImageDialog={handleOpenPreviewImageDialog}
          />
        </Grid>
      )}
    </Grid>
  );
}

export default Conversation;
