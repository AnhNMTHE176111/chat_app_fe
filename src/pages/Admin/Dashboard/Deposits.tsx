import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Title from "./Title";

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Deposits() {
  return (
    <React.Fragment>
      <Title>User Deposits</Title>
      <Typography component="p" variant="h4">
        200
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on 16 June, 2024
      </Typography>
    </React.Fragment>
  );
}
