import { Box, Skeleton } from "@mui/material";
import React, { FC } from "react";

export const HeaderConversationSkeleton: FC = () => {
  return (
    <React.Fragment>
      <Box
        sx={{
          width: "fit-content",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ marginLeft: "10px" }}>
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width={60} height={20} />
        </Box>
      </Box>
      <Box>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
    </React.Fragment>
  );
};

export default HeaderConversationSkeleton;
