import { AccountBoxRounded } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { InputProps } from "../../types";

export const UsernameInput: React.FC<InputProps> = ({ ...otherProps }) => {
  return (
    <TextField
      margin="dense"
      fullWidth
      variant="outlined"
      size="small"
      label="Username"
      id="outlined-start-adornment"
      sx={{ my: 1.5 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccountBoxRounded />
          </InputAdornment>
        ),
      }}
      { ...otherProps }
    />
  );
};

export default UsernameInput;
