import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  Toolbar,
  Typography,
  InputAdornment,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  email: string;
}

const sampleUsers: User[] = [
  { id: 1, username: "john_doe", email: "john@example.com" },
  { id: 2, username: "jane_doe", email: "jane@example.com" },
  { id: 3, username: "alice", email: "alice@example.com" },
  { id: 4, username: "bob", email: "bob@example.com" },
  { id: 5, username: "charlie", email: "charlie@example.com" },
  { id: 6, username: "david", email: "david@example.com" },
  { id: 7, username: "edward", email: "edward@example.com" },
  { id: 8, username: "frank", email: "frank@example.com" },
  { id: 9, username: "george", email: "george@example.com" },
  { id: 10, username: "harry", email: "harry@example.com" },
  { id: 11, username: "isaac", email: "isaac@example.com" },
  { id: 12, username: "jack", email: "jack@example.com" },
];

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/admin/edit-user/${id}`);
  };

  const handleDelete = (id: number) => {
    setSelectedUserId(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId !== null) {
      const updatedUsers = users.filter((user) => user.id !== selectedUserId);
      setUsers(updatedUsers);
      setSelectedUserId(null);
      setConfirmDeleteOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setSelectedUserId(null);
    setConfirmDeleteOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleBack = () => {
    navigate("/admin/dashboard"); // Chuyển hướng về trang /admin/dashboard
  };

  const handleAddUser = () => {
    navigate("/admin/add-user");
  };

  return (
    <Paper>
      <Toolbar>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, textAlign: "center" }}
        >
          User Manager
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </Toolbar>
      <TextField
        label="Search by username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>UserName</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(user.id)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(user.id)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this User?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserManager;
