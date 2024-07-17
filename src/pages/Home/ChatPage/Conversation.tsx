import {
  Alert,
  AlertColor,
  AlertPropsColorOverrides,
  Button,
  Container,
  Grid,
  IconButton,
  ListItemText,
  Snackbar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FC, useEffect, useRef, useState } from "react";
import {
  addFriendRequest,
  addFriendToConversation,
  changeFriendStatus,
  getConversationByID,
  getFriendById,
  getMessagesConversation,
  sendMessage,
} from "../../../services";
import {
  DialogViewImage,
  HeaderConversation,
  ConversationOptions,
  InputMessage,
  MessagesList,
  AddFriendToConversationDialog,
} from "../../../components";
import {
  useAppDispatch,
  useAuth,
  useDrawerState,
  useMessage,
  useSocket,
  useUploadFile,
} from "../../../hooks";
import {
  FRIEND_STATUS,
  GROUP_CONVERSATION,
  MESSAGE_TYPE,
  SOCKET_EVENT,
} from "../../../constants";
import ClearIcon from "@mui/icons-material/Clear";
import { ChatContainerProps } from "../../../providers";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { showNotificationAction } from "../../../stores/notificationActionSlice";
import { OverridableStringUnion } from "@mui/types";

export const Conversation: FC<ChatContainerProps> = ({
  conversations,
  messages,
  setConversations,
  setLatestMessage,
  setMessages,
  setNewMessage,
  onClick,
}) => {
  const { user } = useAuth();
  const { id } = useParams<string>();
  const { onlineUsers, socket } = useSocket();
  const { handleUploadFile, progressUpload } = useUploadFile();
  const { open, handleToggleDrawer } = useDrawerState();
  const location = useLocation();
  const dispatchNoti = useAppDispatch();

  const [conversation, setConversation] = useState(
    location.state?.conversation || null
  );
  const [isOnline, setIsOnline] = useState<boolean>(
    conversation?.online ? conversation?.online : false
  );
  const [statusFriendReceiverId, setStatusFriendReceiverId] =
    useState<string>("");
  const [receiverId, setReceiverId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [receiver, setReceiver] = useState();
  const lastMessageRef = useRef<any>(null);
  const [threadMessage, setThreadMessage] = useState<any>();
  /** Preview Image */
  const [openPreviewImage, setOpenPreviewImage] = useState<boolean>(false);
  const [previewImageLink, setPreviewImageLink] = useState<string>("");
  // Add Friend Dialog State
  const [openAddFriendDialog, setOpenAddFriendDialog] = useState(false);
  const navigate = useNavigate();
  const [isNewRequest, setIsNewRequest] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [openNoti, setOpenNoti] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");
  const [severityNoti, setSeverityNoti] =
    useState<OverridableStringUnion<AlertColor, AlertPropsColorOverrides>>(
      "success"
    );

  useEffect(() => {
    if (id) {
      setThreadMessage(null);
      setIsLoading(true);
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
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
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
    if (conversation && user) {
      if (conversation.type === GROUP_CONVERSATION) {
        return;
      }
      const friendId =
        conversation.participants[0]._id === user.id
          ? conversation.participants[1]._id
          : conversation.participants[0]._id;
      setReceiverId(friendId);
      getFriendById(friendId)
        .then((res) => {
          if (res.success) {
            const friend: any = res.data;
            setStatusFriendReceiverId(friend.status || "");
          }
        })
        .catch((err) => {
          console.log(err);
          setStatusFriendReceiverId("");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [conversation]);

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
      thread: threadMessage?.message._id,
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
      setThreadMessage(null);
      setConversations(updatedConversations);
      setLatestMessage(result.data);
      setNewMessage(result.data);
      setMessages((prev: any) => [...prev, result.data]);
    });
  };

  useEffect(() => {
    const handleReceiveReact = (data: any) => {
      const copyMessages = [...messages];
      const index = copyMessages.findIndex((message) => {
        return message._id == data.message._id;
      });
      copyMessages[index] = { ...copyMessages[index], ...data.message };
      setMessages(copyMessages);
    };

    socket?.on(SOCKET_EVENT.REACT_MESSAGE, handleReceiveReact);

    socket?.on("friendStatusChanged", (userId: string) => {
      if (userId !== user?.id) {
        setOpenNoti(true);
        setIsNewRequest(true);
        setNotiMessage(`New friend request`);
        setSeverityNoti("info");
      }
    });

    return () => {
      socket?.off("friendStatusChanged");
      socket?.off(SOCKET_EVENT.REACT_MESSAGE, handleReceiveReact);
    };
  }, [socket, messages]);

  const handleClosePreviewImageDialog = () => {
    setOpenPreviewImage(false);
  };
  const handleOpenPreviewImageDialog = (imageLink: string) => {
    setOpenPreviewImage(true);
    setPreviewImageLink(imageLink);
  };

  const handleCloseAddFriendDialog = () => {
    setOpenAddFriendDialog(false);
  };

  const handleAddFriend = () => {
    if (user?.id) {
      if (conversation?.type === GROUP_CONVERSATION) {
        setOpenAddFriendDialog(true);
      } else {
        if (statusFriendReceiverId == FRIEND_STATUS.PENDING) {
          changeFriendStatus(user.id, {
            friendId: receiverId,
            status: FRIEND_STATUS.REJECT,
          })
            .then((res) => {
              if (res.success) {
                setStatusFriendReceiverId(FRIEND_STATUS.REJECT);
                setOpenNoti(true);
                setIsNewRequest(false);
                setNotiMessage("Delete Invitation successfully");
                setSeverityNoti("success");
              }
            })
            .catch((err) => {
              setOpenNoti(true);
              setIsNewRequest(false);
              setNotiMessage(err?.message?.data?.message || "Something wrong");
              setSeverityNoti("error");
            });
        }
        if (statusFriendReceiverId == FRIEND_STATUS.REJECT) {
          addFriendRequest(user.id, {
            friendId: receiverId,
          })
            .then((res) => {
              if (res.success) {
                setStatusFriendReceiverId(FRIEND_STATUS.PENDING);
                setOpenNoti(true);
                setIsNewRequest(false);
                setNotiMessage("Request sent successfully");
                setSeverityNoti("success");
              }
            })
            .catch((err) => {
              setOpenNoti(true);
              setIsNewRequest(false);
              setNotiMessage(err?.message?.data?.message || "Something wrong");
              setSeverityNoti("error");
            });
        }
      }
    }
  };

  const handleCloseNoti = () => {
    setOpenNoti(false);
  };
  const handleAddFriendToConversation = (ListFriend: string[]) => {
    addFriendToConversation(conversation._id, ListFriend)
      .then((res) => {
        if (res.success) {
          setOpenNoti(true);
          setNotiMessage("Add friend successfully");
          setSeverityNoti("success");
        }
      })
      .catch((err) => {
        setOpenNoti(true);
        setNotiMessage("Something wrong");
        setSeverityNoti("error");
      });
  };

  const handleNavigateToNewRequest = () => {
    navigate("/contacts", {
      state: {
        newRequest: true,
      },
    });
  };

  return (
    <Grid container sx={{ height: "100%" }}>
      <DialogViewImage
        open={openPreviewImage}
        onClose={handleClosePreviewImageDialog}
        image={previewImageLink}
      />
      {!isSmallScreen && (
        <>
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
                height: "8%",
                alignItems: "center",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "space-between",
                padding: "0 10px",
              }}
            >
              <HeaderConversation
                conversation={conversation}
                isOnline={isOnline}
                statusFriendReceiverId={statusFriendReceiverId}
                open={open}
                handleAddFriend={handleAddFriend}
                // handleCall={handleCall}
                // handleVideoCall={handleVideoCall}
                handleToggleDrawer={handleToggleDrawer}
                onClick={onClick}
              />
            </Grid>

            {/* MESSAGE CONTAINER */}
            <Grid
              item
              xs={12}
              sx={{
                height: threadMessage ? "75%" : "82%",
              }}
            >
              <MessagesList
                conversation={conversation}
                messages={messages}
                setMessages={setMessages}
                isLoading={isLoading}
                handleOpenPreviewImageDialog={handleOpenPreviewImageDialog}
                lastMessageRef={lastMessageRef}
                setThreadMessage={setThreadMessage}
                receiver={receiver}
              />
            </Grid>

            {/* INPUT MESSAGE */}
            <Grid
              container
              item
              xs={12}
              sx={{
                minHeight: threadMessage ? "15%" : "10%",
                height: "auto",
                boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {threadMessage && (
                <Container
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <ListItemText
                    primary={threadMessage.replyTo}
                    secondary={threadMessage.content}
                  />
                  <IconButton
                    aria-label="delete"
                    size="large"
                    onClick={() => setThreadMessage(null)}
                  >
                    <ClearIcon />
                  </IconButton>
                </Container>
              )}
              <InputMessage
                conversationId={id}
                handleSendMessage={handleSendMessage}
                progressUpload={progressUpload}
                threadMessage={threadMessage}
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
        </>
      )}

      {isSmallScreen && (
        <>
          {!open && (
            <Grid
              item
              xs={12}
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
                  height: "8%",
                  alignItems: "center",
                  backgroundColor: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 10px",
                }}
              >
                <HeaderConversation
                  conversation={conversation}
                  isOnline={isOnline}
                  statusFriendReceiverId={statusFriendReceiverId}
                  open={open}
                  handleAddFriend={handleAddFriend}
                  // handleCall={handleCall}
                  // handleVideoCall={handleVideoCall}
                  handleToggleDrawer={handleToggleDrawer}
                  onClick={onClick}
                />
              </Grid>

              {/* MESSAGE CONTAINER */}
              <Grid
                item
                xs={12}
                sx={{
                  height: threadMessage ? "75%" : "82%",
                }}
              >
                <MessagesList
                  conversation={conversation}
                  messages={messages}
                  setMessages={setMessages}
                  isLoading={isLoading}
                  handleOpenPreviewImageDialog={handleOpenPreviewImageDialog}
                  lastMessageRef={lastMessageRef}
                  setThreadMessage={setThreadMessage}
                  receiver={receiver}
                />
              </Grid>

              {/* INPUT MESSAGE */}
              <Grid
                container
                item
                xs={12}
                sx={{
                  minHeight: threadMessage ? "15%" : "10%",
                  height: "auto",
                  boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {threadMessage && (
                  <Container
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListItemText
                      primary={threadMessage.replyTo}
                      secondary={threadMessage.content}
                    />
                    <IconButton
                      aria-label="delete"
                      size="large"
                      onClick={() => setThreadMessage(null)}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Container>
                )}
                <InputMessage
                  conversationId={id}
                  handleSendMessage={handleSendMessage}
                  progressUpload={progressUpload}
                  threadMessage={threadMessage}
                />
              </Grid>
            </Grid>
          )}

          {open && (
            <Grid
              container
              item
              xs={12}
              sx={{
                height: "100%",
              }}
            >
              <ConversationOptions
                handleToggleDrawer={handleToggleDrawer}
                open={open}
                conversation={conversation}
                isOnline={isOnline}
                id={id}
                handleOpenPreviewImageDialog={handleOpenPreviewImageDialog}
              />
            </Grid>
          )}
        </>
      )}

      <Snackbar
        open={openNoti}
        autoHideDuration={6000}
        onClose={handleCloseNoti}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseNoti} severity={severityNoti}>
          {notiMessage}{" "}
          {isNewRequest && (
            <Button
              color="secondary"
              size="small"
              onClick={handleNavigateToNewRequest}
            >
              View New Request
            </Button>
          )}
        </Alert>
      </Snackbar>

      {openAddFriendDialog && (
        <AddFriendToConversationDialog
          dialogOpen={openAddFriendDialog}
          conversation={conversation}
          onCloseDialog={handleCloseAddFriendDialog}
          handleAddFriendToConversation={handleAddFriendToConversation}
        />
      )}
    </Grid>
  );
};

export default Conversation;
