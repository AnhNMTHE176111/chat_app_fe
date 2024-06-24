import React from "react";
import { Description, Phone } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { InputProps } from "../../types";
import { useController } from "react-hook-form";

export const DescriptionInput: React.FC<InputProps> = ({
  control,
  name,
  ...otherProps
}) => {
  const {
    field: { ...inputProps },
    fieldState: { invalid, error },
  } = useController({
    control,
    name,
    rules: {},
    defaultValue: "",
  });

  return (
    <TextField
      margin="dense"
      fullWidth
      multiline
      variant="outlined"
      size="small"
      label="Description"
      error={invalid}
      helperText={error?.message}
      sx={{ my: 1.5 }}
      //   InputProps={{
      //     startAdornment: (
      //       <InputAdornment position="start">
      //         <Description />
      //       </InputAdornment>
      //     ),
      //   }}
      {...inputProps}
      {...otherProps}
    />
  );
};

export default DescriptionInput;
