import React, { useState } from "react";
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { useController } from "react-hook-form";
import { InputProps } from "../../types";

export const AvatarInput: React.FC<InputProps> = ({
  control,
  name,
  title,
  ...otherProps
}) => {
  const {
    field: { ...inputProps },
    fieldState: { invalid, error },
  } = useController({
    control,
    name,
    rules: {
      validate: {
        // acceptedFormats: (files) =>
        //   ["image/jpeg", "image/png"].includes(files[0]?.type) ||
        //   "Only PNG, JPEG",
      },
    },
    defaultValue: "",
  });

  return (
    <Box display={"flex"} flexDirection={"row"}>
      <TextField
        margin="dense"
        fullWidth
        variant="outlined"
        size="small"
        // type="file"
        error={invalid}
        helperText={error?.message}
        label={title}
        sx={{ boxShadow: "initial", width: "50%" }}
        {...inputProps}
        {...otherProps}
      />

      <Avatar
        src={inputProps.value}
        sx={{ width: 60, height: 60, boxShadow: "initial" }}
      />
    </Box>
  );
};

export default AvatarInput;
