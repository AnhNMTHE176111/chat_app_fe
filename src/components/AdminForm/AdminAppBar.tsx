import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  styled,
  Dialog,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { AddUser } from "../../pages/Admin/UserManage/AddUser";

interface AdminAppBarProps {
  onAddUserClick: () => void;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchValue: string;
}

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#000000",
});

const SearchContainer = styled("div")({
  position: "relative",
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  borderRadius: "4px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  flex: 0.3, // Điều chỉnh kích thước của thanh search
  maxWidth: "200px", // Giới hạn chiều rộng tối đa của thanh search
  marginLeft: "10px", // Đẩy SearchContainer sang bên trái
});

const StyledSearchIcon = styled(SearchIcon)({
  position: "absolute",
  left: "8px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "inherit",
});

const StyledInputBase = styled(InputBase)({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: "8px 8px 8px 40px",
  },
});

export const AdminAppBar: React.FC<AdminAppBarProps> = ({
  onAddUserClick,
  onSearchChange,
  searchValue,
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleAddUserClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <StyledAppBar position="static">
        <Toolbar>
          <SearchContainer>
            <StyledSearchIcon />
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={searchValue}
              onChange={onSearchChange}
            />
          </SearchContainer>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="add"
            onClick={handleAddUserClick}
            style={{ marginLeft: "auto" }} // Đặt nút Add ở bên phải
          >
            <AddCircleIcon />
          </IconButton>
        </Toolbar>
      </StyledAppBar>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <AddUser onClose={handleCloseDialog} />
      </Dialog>
    </>
  );
};

export default AdminAppBar;
