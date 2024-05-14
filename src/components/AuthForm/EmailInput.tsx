import { Email } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { useController } from "react-hook-form";
import { EMAIL_REGEX } from "../../constants";
import { InputProps } from "../../types";

export const EmailInput: React.FC<InputProps> = ({
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
        message: "Email is required.",
      },
      pattern: {
        value: EMAIL_REGEX,
        message: "Email is invalid",
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
      label="Email *"
      type="email"
      error={invalid}
      helperText={error?.message}
      sx={{ my: 1.5 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Email />
          </InputAdornment>
        ),
      }}
      {...inputProps}
      {...otherProps}
    />
  );
};

export default EmailInput;
