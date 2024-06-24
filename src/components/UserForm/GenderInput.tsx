import React from "react";
import { Phone, Wc } from "@mui/icons-material";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { InputProps } from "../../types";
import { useController } from "react-hook-form";

export const GenderInput: React.FC<InputProps> = ({
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

  const genders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  return (
    <TextField
      select
      margin="dense"
      fullWidth
      variant="outlined"
      size="small"
      label="Gender"
      error={invalid}
      helperText={error?.message}
      sx={{ my: 1.5 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Wc />
          </InputAdornment>
        ),
      }}
      {...inputProps}
      {...otherProps}
    >
      {genders.map((gender) => (
        <MenuItem key={gender.value} value={gender.value}>
          {gender.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default GenderInput;
