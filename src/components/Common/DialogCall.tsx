import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React, { FC } from "react";
import { AvatarOnline } from "../HomeForm";
import CallEndIcon from "@mui/icons-material/CallEnd";
import CallIcon from "@mui/icons-material/Call";
import { sxCenterColumnFlex, sxCenterRowFlex } from "../../css/css_type";

interface DialogCallProps {
  isCalling: boolean;
  conversation: any;
  handleRecieve: () => void;
  handleReject: () => void;
}

export const DialogCall: FC<DialogCallProps> = ({
  isCalling,
  conversation,
  handleRecieve,
  handleReject,
}) => {
  return (
    <React.Fragment>
      <Dialog
        open={isCalling}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" textAlign={"center"}>
          <Typography align="center" variant="inherit">
            {conversation?.title}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ ...sxCenterColumnFlex }}>
          <AvatarOnline
            isOnline={false}
            srcImage={conversation?.picture}
            title={conversation?.title}
          />
        </DialogContent>
        <DialogActions sx={{ ...sxCenterRowFlex, justifyContent: "center" }}>
          <IconButton size="large" onClick={handleReject} color="error">
            <CallEndIcon fontSize="large" />
          </IconButton>
          <IconButton size="large" onClick={handleRecieve} color="success">
            <CallIcon fontSize="large" />
          </IconButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DialogCall;
