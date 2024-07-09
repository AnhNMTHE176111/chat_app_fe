import { Container, Grid, IconButton, ListItemText } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { FC, useEffect, useRef, useState } from "react";
import {
  getConversationByID,
  getMessagesConversation,
  sendMessage,
} from "../../../services";
import {
  DialogViewImage,
  HeaderConversation,
  ConversationOptions,
  InputMessage,
  MessagesList,
} from "../../../components";
import {
  useAuth,
  useDrawerState,
  useMessage,
  useSocket,
  useUploadFile,
} from "../../../hooks";
import { MESSAGE_TYPE, SOCKET_EVENT } from "../../../constants";
import ClearIcon from "@mui/icons-material/Clear";
import { ChatContainerProps } from "../../../providers";

export const Conversation: FC<ChatContainerProps> = ({
  conversations,
  messages,
  setConversations,
  setLatestMessage,
  setMessages,
  setNewMessage,
}) => {
  const { user } = useAuth();
  const { id } = useParams<string>();
  const { onlineUsers, socket } = useSocket();
  const { handleUploadFile, progressUpload } = useUploadFile();
  const { open, handleToggleDrawer } = useDrawerState();
  const location = useLocation();

  const [conversation, setConversation] = useState(
    location.state?.conversation || null
  );
  const [isOnline, setIsOnline] = useState<boolean>(
    conversation?.online ? conversation?.online : false
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [receiver, setReceiver] = useState();
  const lastMessageRef = useRef<any>(null);
  const [threadMessage, setThreadMessage] = useState<any>();
  /** Preview Image */
  const [openPreviewImage, setOpenPreviewImage] = useState<boolean>(false);
  const [previewImageLink, setPreviewImageLink] = useState<string>("");

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

  const handleClosePreviewImageDialog = () => {
    setOpenPreviewImage(false);
  };
  const handleOpenPreviewImageDialog = (imageLink: string) => {
    setOpenPreviewImage(true);
    setPreviewImageLink(imageLink);
  };

  /** Infinite Scroll */
  // const observer = useRef<any>();
  // const [isLoadMoreMsg, setIsLoadMoreMsg] = useState(false);
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
  // const loadMoreData = () => {
  //   if (id) {
  //     setIsLoading(true);
  //     setIsLoadMoreMsg(true);
  //     return loadMoreMessageConversation(id, messages[0].createdAt)
  //       .then((result: any) => {
  //         setMessages((prev: any) => [...result.data, ...prev]);
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //       })
  //       .finally(() => {
  //         setIsLoading(false);
  //       });
  //   }
  // };

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
            open={open}
            handleToggleDrawer={handleToggleDrawer}
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
    </Grid>
  );
};

export default Conversation;
