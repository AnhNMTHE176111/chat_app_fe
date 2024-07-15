import { AccountBoxRounded } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { InputProps } from "../../types";
import { useController } from "react-hook-form";

export const FullNameInput: React.FC<InputProps> = ({
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
      required: {
        value: true,
        message: "FullName is required.",
      },
      minLength: {
        value: 3,
        message: "FullName must longer than 3 character",
      },
      maxLength: {
        value: 45,
        message: "FullName must shorter than 25 character",
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
      label="FullName *"
      error={invalid}
      helperText={error?.message}
      sx={{ my: 1.5 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccountBoxRounded />
          </InputAdornment>
        ),
      }}
      {...inputProps}
      {...otherProps}
    />
  );
};

export default FullNameInput;
