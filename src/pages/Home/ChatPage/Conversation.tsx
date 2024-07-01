import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Stack,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AttachFile, Send } from "@mui/icons-material";
import { useLocation, useParams } from "react-router-dom";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  getAllFilesConversation,
  getAllMediasConversation,
  getConversationByID,
  getMessagesConversation,
  loadMoreMessageConversation,
  sendMessage,
  storage,
  storageRef,
} from "../../../services";
import {
  AvatarOnline,
  CircularProgressWithLabel,
  DialogViewImage,
} from "../../../components";
import {
  useAuth,
  useDrawerState,
  useMessage,
  useSocket,
  useUploadFile,
} from "../../../hooks";
import moment from "moment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CallIcon from "@mui/icons-material/Call";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReplyIcon from "@mui/icons-material/Reply";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { MESSAGE_TYPE, SOCKET_EVENT } from "../../../constants";
import InfiniteScroll from "react-infinite-scroll-component";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import * as _ from "lodash";
import { saveAs } from "file-saver";
import { ConversationOptions } from "../../../components";
import { sxCenterColumnFlex, sxCenterRowFlex } from "../../../css/css_type";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ImagePreview = ({ file, sx }: { file: File; sx?: SxProps }) => {
  const [imageUrl, setImageUrl] = useState<string>();
  // Handle image URL creation and cleanup
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <ImageListItem
      sx={{
        ...sx,
      }}
    >
      <img src={imageUrl} alt="Preview" />
    </ImageListItem>
  );
};

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
  const [message, setMessage] = useState("");
  const {
    file,
    setFile,
    progressUpload,
    downloadFileURL,
    handleUploadFile,
    fileDestination,
    setFileDestination,
  } = useUploadFile();
  const [isLoadMoreMsg, setIsLoadMoreMsg] = useState(false);
  const lastMessageRef = useRef<any>(null);

  const {
    newMessage,
    setNewMessage,
    messages,
    setMessages,
    latestMessage,
    setLatestMessage,
    conversations,
    setConversations,
  } = useMessage();

  const { handleToggleDrawer, open } = useDrawerState();

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

  /** Conversation Options */
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openEmoji = Boolean(anchorEl);
  const handleClickEmoji = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseEmoji = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (id) {
      setMessage("");
      setLoadingImage(true);
      const fetch = async () => {
        try {
          const result = await getConversationByID(id);
          setConversation(result.data);
        } catch (error) {}
      };
      if (!conversation) {
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

  const handleSendMessage = async () => {
    let messageType = "text";
    let resultUpload = null;
    if (file) {
      try {
        resultUpload = await handleUploadFile();
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
      setMessage("");
      setFile(null);
      setLatestMessage(result.data);
      setNewMessage(result.data);
      setMessages((prev: any) => [...prev, result.data]);
      moveToLastMessage();
    });
  };

  const handleEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setMessage(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setFileDestination(`conversation/${id}/${event.target.files[0].name}`);
      setMessage("");
    }
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
          <Box
            sx={{
              width: "fit-content",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {conversation && (
              <AvatarOnline
                srcImage={conversation?.picture}
                title={conversation?.title}
                isOnline={isOnline}
              />
            )}
            <ListItemText
              sx={{
                marginLeft: "10px",
              }}
              primary={conversation?.title}
              secondary={isOnline ? "Online" : "Offline"}
            />
          </Box>
          <Box>
            <Tooltip title="Add Friend">
              <IconButton>
                <PersonAddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Call">
              <IconButton>
                <CallIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Video Call">
              <IconButton>
                <VideoCameraFrontIcon />
              </IconButton>
            </Tooltip>
            {open ? (
              <Tooltip title="Close Conversation Information">
                <IconButton onClick={handleToggleDrawer}>
                  <ViewSidebarOutlinedIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Open Conversation Information">
                <IconButton onClick={handleToggleDrawer}>
                  <ViewSidebarIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
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
          <Container sx={{ height: "wrap-content" }}>
            <FormControl fullWidth sx={{ height: "wrap-content" }}>
              <Paper
                component="form"
                elevation={5}
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  return handleSendMessage();
                }}
              >
                {/* CHOOSE FILE BUTTON */}
                <Tooltip title="Attach File">
                  <Button role={undefined} component="label">
                    <AttachFile />
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*, .doc, .docx, .pdf"
                      onChange={handleFileChange}
                    />
                  </Button>
                </Tooltip>

                {/* INPUT MESSAGE */}

                {/* PREVIEW FILE / IMAGE */}
                {file && (
                  <Box sx={{ ml: 1, flex: 1 }}>
                    <Box sx={{ ...sxCenterRowFlex }}>
                      {file.type.startsWith("image") ? (
                        <ImagePreview
                          sx={{
                            maxWidth: "7%",
                            maxHeight: "10%",
                            objectFit: "cover",
                          }}
                          file={file}
                        />
                      ) : (
                        <Chip
                          icon={<InsertDriveFileIcon />}
                          label={file.name}
                          variant="outlined"
                        />
                      )}

                      <IconButton
                        aria-label="delete"
                        onClick={() => setFile(null)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}

                {/* TEXT INPUT */}
                {!file && (
                  <InputBase
                    autoFocus
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Aa"
                    value={message}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    multiline
                    maxRows={3}
                  />
                )}

                {/* UPLOAD PROGRESS */}
                {progressUpload && (
                  <CircularProgressWithLabel value={progressUpload} />
                )}
                {/* EMOJI BUTTON */}
                <Menu
                  id="basic-menu"
                  open={openEmoji}
                  anchorEl={anchorEl}
                  onClose={handleCloseEmoji}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </Menu>
                <Tooltip title="Emoji">
                  <IconButton
                    id="basic-button"
                    aria-controls={openEmoji ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openEmoji ? "true" : undefined}
                    onClick={handleClickEmoji}
                  >
                    <EmojiEmotionsOutlinedIcon />
                  </IconButton>
                </Tooltip>
                {/* SEND MESSAGE BUTTON */}
                <Tooltip title="Send Message">
                  <IconButton
                    type="submit"
                    sx={{ p: "10px" }}
                    aria-label="send"
                  >
                    <Send />
                  </IconButton>
                </Tooltip>
              </Paper>
            </FormControl>
          </Container>
        </Grid>
      </Grid>

      {open && (
        <ConversationOptions
          open={open}
          conversation={conversation}
          isOnline={isOnline}
          id={id}
          handleOpenPreviewImageDialog={handleOpenPreviewImageDialog}
        />
      )}
    </Grid>
  );
}

export default Conversation;
