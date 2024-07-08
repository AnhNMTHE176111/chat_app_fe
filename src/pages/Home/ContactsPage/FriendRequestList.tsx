import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  FriendListParams,
  changeFriendStatus,
  getFriendRequestList,
} from "../../../services";
import { useAppDispatch, useAuth } from "../../../hooks";
import { showNotificationAction } from "../../../stores/notificationActionSlice";
import { ProfileCard } from "../../../components";
import { FRIEND_STATUS } from "../../../constants";

export const FriendRequestList = ({ searchTerm }: { searchTerm: string }) => {
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { user } = useAuth();
  const [friendRequests, setFriendRequests] = useState<FriendListParams[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatchNoti = useAppDispatch();

  useEffect(() => {
    if (user?.id) {
      getFriendRequestList(user.id)
        .then((res) => {
          if (res.success) {
            setFriendRequests(res.data);
          }
        })
        .catch((err) => {
          dispatchNoti(
            showNotificationAction({
              message: err?.message?.data?.message || "Something went wrong",
              severity: "error",
            })
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user?.id]);

  const handleProfileClick = (id: string) => {
    setSelectedUserId(id);
    setOpenProfileDialog(true);
  };

  const handleAcceptClick = async (id: string) => {
    if (user?.id) {
      changeFriendStatus(user.id, {
        friendId: id,
        status: FRIEND_STATUS.ACCEPT,
      })
        .then((res) => {
          if (res.success) {
            setFriendRequests(friendRequests.filter((item) => item.id !== id));
          }
        })
        .catch((err) => {
          dispatchNoti(
            showNotificationAction({
              message: err?.message?.data?.message || "Something went wrong",
              severity: "error",
            })
          );
        });
    }
  };

  const handleRejectClick = (id: string) => {
    if (user?.id) {
      changeFriendStatus(user.id, {
        friendId: id,
        status: FRIEND_STATUS.REJECT,
      })
        .then((res) => {
          if (res.success) {
            setFriendRequests(friendRequests.filter((item) => item.id !== id));
          }
        })
        .catch((err) => {
          dispatchNoti(
            showNotificationAction({
              message: err?.message?.data?.message || "Something went wrong",
              severity: "error",
            })
          );
        });
    }
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {loading ? (
        Array.from(new Array(10)).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={index}>
            <Card sx={{ height: "100%" }}>
              <Skeleton variant="rectangular" height={140} />
              <CardContent>
                <Typography gutterBottom variant="h5">
                  <Skeleton />
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">
                  <Skeleton />
                </Button>
                <Button size="small">
                  <Skeleton />
                </Button>
                <Button size="small">
                  <Skeleton />
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))
      ) : (
        <>
          {friendRequests.length > 0 ? (
            friendRequests
              ?.filter((friend) =>
                friend?.fullName
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              ?.map((friend, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={index}>
                  <Card sx={{ height: "100%" }}>
                    <CardMedia
                      sx={{ height: 140 }}
                      image={friend.avatar}
                      title="Friend Avatar"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5">
                        {friend.fullName}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => handleProfileClick(friend.id)}
                      >
                        Profile
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleRejectClick(friend.id)}
                      >
                        Cancel
                      </Button>
                      {friend.senderId !== user?.id && (
                        <Button
                          size="small"
                          onClick={() => handleAcceptClick(friend.id)}
                        >
                          Accept
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))
          ) : (
            <span
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                display: "flex",
                fontSize: "1.5rem",
                color: "grey",
              }}
            >
              No friend requests
            </span>
          )}
        </>
      )}
      {selectedUserId && (
        <ProfileCard
          id={selectedUserId}
          open={openProfileDialog}
          onClose={() => setOpenProfileDialog(false)}
        />
      )}
    </Grid>
  );
};

export default FriendRequestList;
