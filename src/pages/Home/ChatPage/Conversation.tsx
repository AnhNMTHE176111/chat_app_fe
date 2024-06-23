import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
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
import React, { useEffect, useRef, useState } from "react";
import {
  getMessagesConversation,
  loadMoreMessageConversation,
  sendMessage,
} from "../../../services";
import { AvatarOnline } from "../../../components";
import { useAuth, useDrawerState, useMessage, useSocket } from "../../../hooks";
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
import { SOCKET_EVENT } from "../../../constants";
import InfiniteScroll from "react-infinite-scroll-component";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

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
  const [receiver, setReceiver] = useState();
  const [message, setMessage] = useState("");
  const [isLoadMoreMsg, setIsLoadMoreMsg] = useState(false);
  const lastMessageRef = useRef<HTMLElement>(null);
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

  /** Conversation Options */
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openEmoji = Boolean(anchorEl);
  const handleClickEmoji = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseEmoji = () => {
    setAnchorEl(null);
  };

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
      getMessagesConversation(id).then((data: any) => {
        setMessages(data.data);
      });
    }
  }, [id]);

  const handleSendMessage = () => {
    sendMessage(conversation?._id, {
      content: message,
      receiver: receiver,
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
    if (!isLoadMoreMsg) {
      lastMessageRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, isLoadMoreMsg]);

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
    setOpenMedia(!openMedia);
  };

  const handleOpenFile = () => {
    setOpenFile(!openFile);
  };

  const handleBackToConversationInforTab = () => {
    setOpenMedia(false);
    setOpenFile(false);
  };

  return (
    <Grid container sx={{ height: "100%" }}>
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
                        maxWidth: "50%",
                        padding: "8px 12px",
                        wordWrap: "break-word",
                      }}
                    >
                      <Tooltip title={fullTime}>
                        <ListItemText
                          ref={
                            index === messages.length - 1
                              ? lastMessageRef
                              : null
                          }
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
                    </Box>
                  </ListItem>
                );
              })}
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
                    />
                  </Button>
                </Tooltip>
                {/* INPUT MESSAGE */}
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Aa"
                  value={message}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  multiline
                  maxRows={3}
                />
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
                    <Paper elevation={1}>
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
                    <Paper elevation={1}>
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
                    Medias Tab
                  </Typography>
                  <Box></Box>
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
                  <Box></Box>
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
