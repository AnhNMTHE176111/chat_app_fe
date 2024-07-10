import React from "react";
import { Card, CardHeader, Avatar, Box, Checkbox } from "@mui/material";
import { FriendListParams } from "../../services";

interface MultiSelectCardListProps {
  friendList: FriendListParams[];
  selectedFriends: string[];
  setSelectedFriends: (friends: string[]) => void;
}

const MultiSelectCardList: React.FC<MultiSelectCardListProps> = ({
  friendList,
  selectedFriends,
  setSelectedFriends,
}) => {
  const handleToggle = (id: string) => {
    const currentIndex = selectedFriends.indexOf(id);
    const newSelectedFriends = [...selectedFriends];

    if (currentIndex === -1) {
      newSelectedFriends.push(id);
    } else {
      newSelectedFriends.splice(currentIndex, 1);
    }

    setSelectedFriends(newSelectedFriends);
  };

  return (
    <Box>
      {friendList.map((friend) => (
        <Card key={friend.id} sx={{ mb: 1 }}>
          <CardHeader
            avatar={<Avatar src={friend.avatar} />}
            title={friend.fullName}
            action={
              <Checkbox
                checked={selectedFriends.indexOf(friend.id) !== -1}
                onChange={() => handleToggle(friend.id)}
              />
            }
          />
        </Card>
      ))}
    </Box>
  );
};

export default MultiSelectCardList;
