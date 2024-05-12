import { Email } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { InputProps } from "../../types";

export const EmailInput: React.FC<InputProps> = ({ ...otherProps }) => {
  return (
    <TextField
      margin="dense"
      fullWidth
      variant="outlined"
      size="small"
      label="Email *"
      type="email"
      id="outlined-start-adornment"
      sx={{ my: 1.5 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Email />
          </InputAdornment>
        ),
      }}
      { ...otherProps }
    />
  );
};

export default EmailInput;
