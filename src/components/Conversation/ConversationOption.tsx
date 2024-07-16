import React, { FC, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Container,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { AvatarOnline } from "../HomeForm";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { sxCenterColumnFlex, sxCenterRowFlex } from "../../css/css_type";
import { saveAs } from "file-saver";
import {
  getAllFilesConversation,
  getAllMediasConversation,
  getMemberInConversation,
  MemberListParams,
  // updateMemberRole,
  // kickMemberFromConversation,
} from "../../services";
import { useAuth, useMessage } from "../../hooks";
import { GROUP_CONVERSATION, MESSAGE_TYPE } from "../../constants";
import CreateGroupDialog from "./CreateGroupDialog";
import MemberListDialog from "./MemberListDialog";
import { Group } from "@mui/icons-material";

interface ConversationOptionsProps {
  open: boolean;
  conversation: any;
  isOnline: boolean;
  id: string | undefined;
  handleOpenPreviewImageDialog: (imageLink: string) => void;
}

export const ConversationOptions: FC<ConversationOptionsProps> = ({
  open,
  conversation,
  isOnline,
  id,
  handleOpenPreviewImageDialog,
}) => {
  const { user } = useAuth();
  const [openMedia, setOpenMedia] = useState(false);
  const [openFile, setOpenFile] = useState(false);
  const [medias, setMedias] = useState<any[]>();
  const [files, setFiles] = useState<any[]>();
  const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);
  const [openMemberListDialog, setOpenMemberListDialog] = useState(false);
  const [members, setMembers] = useState<MemberListParams>({
    memberList: [],
    admin: [],
    conversationId: "",
  });
  const { newMessage } = useMessage();

  useEffect(() => {
    if (!newMessage) {
      return;
    }
    if (newMessage.conversation_id === id) {
      if (newMessage.messageType === MESSAGE_TYPE.FILE) {
        setFiles((prev: any) => (prev ? [...prev, newMessage] : [newMessage]));
      }
      if (newMessage.messageType === MESSAGE_TYPE.IMAGE) {
        setMedias((prev: any) => (prev ? [...prev, newMessage] : [newMessage]));
      }
    }
  }, [newMessage]);

  useEffect(() => {
    handleBackToConversationInforTab();
  }, [id]);

  const handleBackToConversationInforTab = () => {
    setOpenMedia(false);
    setOpenFile(false);
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

  const handleShowMembers = () => {
    getMemberInConversation(conversation?._id)
      .then((res) => {
        setMembers(res.data);
        setOpenMemberListDialog(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleResetMembers = () => {
    if (id) {
      getMemberInConversation(id)
        .then((res) => {
          setMembers(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleCreateGroup = () => {
    setOpenCreateGroupDialog(true);
  };

  const [errorImage, setErrorImage] = useState<any[]>();

  const handleErrorImage = (imageId: any) => {
    setErrorImage((prev: any) => {
      if (!prev) {
        return [imageId];
      }
      return [...prev, imageId];
    });
  };

  return (
    <React.Fragment>
      {!openMedia && !openFile && (
        <Container
          maxWidth="sm"
          sx={{
            height: "100%",
            ...sxCenterColumnFlex,
          }}
        >
          <Box sx={{ ...sxCenterColumnFlex, my: 2, width: "100%" }}>
            {conversation && (
              <AvatarOnline
                srcImage={conversation?.picture}
                title={conversation?.title}
                isOnline={isOnline}
                sx={{
                  width: 100,
                  height: 100,
                }}
              />
            )}

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
              <Tooltip
                title={`Create Group With ${conversation.title}`}
                onClick={handleCreateGroup}
                sx={{
                  display: conversation.type === "group" ? "none" : "",
                }}
              >
                <IconButton>
                  <GroupAddIcon fontSize="large" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={"Members"}
                onClick={handleShowMembers}
                sx={{
                  display: conversation.type === "group" ? "" : "none",
                }}
              >
                <IconButton>
                  <Group fontSize="large" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ width: "100%" }}>
              <List>
                <Divider />
                <Paper elevation={0}>
                  <ListItemButton
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
            <Box sx={{ width: "100%" }}>
              <Typography>
                {conversation.type == GROUP_CONVERSATION
                  ? "Group Members"
                  : "Members"}
              </Typography>
              <List>
                {conversation.participants.map((item: any, index: any) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <AvatarOnline
                        srcImage={item.avatar}
                        isOnline={false}
                        title={item.fullName}
                      />
                    </ListItemAvatar>
                    <ListItemText primary={item.fullName} />
                  </ListItem>
                ))}
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
                <ImageList sx={{ width: "100%" }} cols={3} variant="quilted">
                  {medias.map((item) => (
                    <ImageListItem key={item._id}>
                      <img
                        srcSet={`${
                          errorImage?.includes(item._id)
                            ? "/default_error.png"
                            : item.attachmentLink
                        }?w=480`}
                        src={`${
                          errorImage?.includes(item._id)
                            ? "/default_error.png"
                            : item.attachmentLink
                        }?w=480`}
                        alt={item.attachmentName}
                        loading="lazy"
                        onClick={() => {
                          if (!errorImage?.includes(item._id)) {
                            handleOpenPreviewImageDialog(item.attachmentLink);
                          }
                        }}
                        onError={() => handleErrorImage(item._id)}
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
      <CreateGroupDialog
        open={openCreateGroupDialog}
        onClose={() => setOpenCreateGroupDialog(false)}
        conversation={conversation}
      />
      <MemberListDialog
        open={openMemberListDialog}
        onClose={() => setOpenMemberListDialog(false)}
        members={members}
        userId={user?.id || ""}
        resetMembers={handleResetMembers}
      />
    </React.Fragment>
  );
};

export default ConversationOptions;
