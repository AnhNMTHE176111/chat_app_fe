import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../stores";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export * from "./auth/AuthContext";
export * from "./auth/reducers";
export * from "./useAuth";
// export * from "./useSocket";
