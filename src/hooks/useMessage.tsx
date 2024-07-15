import { useContext } from "react";
import { MessageContext } from "../providers";

export const useMessage = () => useContext(MessageContext);
