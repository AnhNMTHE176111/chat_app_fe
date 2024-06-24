import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React, { useState } from "react";

interface DialogViewImageParams {
  open: boolean;
  onClose: () => void;
  image: string;
}

export const DialogViewImage: React.FC<DialogViewImageParams> = ({
  open,
  onClose,
  image,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <img src={image} style={{ width: "100%", minWidth: "30vw" }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
