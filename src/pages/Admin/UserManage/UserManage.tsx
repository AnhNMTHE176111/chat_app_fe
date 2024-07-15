import React, { useState, useEffect } from "react";
import {
  Paper,
  IconButton,
  Dialog,
  Toolbar,
  AppBar,
  Container,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import AddUser from "./AddUser";
import TableSkeleton from "../Dashboard/TableSkeleton";
import ViewDialog from "./ViewDialog";

interface User {
  id: number;
  username: string;
  fullname: string;
  age: number;
  dateOfBirth: Date;
  phone: string;
  email: string;
  address: string;
  avatar: string;
  description: string;
}

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulating data fetching
    setTimeout(() => {
      const sampleUsers: User[] = [
        { id: 1, username: "Snow", fullname: "Jon Snow", age: 35, dateOfBirth: new Date("1989-09-23"), phone: "123-456-7890", email: "jon@example.com", address: "Winterfell", avatar: "url_to_avatar", description: "Knows nothing" },
        { id: 2, username: "Lannister", fullname: "Cersei Lannister", age: 42, dateOfBirth: new Date("1982-12-03"), phone: "987-654-3210", email: "cersei@example.com", address: "King's Landing", avatar: "url_to_avatar", description: "Queen of the Seven Kingdoms" },
        { id: 3, username: "Lannister", fullname: "Jaime Lannister", age: 45, dateOfBirth: new Date("1979-06-06"), phone: "555-123-4567", email: "jaime@example.com", address: "Casterly Rock", avatar: "url_to_avatar", description: "The Kingslayer" },
        { id: 4, username: "Stark", fullname: "Arya Stark", age: 16, dateOfBirth: new Date("2008-07-21"), phone: "222-333-4444", email: "arya@example.com", address: "Winterfell", avatar: "url_to_avatar", description: "No one" },
        { id: 5, username: "Targaryen", fullname: "Daenerys Targaryen", age: 12, dateOfBirth: new Date("2012-04-15"), phone: "999-888-7777", email: "daenerys@example.com", address: "Dragonstone", avatar: "url_to_avatar", description: "Mother of Dragons" },
        { id: 6, username: "Melisandre", fullname: "Melisandre", age: 150, dateOfBirth: new Date("1874-03-25"), phone: "111-222-3333", email: "melisandre@example.com", address: "Asshai", avatar: "url_to_avatar", description: "The Red Woman" },
        { id: 7, username: "Misandre", fullname: "Misandre", age: 150, dateOfBirth: new Date("1874-03-25"), phone: "111-222-3333", email: "misandre@example.com", address: "Asshai", avatar: "url_to_avatar", description: "The Red Woman" },
        { id: 8, username: "Ferrara", fullname: "Clifford Ferrara", age: 44, dateOfBirth: new Date("1980-11-12"), phone: "777-777-7777", email: "clifford@example.com", address: "Braavos", avatar: "url_to_avatar", description: "The Braavosi" },
        { id: 9, username: "Rossini", fullname: "Frances Rossini", age: 36, dateOfBirth: new Date("1988-02-29"), phone: "444-555-6666", email: "frances@example.com", address: "Lys", avatar: "url_to_avatar", description: "The Lysean" },
        { id: 10, username: "Harvey", fullname: "Roxie Harvey", age: 65, dateOfBirth: new Date("1959-08-18"), phone: "000-111-2222", email: "roxie@example.com", address: "Pentos", avatar: "url_to_avatar", description: "The Pentoshi" },
      ];

      setUsers(sampleUsers);
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // Filter users based on search input
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const handleAddUserClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleView = (id: number) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      setSelectedUser(user);
      setOpenViewDialog(true);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Username", width: 130 },
    { field: "fullname", headerName: "Fullname", width: 130 },
    { field: "age", headerName: "Age", type: "number", width: 90 },
    { field: "phone", headerName: "Phone", width: 130 },
    { field: "email", headerName: "Email", width: 200 },

    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: (params: any) => (
        <>
          <IconButton
            aria-label="View"
            onClick={() => handleView(params.row.id as number)}
          >
            <VisibilityIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <Paper>
      <AppBar position="static">
        <Toolbar>
        <div style={{ display: "flex", alignItems: "center", marginRight: "auto" }}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={handleSearchChange}
            style={{
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
              minWidth: 200,
              marginLeft: 8,
            }}
          />
        </div>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="add"
          onClick={handleAddUserClick}
          style={{ marginLeft: "auto" }}
        >
          <AddCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>



      <Container style={{ marginTop: 20, marginBottom: 20 }}>


        {isLoading ? (
          <TableSkeleton loading={isLoading} />
        ) : (
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            style={{ minHeight: 300, width: "100%" }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 9 },
              },
            }}
            pageSizeOptions={[9, 18, 27]}
            checkboxSelection
          />
        )}
      </Container>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <AddUser onClose={handleCloseDialog} />
      </Dialog>
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
        {selectedUser && (
          <ViewDialog
            open={openViewDialog}
            onClose={() => setOpenViewDialog(false)}
            userData={selectedUser}
          />
        )}
      </Dialog>
    </Paper>
  );
};

export default UserManager;
