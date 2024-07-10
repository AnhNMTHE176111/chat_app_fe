import React from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useController } from "react-hook-form";
import { InputProps } from "../../types";
import { useUploadFile } from "../../hooks";
import { CircularProgressWithLabel } from "../Common";

export const AvatarInput: React.FC<InputProps> = ({ control, name, title }) => {
  const { handleUploadFile, progressUpload, downloadFileURL } = useUploadFile();

  const {
    field: { ...inputProps },
    fieldState: { invalid, error },
  } = useController({
    control,
    name,
    rules: {
      validate: {
        // Example validation rule if needed
        // acceptedFormats: (files) =>
        //   ["image/jpeg", "image/png"].includes(files[0]?.type) ||
        //   "Only PNG, JPEG",
      },
    },
    defaultValue: "",
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const uploadResult = await handleUploadFile(file, "avatars");
      if (uploadResult) {
        inputProps.onChange(uploadResult.url);
      }
    }
  };

  return (
    <Box display="flex" alignItems="center">
      <Typography>{title}: </Typography>
      <Button
        variant="outlined"
        component="label"
        disabled={progressUpload !== null}
      >
        {progressUpload !== null ? (
          <CircularProgressWithLabel value={progressUpload} size={24} />
        ) : (
          <Avatar
            src={downloadFileURL || inputProps.value}
            sx={{ width: 60, height: 60, boxShadow: "initial" }}
          />
        )}
        <input
          type="file"
          accept=".jpg, .png"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </Button>
      {error && <Typography color="error">{error.message}</Typography>}
    </Box>
  );
};

export default AvatarInput;
