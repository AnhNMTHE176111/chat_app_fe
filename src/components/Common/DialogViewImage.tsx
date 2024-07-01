import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Skeleton,
} from "@mui/material";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent style={{ textAlign: "center", padding: 5 }}>
        {loading && (
          <Skeleton
            variant="rectangular"
            width={"30vw"}
            height={"30vh"}
            style={{ marginBottom: -4 }}
          />
        )}
        {!error && (
          <img
            src={image}
            alt="Dialog content"
            style={{
              display: loading ? "none" : "block",
              width: "100%",
              minWidth: "20vw",
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        {error && (
          <div style={{ width: "100%", padding: 20, textAlign: "center" }}>
            <p>Error loading image</p>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
