import React from "react";
import { Phone } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { InputProps } from "../../types";
import { useController } from "react-hook-form";

export const PhoneInput: React.FC<InputProps> = ({
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
    rules: {
      pattern: {
        value: /^([0|84])+([0-9]{9})\b$/,
        message: "Phone number is not valid",
      },
    },
    defaultValue: "",
  });

  return (
    <TextField
      margin="dense"
      fullWidth
      variant="outlined"
      size="small"
      label="Phone"
      placeholder="Phone number"
      error={invalid}
      helperText={error?.message}
      sx={{ my: 1.5 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Phone />
          </InputAdornment>
        ),
      }}
      {...inputProps}
      {...otherProps}
    />
  );
};

export default PhoneInput;
