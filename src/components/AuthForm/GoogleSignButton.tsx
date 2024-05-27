import { Google } from "@mui/icons-material";
import { Button } from "@mui/material";
import { ButtonBaseOwnProps } from "@mui/material";

export const GoogleSignButton: React.FC<ButtonBaseOwnProps> = ({
  ...otherProps
}) => {
  return (
    <Button
      variant="outlined"
      fullWidth
      color="primary"
      sx={{ my: 1.5 }}
      startIcon={<Google sx={{ color: "red" }} />}
      {...otherProps}
    >
      Sign with Google
    </Button>
  );
};

export default GoogleSignButton;
