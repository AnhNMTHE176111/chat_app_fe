import {
  Box,
  Typography,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import { getProfileByPreview } from "../../services";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks";
import { showNotificationAction } from "../../stores/notificationActionSlice";

interface ProfileCardProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  open,
  onClose,
}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageResp, setMessageResp] = useState<string>("");
  const dispatchNoti = useAppDispatch();

  useEffect(() => {
    if (open) {
      getProfileByPreview(id)
        .then((res) => {
          if (res.success) {
            setUser(res.data);
            setMessageResp(res.message || "User not published");
          }
        })
        .catch((error) => {
          dispatchNoti(
            showNotificationAction({
              message: error?.response?.data?.message || "Something wrong",
              severity: "error",
            })
          );
        })
        .finally(() => setLoading(false));
    }
  }, [id, open]);

  if (!open) return null;

  return (
    <>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Dialog open={open} onClose={onClose} sx={{ width: "400" }}>
          <DialogTitle sx={{ padding: "8px 8px" }}>
            Profile Information
          </DialogTitle>
          <DialogContent sx={{ padding: 0, overflow: "hidden" }}>
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
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
                gap={2}
              >
                <TextField
                  fullWidth
                  label="Gender"
                  variant="outlined"
                  size="small"
                  value={user?.gender}
                  sx={{
                    display:
                      user?.publicInformation && user?.gender
                        ? "block"
                        : "none",
                  }}
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
                  sx={{
                    display:
                      user?.publicInformation && user?.dateOfBirth
                        ? "block"
                        : "none",
                  }}
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
                  sx={{
                    display:
                      user?.publicInformation && user?.address
                        ? "block"
                        : "none",
                  }}
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
                  sx={{
                    display:
                      user?.publicInformation && user?.description
                        ? "block"
                        : "none",
                  }}
                  value={user?.description}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <Box
                sx={{
                  mt: 2,
                  display: user?.publicInformation ? "none" : "block",
                }}
              >
                <Alert severity="info">
                  <AlertTitle>{messageResp}</AlertTitle>
                </Alert>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ProfileCard;
