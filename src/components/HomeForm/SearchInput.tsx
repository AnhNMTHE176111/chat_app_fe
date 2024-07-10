import { InputAdornment, TextField } from "@mui/material";
import { InputProps } from "../../types";
import React from "react";
import { useController } from "react-hook-form";
import { Search } from "@mui/icons-material";

export const SearchInput: React.FC<InputProps> = ({
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
      variant="outlined"
      size="small"
      placeholder="Search"
      error={invalid}
      helperText={error?.message}
      sx={{ my: 1.5 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
      {...inputProps}
      {...otherProps}
    />
  );
};

export default SearchInput;
