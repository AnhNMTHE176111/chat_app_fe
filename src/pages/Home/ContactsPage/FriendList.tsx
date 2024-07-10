import { Grid, Skeleton } from "@mui/material";
import { useAppDispatch, useAuth, useSocket } from "../../../hooks";
import { useEffect, useState } from "react";
import { showNotificationAction } from "../../../stores/notificationActionSlice";
import {
  CreateSingleConversationParams,
  FriendListParams,
  changeFriendStatus,
  createSingleConversation,
  getFriendList,
} from "../../../services";
import { PersonCard, ProfileCard } from "../../../components";
import { useNavigate } from "react-router-dom";
import { FRIEND_STATUS, SINGLE_CONVERSATION } from "../../../constants";

export const FriendList = ({ searchTerm }: { searchTerm: string }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<FriendListParams[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatchNoti = useAppDispatch();
  const navigate = useNavigate();
  const { socket } = useSocket();

  useEffect(() => {
    if (user?.id && socket) {
      const fetchFriendList = () => {
        getFriendList(user.id)
          .then((res) => {
            if (res.success) {
              setFriends(res.data);
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
      };

      fetchFriendList();

      socket.on("friendStatusChanged", (userId: string) => {
        if (userId === user?.id) {
          fetchFriendList();
        }
      });

      return () => {
        socket.off("friendStatusChanged");
      };
    }
  }, [user?.id, socket]);

  const handleProfileClick = (id: string) => {
    setSelectedUserId(id);
    setOpenProfileDialog(true);
  };

  const handleMessageClick = (id: string) => {
    if (user?.id) {
      const data: CreateSingleConversationParams = {
        participants: [user.id, id],
        type: SINGLE_CONVERSATION,
      };
      createSingleConversation(data)
        .then((res) => {
          if (res.success) {
            console.log(res.data);
            navigate(`/chat/${res.data.id}`);
          }
        })
        .catch((err) => {
          console.log(err);
          dispatchNoti(
            showNotificationAction({
              message: "Something went wrong",
              severity: "error",
            })
          );
        });
    }
  };

  const handleUnfriendClick = (id: string) => {
    if (user?.id) {
      changeFriendStatus(user.id, {
        friendId: id,
        status: FRIEND_STATUS.REJECT,
      })
        .then((res) => {
          if (res.success) {
            setFriends(friends.filter((friend) => friend.id !== id));
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
        Array.from(new Array(8)).map((_, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Skeleton variant="rectangular" width="100%" height={100} />
          </Grid>
        ))
      ) : (
        <>
          {friends.length > 0 ? (
            friends
              ?.filter((friend) =>
                friend.fullName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              ?.map((friend, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <PersonCard
                    id={friend.id}
                    fullName={friend.fullName}
                    avatar={friend.avatar}
                    onViewProfile={handleProfileClick}
                    onMessage={handleMessageClick}
                    onUnfriend={handleUnfriendClick}
                  />
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
              No friends
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

export default FriendList;
