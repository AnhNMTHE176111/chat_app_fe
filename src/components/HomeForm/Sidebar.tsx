import { useState } from "react";
import {
  CalendarMonth,
  ChatOutlined,
  Folder,
  Logout,
  PeopleAlt,
  Person,
  Settings,
  VideoCall,
} from "@mui/icons-material";
import {
  List,
  ListItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { signout, useAppDispatch, useAuth } from "../../hooks";
import { logout } from "../../services";

function Sidebar() {
  const location = useLocation();
  const { dispatch } = useAuth();
  const dispatchNoti = useAppDispatch();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogoutClick = (event: any) => {
    event.preventDefault();
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout()
      .then((res) => {
        if (res.success) {
          dispatchNoti({
            type: "success",
            message: res.message || "Logout successfully!",
          });
          dispatch(signout());
          return;
        }
      })
      .catch((error) => {
        dispatchNoti({
          type: "error",
          message: error?.response?.data?.message || "Something wrong",
        });
        return;
      });
    setLogoutDialogOpen(false);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const menu = [
    { icon: <ChatOutlined />, title: "Chats", path: "/" },
    { icon: <VideoCall />, title: "Video Call", path: "/video-call" },
    { icon: <PeopleAlt />, title: "Contacts", path: "/contacts" },
    { icon: <Folder />, title: "Files", path: "/folders" },
    { icon: <CalendarMonth />, title: "Calendar", path: "/calendar" },
    { icon: <Person />, title: "Profile", path: "/profile" },
    { icon: <Settings />, title: "Settings", path: "/setting" },
    {
      icon: <Logout />,
      title: "Logout",
      path: "/logout",
      action: handleLogoutClick,
    },
  ];

  return (
    <>
      <List
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          color: "white",
          margin: "0",
        }}
      >
        {menu.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            style={{
              textDecoration: "none",
            }}
            onClick={item.action}
          >
            <ListItem
              component={"div"}
              style={{
                justifyContent: "center",
                backgroundColor:
                  location.pathname === item.path ? "#ebe9e4" : "",
                color: location.pathname === item.path ? "#ed8207" : "white",
                margin: "auto",
                borderRadius: "15px",
                width: "50%",
                height: "60px",
              }}
              disableGutters
              title={item.title}
            >
              {item.icon}
            </ListItem>
          </NavLink>
        ))}
      </List>
      <Dialog open={logoutDialogOpen} onClose={handleLogoutCancel}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Sidebar;
