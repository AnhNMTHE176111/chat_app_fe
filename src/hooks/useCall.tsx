import { useContext } from "react";
import { CallContext } from "../providers";

export const useCall = () => useContext(CallContext);
