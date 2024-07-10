import { Avatar, Box, Grid, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import moment from "moment";
import { useAuth } from "../../hooks";

function Header() {
  const [today, setToday] = useState(moment());
  const { user } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setToday(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Grid
      sx={{
        color: "white",
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        height: "100%",
      }}
      item
      xs={12}
    >
      <Grid item xs={1}></Grid>
      <Grid
        item
        xs={9}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            src={user?.avatar}
            sx={{
              height: "30px", 
              width: "30px",
              mx: "7px",
            }}
          />
          <Typography align="left">Hello {user?.fullName}</Typography>
        </Box>
        <Typography align="center">
          {today.format("dddd, MMMM Do YYYY, h:mm:ss a")}
        </Typography>
        <Typography align="right"></Typography>
      </Grid>
    </Grid>
  );
}

export default Header;
