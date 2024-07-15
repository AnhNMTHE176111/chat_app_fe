import React, { FC, useState } from "react";
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  createSingleConversation,
  CreateSingleConversationParams,
  kickMember,
  leaveGroup,
  MemberListParams,
  MemberParams,
  updateRoleInGroup,
} from "../../services";
import { SINGLE_CONVERSATION } from "../../constants";
import { useNavigate } from "react-router-dom";
import { ProfileCard } from "../UserForm";

interface MemberListDialogProps {
  open: boolean;
  onClose: () => void;
  members: MemberListParams;
  userId: string;
  resetMembers: () => void;
}

const MemberListDialog: FC<MemberListDialogProps> = ({
  open,
  onClose,
  members,
  userId,
  resetMembers,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<MemberParams | null>(
    null
  );
  const [profileId, setProfileId] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<
    "error" | "info" | "success" | "warning" | undefined
  >(undefined);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    member: MemberParams
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMember(null);
  };

  const handleOpenPreviewProfile = (memberId: string) => {
    if (userId) {
      setProfileId(memberId);
      handleMenuClose();
    }
  };

  const handleLeaveGroup = (userId: string) => {
    if (userId) {
      const conversation_id = members.conversationId;
      leaveGroup(conversation_id)
        .then((res) => {
          setAlertMessage(res.message || "Leave group success");
          setAlertSeverity("success");
          navigate("/");
        })
        .catch((err) => {
          setAlertMessage(
            err.response?.data?.message || "Failed to leave group"
          );
          setAlertSeverity("error");
        })
        .finally(() => {
          handleMenuClose();
        });
    }
  };

  const handleOpenMessage = (memberId: string) => {
    if (userId) {
      const data: CreateSingleConversationParams = {
        participants: [userId, memberId],
        type: SINGLE_CONVERSATION,
      };
      createSingleConversation(data)
        .then((res) => {
          if (res.success) {
            navigate(`/chat/${res.data._id}`);
          } else {
            throw new Error(res.message || "Failed to create conversation");
          }
        })
        .catch((error) => {
          setAlertMessage(
            error.response?.data?.message || "Failed to create conversation"
          );
          setAlertSeverity("error");
        });
    }
  };

  const handleUpdateRole = (memberId: string, newRole: string) => {
    if (memberId) {
      const conversation_id = members.conversationId;
      updateRoleInGroup(conversation_id, memberId, newRole)
        .then((res) => {
          setAlertMessage(res.message || "Update role success");
          setAlertSeverity("success");
        })
        .catch((err) => {
          console.log(err);
          setAlertMessage(
            err.response?.data?.message || "Failed to update role"
          );
          setAlertSeverity("error");
        })
        .finally(() => {
          resetMembers();
          handleMenuClose();
        });
    }
  };

  const handleKickMember = (memberId: string) => {
    if (memberId) {
      const conversation_id = members.conversationId;
      kickMember(conversation_id, memberId)
        .then((res) => {
          setAlertMessage(res.message || "Kick member success");
          setAlertSeverity("success");
        })
        .catch((err) => {
          setAlertMessage(
            err.response?.data?.message || "Failed to kick member"
          );
          setAlertSeverity("error");
        })
        .finally(() => {
          resetMembers();
          handleMenuClose();
        });
    }
  };

  const isAdmin = members.admin.includes(userId);

  const renderMenuItems = () => {
    if (!selectedMember) return null;

    if (selectedMember._id === userId) {
      if (isAdmin) {
        return [
          <MenuItem
            key="demote"
            onClick={() => handleUpdateRole(selectedMember._id, "member")}
          >
            Demote to Member
          </MenuItem>,
          <MenuItem key="leave" onClick={() => handleKickMember(userId)}>
            Leave Group
          </MenuItem>,
        ];
      } else {
        return [
          <MenuItem key="leave" onClick={() => handleLeaveGroup(userId)}>
            Leave Group
          </MenuItem>,
        ];
      }
    } else {
      if (members.admin.includes(selectedMember._id)) {
        return [
          <MenuItem
            key="message"
            onClick={() => handleOpenMessage(selectedMember._id)}
          >
            Message
          </MenuItem>,
          <MenuItem
            key="profile"
            onClick={() => handleOpenPreviewProfile(selectedMember._id)}
          >
            Profile
          </MenuItem>,
        ];
      } else {
        return isAdmin
          ? [
              <MenuItem
                key="message"
                onClick={() => handleOpenMessage(selectedMember._id)}
              >
                Message
              </MenuItem>,
              <MenuItem
                key="profile"
                onClick={() => handleOpenPreviewProfile(selectedMember._id)}
              >
                Profile
              </MenuItem>,
              <MenuItem
                key="promote"
                onClick={() => handleUpdateRole(selectedMember._id, "admin")}
              >
                Promote to Admin
              </MenuItem>,
              <MenuItem
                key="kick"
                onClick={() => handleKickMember(selectedMember._id)}
              >
                Kick from group
              </MenuItem>,
            ]
          : [
              <MenuItem
                key="message"
                onClick={() => handleOpenMessage(selectedMember._id)}
              >
                Message
              </MenuItem>,
              <MenuItem
                key="profile"
                onClick={() => handleOpenPreviewProfile(selectedMember._id)}
              >
                Profile
              </MenuItem>,
            ];
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Members</DialogTitle>
        <DialogContent>
          <List>
            {members.memberList.map((member) => (
              <React.Fragment key={member._id}>
                <ListItem sx={{ overflow: "auto" }} divider>
                  <ListItemAvatar>
                    <Avatar src={member.avatar}>{member.fullName[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={member.fullName}
                    secondary={
                      members.admin.includes(member._id) ? "Admin" : ""
                    }
                  />
                  <IconButton
                    edge="end"
                    aria-label="more"
                    aria-controls={`member-menu-${member._id}`}
                    aria-haspopup="true"
                    onClick={(e) => handleMenuClick(e, member)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id={`member-menu-${member._id}`}
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    {renderMenuItems()}
                  </Menu>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
      </Dialog>
      {/* ProfileCard component */}
      {profileId && (
        <ProfileCard
          id={profileId}
          open={Boolean(profileId)}
          onClose={() => setProfileId("")}
        />
      )}
      {/* Alert component */}
      {alertMessage && (
        <Alert
          severity={alertSeverity}
          sx={{
            position: "absolute",
            top: 20,
            right: "50%",
            transform: "translateX(50%)",
          }}
          onClose={() => {
            setAlertMessage("");
            setAlertSeverity(undefined);
          }}
        >
          {alertMessage}
        </Alert>
      )}
    </>
  );
};

export default MemberListDialog;
