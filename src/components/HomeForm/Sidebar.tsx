import {
  CalendarMonth,
  ChatOutlined,
  Folder,
  Logout,
  PeopleAlt,
  Person,
  Settings,
  StarBorder,
  VideoCall,
} from "@mui/icons-material";
import { List, ListItem } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { logout } from "../../services";
import { signout, useAuth } from "../../hooks";

function Sidebar() {
  const location = useLocation();
  const { dispatch } = useAuth();

  const handleLogout = () => {
    logout()
      .then(() => {
        dispatch(signout());
        return;
      })
      .catch((reason: any) => {
        console.log("Logout Fail", reason);
        return;
      });
  };

  const menu = [
    { icon: <ChatOutlined />, title: "Chats", path: "/" },
    { icon: <VideoCall />, title: "Video Call", path: "/video-call" },
    { icon: <PeopleAlt />, title: "Contacts", path: "/contacts" },
    { icon: <Folder />, title: "Files", path: "/folders" },
    { icon: <CalendarMonth />, title: "Calendar", path: "/calender" },
    { icon: <Person />, title: "Profile", path: "/profile" },
    { icon: <Settings />, title: "Settings", path: "/setting" },
    { icon: <Logout />, title: "Logout", path: "/logout" },
  ];

  return (
    <List
      style={{
        height: "100%",
        width: "100%",
        display: "space-between",
        flexDirection: "column",
        color: "white",
        margin: "0",
      }}
    >
      {menu.map((item) => {
        return (
          <NavLink
            key={item.title}
            to={item.path}
            onClick={() => {
              if (item.path == "/logout") {
                handleLogout();
              }
            }}
            style={{
              textDecoration: "none",
            }}
            disableGutters
            title={item.title}
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
            >
              {item.icon}
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );
}

export default Sidebar;
