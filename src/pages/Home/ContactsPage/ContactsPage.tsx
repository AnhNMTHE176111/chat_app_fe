import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Tabs,
  Tab,
  InputAdornment,
  Divider,
  Button,
} from "@mui/material";
import { PersonAdd, Search } from "@mui/icons-material";
import FriendList from "./FriendList";
import FriendRequestList from "./FriendRequestList";
import AddFriendDialog from "./AddFriendDialog";

export const ContactsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleAddFriendClick = async () => {
    setDialogOpen(true);
  };

  return (
    <Box
      width={"100%"}
      height={"100%"}
      sx={{ display: "flex", flexDirection: "column", overflow: "auto" }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
        <Typography variant="h5" component="div" fontWeight={"bold"}>
          Contacts
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            placeholder="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleAddFriendClick}
          >
            Add Friend
          </Button>
        </Box>
      </Box>
      <Box
        p={2}
        sx={{ display: "flex", flexDirection: "column", padding: "0 auto" }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="friend list tabs"
        >
          <Tab label="All Friends" />
          <Tab label="Friend Requests" />
        </Tabs>
        <Divider />
        {tabIndex === 0 ? (
          <FriendList searchTerm={searchTerm} />
        ) : (
          <FriendRequestList searchTerm={searchTerm} />
        )}
      </Box>
      <AddFriendDialog
        dialogOpen={dialogOpen}
        onCloseDialog={() => setDialogOpen(false)}
      />
    </Box>
  );
};

export default ContactsPage;
