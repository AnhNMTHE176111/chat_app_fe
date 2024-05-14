import { Alert, Collapse, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Severity } from "../../types";

interface NotificationActionProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: Severity;
}

export const NotificationAction: React.FC<NotificationActionProps> = ({
  open,
  onClose,
  message,
  severity,
}) => {
  return (
    <Collapse in={open}>
      <Alert
        severity={severity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <Close fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 1 }}
      >
        {message}
      </Alert>
    </Collapse>
  );
};

export default NotificationAction
