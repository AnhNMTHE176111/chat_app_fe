import { PasswordRounded } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { InputProps } from "../../types";
import { useController } from "react-hook-form";
import { PASSWORD_REGEX } from "../../constants";

export const PasswordInput: React.FC<InputProps> = ({
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
        message: "Password is required.",
      },
      pattern: {
        value: PASSWORD_REGEX,
        message: "Password is invalid",
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
      label="Password *"
      type="password"
      error={invalid}
      helperText={error?.message}
      sx={{ my: 1.5 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PasswordRounded />
          </InputAdornment>
        ),
      }}
      {...inputProps}
      {...otherProps}
    />
  );
};

export default PasswordInput;
