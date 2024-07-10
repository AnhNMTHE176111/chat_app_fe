import React, { useState, useEffect } from "react";
import {
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  Container,
  Toolbar,
  AppBar,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { DataGrid, GridColDef, GridSearchIcon } from "@mui/x-data-grid";
import EditEmoji from "./EditEmoji";
import AddEmoji from "./AddEmoji";
import TableSkeleton from "../Dashboard/TableSkeleton";

// Sample data type
interface Emoji {
  id: number;
  emoji: string;
  name: string;
  description: string;
  imageURL: string;
}

const EmojiManage: React.FC = () => {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [selectEmoji, setSelectEmoji] = useState<Emoji | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteEmojiId, setDeleteEmojiId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const initialSampleData: Emoji[] = [
        { id: 1, name: "Smile", description: "A smiling face", imageURL: "https://example.com/smile.png", emoji: "😊" },
        { id: 2, name: "Frown", description: "A frowning face", imageURL: "https://example.com/frown.png", emoji: "☹️" },
        { id: 3, name: "Heart", description: "A heart", imageURL: "https://example.com/heart.png", emoji: "❤️" },
        { id: 4, name: "Thinking", description: "A thinking face", imageURL: "https://example.com/thinking.png", emoji: "🤔" },
        { id: 5, name: "Laughing", description: "A laughing face", imageURL: "https://example.com/laughing.png", emoji: "😂" },
        { id: 6, name: "Broken Heart", description: "A broken heart", imageURL: "https://example.com/broken_heart.png", emoji: "💔" },
        { id: 7, name: "Upside Down", description: "An upside-down face", imageURL: "https://example.com/upside_down.png", emoji: "🙃" },
        { id: 8, name: "Raised Hands", description: "Raised hands", imageURL: "https://example.com/raised_hands.png", emoji: "🙌" },
        { id: 9, name: "Star-Struck", description: "A star-struck face", imageURL: "https://example.com/star_struck.png", emoji: "🤩" },
        { id: 10, name: "Mind Blown", description: "A mind blown face", imageURL: "https://example.com/mind_blown.png", emoji: "🤯" },
        { id: 11, name: "Smiling Face with Hearts", description: "A smiling face with hearts", imageURL: "https://example.com/smiling_hearts.png", emoji: "🥰" },
        { id: 12, name: "Smiling Face with Heart-Eyes", description: "A smiling face with heart-eyes", imageURL: "https://example.com/heart_eyes.png", emoji: "😍" },
        { id: 13, name: "Smiling Face with Open Mouth and Smiling Eyes", description: "A smiling face with open mouth and smiling eyes", imageURL: "https://example.com/open_mouth.png", emoji: "😃" },
        { id: 14, name: "Partying Face", description: "A partying face", imageURL: "https://example.com/party.png", emoji: "🥳" },
        { id: 15, name: "Thinking Face", description: "A thinking face", imageURL: "https://example.com/thinking.png", emoji: "🤔" },
        { id: 16, name: "Unamused Face", description: "An unamused face", imageURL: "https://example.com/unamused.png", emoji: "😒" },
        { id: 17, name: "Rolling Eyes", description: "A face with rolling eyes", imageURL: "https://example.com/rolling_eyes.png", emoji: "🙄" },
        { id: 18, name: "Angry Face", description: "An angry face", imageURL: "https://example.com/angry.png", emoji: "😡" },
        { id: 19, name: "Pleading Face", description: "A pleading face", imageURL: "https://example.com/pleading.png", emoji: "🥺" },
        { id: 20, name: "Sleepy Face", description: "A sleepy face", imageURL: "https://example.com/sleepy.png", emoji: "😴" },
      ];
      setEmojis(initialSampleData);
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleEdit = (id: number) => {
    const emojiToEdit = emojis.find((emoji) => emoji.id === id);
    if (emojiToEdit) {
      setSelectEmoji(emojiToEdit);
      setOpenEditDialog(true);
    }
  };

  const handleDeleteConfirmation = (id: number) => {
    setShowDeleteConfirmation(true);
    setDeleteEmojiId(id);
  };

  const handleDelete = () => {
    if (deleteEmojiId !== null) {
      const updatedData = emojis.filter((emoji) => emoji.id !== deleteEmojiId);
      setEmojis(updatedData);
      setShowDeleteConfirmation(false);
      setDeleteEmojiId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setDeleteEmojiId(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleAddEmojiClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveEmoji = (editedEmoji: Emoji) => {
    const updatedEmojis = emojis.map((emoji) =>
      emoji.id === editedEmoji.id ? editedEmoji : emoji
    );
    setEmojis(updatedEmojis);
    setOpenEditDialog(false); // Close the edit dialog after saving
    setSelectEmoji(null); // Clear selected emoji state
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "emoji", headerName: "Emoji", width: 130 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "description", headerName: "Description", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteConfirmation(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const filteredEmojis = emojis.filter((emoji) =>
    emoji.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper>
      <AppBar position="static">
        <Toolbar>
          <div style={{ display: "flex", alignItems: "center", marginRight: "auto" }}>
          <GridSearchIcon />
            <input
              type="text"
              placeholder="Search by name..."
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
            onClick={handleAddEmojiClick}
            style={{ marginLeft: "auto" }}
          >
            
            <AddCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        {isLoading ? (
          <TableSkeleton loading={isLoading} />
        ) : (
          <DataGrid
            rows={filteredEmojis}
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
        <AddEmoji onClose={handleCloseDialog} />
      </Dialog>
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        aria-labelledby="form-dialog-title"
      >
        <EditEmoji
          emoji={selectEmoji as Emoji}
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          onSave={handleSaveEmoji}
        />
      </Dialog>
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
