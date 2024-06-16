import { Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import moment from "moment";

function Header() {
  const [today, setToday] = useState(moment());

  useEffect(() => {
    const interval = setInterval(() => {
      setToday(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Toolbar
      variant="dense"
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        color: "white",
      }}
      disableGutters
    >
      <a>{today.format("dddd, MMMM Do YYYY, h:mm:ss a")}</a>
    </Toolbar>
  );
}

export default Header;
