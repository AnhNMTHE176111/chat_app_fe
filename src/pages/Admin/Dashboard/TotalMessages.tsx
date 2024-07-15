import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Title from "./Title";

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function TotalMessages() {
  return (
    <React.Fragment>
      <div style={{ marginTop: '20px' }}>
        <Title>Total Messages</Title>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <MessageOutlinedIcon style={{ marginRight: '5px' }} />
          <Typography variant="body2" color="text.secondary">
            Total Messages: 500
          </Typography>
        </div>
        <Typography color="text.secondary" sx={{ flex: 1, marginTop: '10px' }}>
          on 16 June, 2024
        </Typography>
      </div>

    </React.Fragment>
  );
}
