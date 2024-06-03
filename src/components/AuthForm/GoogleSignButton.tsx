import { Google } from "@mui/icons-material";
import { Button } from "@mui/material";
import { ButtonBaseOwnProps } from "@mui/material";
import { URI } from "../../constants";

export const GoogleSignButton: React.FC<ButtonBaseOwnProps> = ({
  ...otherProps
}) => {
  const handleLogin = () => {
    window.open(`${URI.DOMAIN}/auth/google/callback`, "_self");
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      color="primary"
      sx={{ my: 1.5 }}
      startIcon={<Google sx={{ color: "red" }} />}
      onClick={handleLogin}
      {...otherProps}
    >
      Sign with Google
    </Button>
  );
};

export default GoogleSignButton;
