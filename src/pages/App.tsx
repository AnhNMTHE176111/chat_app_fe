import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/logo.svg";
import "../css/App.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { signout, useAuth } from "../hooks";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
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
} from "@mui/material";
import { logout, token } from "../services";
import MenuIcon from "@mui/icons-material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import SendIcon from "@mui/icons-material/Send";

export function App() {
  const navigate = useNavigate();
  const { user, dispatch } = useAuth();
  const location = useLocation();
  useEffect(() => {
    console.log("user", user);
  }, []);

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

  /** Example here */
  // const [isConnected, setIsConnected] = useState(socket.connected);
  // const [messages, setMessages] = useState<string[]>([]);
  // const [msg, setMsg] = useState("");
  // const lastMessageRef = useRef<HTMLElement>(null);

  // function sendMsg() {
  //   socket.emit("message", { message: msg });
  //   setMsg("");
  // }

  // useEffect(() => {
  //   setTimeout(() => {
  //     lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }, 100);
  // }, [messages]);

  // useEffect(() => {
  //   function onConnect() {
  //     console.log("Connected");
  //     setIsConnected(true);
  //   }
  //   function onDisconnect() {
  //     console.log("Disonnected");
  //     setIsConnected(false);
  //   }
  //   function onMessageEvent(value: string) {
  //     setMessages((previous) => [...previous, value]);
  //   }

  //   socket.on("connect", onConnect);
  //   socket.on("disconnect", onDisconnect);
  //   socket.on("message", onMessageEvent);

  //   return () => {
  //     socket.off("connect", onConnect);
  //     socket.off("disconnect", onDisconnect);
  //     socket.off("message", onMessageEvent);
  //   };
  // }, []);

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
          <NavLink to={"/home"} replace>
            HOME
          </NavLink>
          <NavLink to={"/about"} replace>
            ABOUT
          </NavLink>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hello {user?.fullName} ! You're {location.pathname} of Chat App
          </Typography>
          <Button variant="contained" onClick={handleLogout}>
            Log out
          </Button>
          <Button variant="contained" onClick={token}>
            Refresh Token
          </Button>
        </Toolbar>
      </AppBar>

      {/* <Box sx={{ flexGrow: 1, display: "flex" }}>
        <Grid container sx={{ flexGrow: 1 }}>
          <Grid item xs={4} sx={{ backgroundColor: "#1A2027" }}>
            <Container>
              <List dense={false}>
                <ListItem
                  sx={{ backgroundColor: "#fff" }}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      isConnected ? user?.fullName + " is connected" : ""
                    }
                    secondary={"Secondary text"}
                  />
                </ListItem>
              </List>
              <Button onClick={() => socket.connect()}>Connect</Button>
              <Button onClick={() => socket.disconnect()}>Disconnect</Button>
            </Container>
          </Grid>

          <Grid
            item
            xs={8}
            sx={{
              backgroundColor: "#def",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Container
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "auto",
                maxHeight: "85vh",
              }}
            >
              <List dense={true}>
                {messages.map((message, index) => (
                  <ListItem key={index}>
                    <ListItemText ref={lastMessageRef}>{message}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </Container>
            <Container>
              <FormControl fullWidth sx={{ margin: "15px" }}>
                <Paper
                  component="form"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    return sendMsg();
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Aa"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                  />
                  <IconButton
                    type="submit"
                    sx={{ p: "10px" }}
                    aria-label="send"
                  >
                    <SendIcon />
                  </IconButton>
                </Paper>
              </FormControl>
            </Container>
          </Grid>
        </Grid>
      </Box> */}
    </Box>
  );
}

export default App;
