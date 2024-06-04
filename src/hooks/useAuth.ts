import { useContext } from "react";
import AuthContext from "./auth/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Auth Context must be inside Auth Provider");
  }
  return context;
}

export default useAuth;
