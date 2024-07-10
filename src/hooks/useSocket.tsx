import { useContext } from "react";
import { SocketContext } from "../providers";

export const useSocket = () => {
  return useContext(SocketContext);
};
