import styled from "@emotion/styled";
import { AttachFile, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  IconButton,
  InputBase,
  Menu,
  Paper,
  Tooltip,
} from "@mui/material";
import React, { FC, useEffect, useRef, useState } from "react";
import ImagePreview from "./ImagePreview";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { CircularProgressWithLabel } from "../Common";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useUploadFile } from "../../hooks";
import { sxCenterRowFlex } from "../../css/css_type";

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

interface InputMessageProps {
  conversationId: string | undefined;
  handleSendMessage: (
    message: string,
    file: File | null,
    fileDestination: string
  ) => Promise<void>;
  progressUpload: number | null;
}

export const InputMessage: FC<InputMessageProps> = ({
  conversationId,
  handleSendMessage,
  progressUpload,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileDestination, setFileDestination] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openEmoji = Boolean(anchorEl);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMessage("");
    inputRef.current?.focus();
  }, [conversationId]);

  const handleClickEmoji = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseEmoji = () => {
    setAnchorEl(null);
  };

  const handleEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setMessage(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setFileDestination(
        `conversation/${conversationId}/${event.target.files[0].name}`
      );
      setMessage("");
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSubmit(event);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (message != "" || file != null) {
      e.preventDefault();
      handleSendMessage(message, file, fileDestination).then(() => {
        setMessage("");
        setFile(null);
        setFileDestination("");
      });
    }
  };

  return (
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
          onSubmit={(e) => handleSubmit(e)}
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

                <IconButton aria-label="delete" onClick={() => setFile(null)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          )}

          {/* TEXT INPUT */}
          {!file && (
            <InputBase
              inputRef={inputRef}
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
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="send">
              <Send />
            </IconButton>
          </Tooltip>
        </Paper>
      </FormControl>
    </Container>
  );
};

export default InputMessage;
