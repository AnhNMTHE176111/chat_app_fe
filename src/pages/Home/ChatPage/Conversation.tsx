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
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { MESSAGE_TYPE, SOCKET_EVENT } from "../../../constants";
import InfiniteScroll from "react-infinite-scroll-component";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import * as _ from "lodash";
import { saveAs } from "file-saver";

const sxCenterColumnFlex: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignContent: "center",
  alignItems: "center",
};

const sxCenterRowFlex: SxProps = {
  display: "flex",
  alignContent: "center",
  alignItems: "center",
};

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
  const { conversation } = location.state || {};
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

  /** Tab Option Conversation */
  const [openMedia, setOpenMedia] = useState(false);
  const [openFile, setOpenFile] = useState(false);
  const [medias, setMedias] = useState<any[]>();
  const [files, setFiles] = useState<any[]>();

  useEffect(() => {
    const onlineUsersInConversation = conversation?.participants.filter(
      (participant: any) =>
        participant._id.toString() !== user?.id &&
        onlineUsers.includes(participant._id.toString())
    );
    setReceiver(onlineUsersInConversation);
    if (onlineUsersInConversation) {
      setIsOnline(onlineUsersInConversation.length > 0);
    }
  }, [id, onlineUsers]);

  useEffect(() => {
    if (id) {
      handleBackToConversationInforTab();
      setMessage("");
      setLoadingImage(true);
      getMessagesConversation(id).then((data: any) => {
        setMessages(data.data);
      });
    }
  }, [id]);

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
      if (messageType == MESSAGE_TYPE.FILE) {
        setFiles((prev: any) => [...prev, result.data]);
      }
      if (messageType == MESSAGE_TYPE.IMAGE) {
        setMedias((prev: any) => [...prev, result.data]);
      }
      setFile(null);
      setLatestMessage(result.data);
      setNewMessage(result.data);
      setMessages((prev: any) => [...prev, result.data]);
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
      // handleUploadFile();
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

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

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

  const handleOpenMedia = () => {
    if (id) {
      setOpenMedia(true);
      getAllMediasConversation(id).then((result) => {
        setMedias(result.data);
      });
    }
  };

  const handleOpenFile = () => {
    if (id) {
      setOpenFile(true);
      getAllFilesConversation(id).then((result) => {
        setFiles(result.data);
      });
    }
  };

  const handleBackToConversationInforTab = () => {
    setOpenMedia(false);
    setOpenFile(false);
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
            <AvatarOnline
              srcImage={conversation?.picture}
              title={conversation?.title}
              isOnline={isOnline}
            />
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
                      ref={lastMessageRef}
                    >
                      {message.messageType === MESSAGE_TYPE.IMAGE && (
                        <Tooltip title={fullTime} placement="left-start">
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
                        </Tooltip>
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
                        <Tooltip title={fullTime} placement="left-start">
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
                        </Tooltip>
                      )}
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
        <Grid
          container
          item
          xs={open ? 4 : 0}
          sx={{
            height: "100%",
          }}
        >
          {!openMedia && !openFile && (
            <Container
              maxWidth="sm"
              sx={{
                height: "100%",
                ...sxCenterColumnFlex,
              }}
            >
              <Box sx={{ ...sxCenterColumnFlex, my: 2, width: "100%" }}>
                <AvatarOnline
                  srcImage={conversation?.picture}
                  title={conversation?.title}
                  isOnline={isOnline}
                  sx={{
                    width: 100,
                    height: 100,
                  }}
                />
                <Typography textAlign={"center"} variant="h6">
                  {conversation?.title}
                </Typography>
                <Typography
                  textAlign={"center"}
                  color={isOnline ? "green" : "gray"}
                  variant="subtitle1"
                >
                  {isOnline ? "Online" : "Offline"}
                </Typography>

                <Box sx={{ my: 1 }}>
                  <Tooltip title="Add Friend">
                    <IconButton>
                      <PersonAddIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Search Message">
                    <IconButton>
                      <SearchIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Notification">
                    <IconButton>
                      <NotificationsIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`Create Group With ${conversation.title}`}>
                    <IconButton>
                      <GroupAddIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ width: "100%" }}>
                  <List>
                    <Divider />
                    <Paper elevation={0}>
                      <ListItemButton
                        // selected={selectedIndex === 0}
                        onClick={handleOpenMedia}
                        sx={{
                          borderRadius: "5px",
                          my: 2,
                        }}
                      >
                        <ListItemIcon>
                          <ImageIcon />
                        </ListItemIcon>
                        <ListItemText primary="Images / Videos" />
                      </ListItemButton>
                    </Paper>
                    <Paper elevation={0}>
                      <ListItemButton
                        // selected={selectedIndex === 1}
                        onClick={handleOpenFile}
                        sx={{
                          borderRadius: "5px",
                          my: 2,
                        }}
                      >
                        <ListItemIcon>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="Files" />
                      </ListItemButton>
                    </Paper>
                    <Divider />
                  </List>
                </Box>
              </Box>
            </Container>
          )}

          {openMedia && (
            <Container
              maxWidth="sm"
              sx={{
                height: "100%",
                ...sxCenterColumnFlex,
              }}
            >
              <Box sx={{ ...sxCenterColumnFlex, my: 3, width: "100%" }}>
                <Box
                  sx={{
                    ...sxCenterRowFlex,
                    justifyContent: "left",
                    width: "100%",
                    gap: "20px",
                  }}
                >
                  <IconButton onClick={handleBackToConversationInforTab}>
                    <ArrowBackIosNewOutlinedIcon />
                  </IconButton>
                  <Typography variant="h5" justifyContent={"center"}>
                    Media Tab
                  </Typography>
                </Box>

                <Divider sx={{ width: "100%", my: 1 }} variant="middle" />
                <Box>
                  {medias && (
                    <ImageList
                      sx={{ width: "100%" }}
                      cols={3}
                      variant="quilted"
                    >
                      {medias.map((item) => (
                        <ImageListItem key={item._id}>
                          <img
                            srcSet={`${item.attachmentLink}?w=480`}
                            src={`${item.attachmentLink}?w=480`}
                            alt={item.attachmentName}
                            loading="lazy"
                            onClick={() =>
                              handleOpenPreviewImageDialog(item.attachmentLink)
                            }
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  )}
                </Box>
              </Box>
            </Container>
          )}

          {openFile && (
            <Container
              maxWidth="sm"
              sx={{
                height: "100%",
                ...sxCenterColumnFlex,
              }}
            >
              <Box sx={{ ...sxCenterColumnFlex, my: 3, width: "100%" }}>
                <Box
                  sx={{
                    ...sxCenterRowFlex,
                    justifyContent: "left",
                    width: "100%",
                    gap: "20px",
                  }}
                >
                  <IconButton onClick={handleBackToConversationInforTab}>
                    <ArrowBackIosNewOutlinedIcon />
                  </IconButton>
                  <Typography variant="h5" justifyContent={"center"}>
                    Files Tab
                  </Typography>
                </Box>
                <Box sx={{ width: "100%" }}>
                  <List>
                    {files &&
                      files.map((item, index) => (
                        <>
                          <ListItemButton
                            key={item._id}
                            sx={{ my: 0.5 }}
                            onClick={() => {
                              saveAs(item.attachmentLink, item.attachmentName);
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar>
                                <DescriptionIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                item.attachmentName.length > 24
                                  ? `${item.attachmentName.slice(0, 24)}...`
                                  : item.attachmentName
                              }
                              secondary={item.attachmentSize}
                            />
                          </ListItemButton>
                          {index !== files.length - 1 && (
                            <Divider variant="middle" />
                          )}
                        </>
                      ))}
                  </List>
                </Box>
              </Box>
            </Container>
          )}
        </Grid>
      )}
    </Grid>
  );
}

export default Conversation;
