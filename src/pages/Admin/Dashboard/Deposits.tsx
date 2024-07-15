import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Title from "./Title";

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Deposits() {
  return (
    <React.Fragment>
      {/* Total Users */}
      <div>
        <Title>Total Users</Title>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <PersonOutlineOutlinedIcon style={{ marginRight: '5px' }} />
          <Typography variant="body2" color="text.secondary">
            Total Users: 200
          </Typography>
        </div>
        <Typography color="text.secondary" sx={{ flex: 1, marginTop: '10px' }}>
          on 16 June, 2024
        </Typography>
      </div>

      
    </React.Fragment>
  );
}
