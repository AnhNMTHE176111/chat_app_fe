import {
  Avatar,
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  List,
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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { FC, useEffect, useState } from "react";
import { sxCenterColumnFlex, sxCenterRowFlex } from "../../css/css_type";
import { saveAs } from "file-saver";

import {
  getAllFilesConversation,
  getAllMediasConversation,
} from "../../services";
import { useMessage } from "../../hooks";
import { MESSAGE_TYPE } from "../../constants";

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
  const [openMedia, setOpenMedia] = useState(false);
  const [openFile, setOpenFile] = useState(false);
  const [medias, setMedias] = useState<any[]>();
  const [files, setFiles] = useState<any[]>();
  const { newMessage } = useMessage();

  useEffect(() => {
    if (!newMessage) {
      return;
    }
    if (newMessage.conversation_id == id) {
      if (newMessage.messageType == MESSAGE_TYPE.FILE) {
        setFiles((prev: any) => [...prev, newMessage]);
      }
      if (newMessage.messageType == MESSAGE_TYPE.IMAGE) {
        setMedias((prev: any) => [...prev, newMessage]);
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

  return (
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
                <ImageList sx={{ width: "100%" }} cols={3} variant="quilted">
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
  );
};

export default ConversationOptions;
