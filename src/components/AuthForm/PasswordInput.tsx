import { PasswordRounded } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { InputProps } from "../../types";

export const PasswordInput: React.FC<InputProps> = ({ ...otherProps }) => {
  return (
    <TextField
      margin="dense"
      fullWidth
      variant="outlined"
      size="small"
      label="Password *"
      type="password"
      id="outlined-start-adornment"
      sx={{ my: 1.5 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PasswordRounded />
          </InputAdornment>
        ),
      }}
      {...otherProps}
    />
  );
};

export default PasswordInput;
