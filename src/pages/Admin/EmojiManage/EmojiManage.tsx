import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Sample data type
interface Emoji {
  id: number;
  emoji: string;
  description: string;
}

const initialSampleData: Emoji[] = [
  { id: 1, emoji: "😊", description: "Smile" },
  { id: 2, emoji: "☹️", description: "Frown" },
  { id: 3, emoji: "❤️", description: "Heart" },
  { id: 4, emoji: "🤔", description: "Thinking" },
  { id: 5, emoji: "😂", description: "Laughing" },
  { id: 6, emoji: "💔", description: "Broken Heart" },
  { id: 7, emoji: "🙃", description: "Upside Down" },
  { id: 8, emoji: "🙌", description: "Raised Hands" },
  { id: 9, emoji: "🤩", description: "Star-Struck" },
  { id: 10, emoji: "🤯", description: "Mind Blown" },
  { id: 11, emoji: "🥰", description: "Smiling Face with Hearts" },
  { id: 12, emoji: "😍", description: "Smiling Face with Heart-Eyes" },
  {
    id: 13,
    emoji: "😄",
    description: "Smiling Face with Open Mouth and Smiling Eyes",
  },
  { id: 14, emoji: "🥳", description: "Partying Face" },
  { id: 15, emoji: "🤔", description: "Thinking Face" },
  { id: 16, emoji: "😒", description: "Unamused Face" },
  { id: 17, emoji: "🙄", description: "Rolling Eyes" },
  { id: 18, emoji: "😠", description: "Angry Face" },
  { id: 19, emoji: "🥺", description: "Pleading Face" },
  { id: 20, emoji: "😪", description: "Sleepy Face" },
];

const EmojiManage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteEmojiId, setDeleteEmojiId] = useState<number | null>(null);
  const [sampleData, setSampleData] = useState<Emoji[]>(initialSampleData);
  const navigate = useNavigate();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/edit-emoji/${id}`);
  };

  const handleDeleteConfirmation = (id: number) => {
    setShowDeleteConfirmation(true);
    setDeleteEmojiId(id);
  };

  const handleDelete = () => {
    if (deleteEmojiId !== null) {
      const updatedData = sampleData.filter(
        (emoji) => emoji.id !== deleteEmojiId
      );
      setSampleData(updatedData);
      setShowDeleteConfirmation(false);
      setDeleteEmojiId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setDeleteEmojiId(null);
  };

  const handleBack = () => {
    navigate("/admin/dashboard"); // Navigate to the /admin/dashboard route
  };

  const handleAddEmoji = () => {
    navigate("/admin/add-emoji"); // Navigate to the /admin/add-emoji route
  };

  return (
    <Paper>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddEmoji}
        style={{ margin: "16px" }}
      >
        Add Emoji
      </Button>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
      >
        Back
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Emoji</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((emoji) => (
                <TableRow key={emoji.id}>
                  <TableCell>{emoji.emoji}</TableCell>
                  <TableCell>{emoji.description}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(emoji.id)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteConfirmation(emoji.id)}
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
        count={sampleData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog
        open={showDeleteConfirmation}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete this Emoji?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EmojiManage;
