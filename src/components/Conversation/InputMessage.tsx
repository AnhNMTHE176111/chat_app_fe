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
import SettingsVoiceIcon from "@mui/icons-material/SettingsVoice";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";

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

const SpeechRecognition =
  window.SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = new SpeechRecognition();

interface InputMessageProps {
  conversationId: string | undefined;
  handleSendMessage: (
    message: string,
    file: File | null,
    fileDestination: string
  ) => Promise<void>;
  progressUpload: number | null;
  threadMessage: any;
}

export const InputMessage: FC<InputMessageProps> = ({
  conversationId,
  handleSendMessage,
  progressUpload,
  threadMessage,
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
  }, [conversationId, threadMessage]);

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
    if (message.trim() != "" || file != null) {
      e.preventDefault();
      handleSendMessage(message.trim(), file, fileDestination).then(() => {
        setMessage("");
        setFile(null);
        setFileDestination("");
      });
    }
  };

  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    recognition.lang = "vi-VN";
    // recognition.lang = "vi-VN" || "ja-JP" || "en-US"; // Đặt ngôn ngữ là tiếng Việt

    // recognition.onstart = () => {
    //   setIsListening(true);
    // };

    let text = "";
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      if (transcript == "Gửi.") {
        console.log(
          "call this 1",
          text,
          file != null,
          message.trim() != "" || file != null
        );
        if (text.trim() != "" || file != null) {
          setIsListening(false);
          handleSendMessage(text.trim(), file, fileDestination).then(() => {
            text = "";
            setMessage("");
            setFile(null);
            setFileDestination("");
          });
        }
      } else {
        text += ` ${transcript}`;
        setMessage((prev) => `${prev} ${transcript}`.trim());
      }
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.abort();
    };
  }, [isListening]);

  const handleListen = () => {
    setIsListening((prevState) => !prevState);
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
          <Tooltip
            title="Voice to text"
            sx={{
              ml: 2,
            }}
          >
            {isListening ? (
              <SettingsVoiceIcon color="primary" onClick={handleListen} />
            ) : (
              <KeyboardVoiceIcon color="primary" onClick={handleListen} />
            )}
          </Tooltip>
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
