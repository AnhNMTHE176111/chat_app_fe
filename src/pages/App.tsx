import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/logo.svg";
import "../css/App.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { signout, useAuth } from "../hooks";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import { logout, token } from "../services";
import MenuIcon from "@mui/icons-material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import SendIcon from "@mui/icons-material/Send";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems, secondaryListItems } from "./Admin/Dashboard/listItems";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const drawerWidth: number = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export function App({ children }: { children: any }) {
  const navigate = useNavigate();
  const { user, dispatch } = useAuth();
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  useEffect(() => {
    console.log("user", user);
  }, []);

  const handleLogout = () => {
    setLoading(true);
    logout()
      .then(() => {
        dispatch(signout());
        return;
      })
      .catch((reason: any) => {
        console.log("Logout Fail", reason);
        return;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Link to={"/"}>
            <img
              src={logo}
              className="App-logo"
              alt="logo"
              style={{ width: "50px", height: "40px" }}
              onClick={() =>
                navigate("/", {
                  replace: true,
                })
              }
            />
          </Link>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hello {user?.fullName}
          </Typography>
          <Button variant="contained" onClick={handleLogout}>
            Log out
          </Button>
          {/* <Button variant="contained" onClick={token}>
            Refresh Token
          </Button> */}
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1, display: "flex" }}>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Container
          sx={{
            height: "10px",
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
}

export default App;
