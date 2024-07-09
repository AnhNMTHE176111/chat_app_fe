import { Box, List, ListItem, Skeleton } from "@mui/material";
import { FC } from "react";

export const MessagesListSkeleton: FC = () => {
  const skeletons = Array.from({ length: 14 });

  return (
    <List dense={true}>
      {skeletons.map((_, index) => (
        <ListItem
          key={index}
          sx={{
            display: "flex",
            justifyContent: index % 2 === 0 ? "flex-start" : "flex-end",
          }}
        >
          <Skeleton
            sx={{
              display: index % 2 === 0 ? "block" : "none",
            }}
            variant="circular"
            width={40}
            height={40}
          />
          <Box sx={{ width: "30%" }}>
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default MessagesListSkeleton;
