import {
  Box,
  Typography,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import { getProfileByPreview } from "../../services";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks";
import { showNotificationAction } from "../../stores/notificationActionSlice";

export const ProfileCard = ({
  id,
  open,
  onClose,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatchNoti = useAppDispatch();

  useEffect(() => {
    if (open) {
      getProfileByPreview(id)
        .then((res) => {
          setUser(res.data);
        })
        .catch((error) => {
          dispatchNoti(
            showNotificationAction({
              message: error?.response?.data?.message || "Something wrong",
              severity: "error",
            })
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, open]);

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} sx={{ width: "400" }}>
      <DialogTitle sx={{ padding: "8px 8px" }}>Profile Information</DialogTitle>
      <DialogContent sx={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                height: 150,
                backgroundImage: `url(${user?.background})`,
                backgroundSize: "cover",
              }}
            />
            <Box sx={{ mt: -8 }}>
              <Avatar
                sx={{ width: 72, height: 72, margin: "0 auto" }}
                alt={user?.fullName}
                src={user?.avatar || "/broken-image.jpg"}
              />
            </Box>
            <Box sx={{ p: 2 }}>
              <Box>
                <Typography variant="h6">{user?.fullName}</Typography>
              </Box>
              <Box
                sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
                gap={2}
              >
                <TextField
                  fullWidth
                  label="Gender"
                  variant="outlined"
                  size="small"
                  value={user?.gender}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Date of Birth"
                  size="small"
                  type="date"
                  value={user?.dateOfBirth}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Address"
                  value={user?.address}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  size="small"
                  label="Description"
                  value={user?.description}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCard;
