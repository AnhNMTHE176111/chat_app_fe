import { useState } from "react";

export const useDrawerState = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleToggleDrawer = () => {
    setOpen(!open);
    console.log("Current drawer", open);
  };
  return { open, setOpen, handleToggleDrawer };
};

export default useDrawerState;
