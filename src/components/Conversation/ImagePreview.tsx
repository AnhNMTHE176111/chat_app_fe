import { ImageListItem, SxProps } from "@mui/material";
import { FC, useEffect, useState } from "react";

interface ImagePreviewProps {
  file: File;
  sx?: SxProps;
}

export const ImagePreview: FC<ImagePreviewProps> = ({ file, sx }) => {
  const [imageUrl, setImageUrl] = useState<string>();
  // Handle image URL creation and cleanup
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <ImageListItem
      sx={{
        ...sx,
      }}
    >
      <img src={imageUrl} alt="Preview" />
    </ImageListItem>
  );
};

export default ImagePreview;
