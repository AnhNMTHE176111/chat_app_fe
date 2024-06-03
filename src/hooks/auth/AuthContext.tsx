import {
  Dispatch,
  FC,
  ReactNode,
  createContext,
  useEffect,
  useReducer,
} from "react";
import { initialize, reducer } from "./reducers";
import { getCurrentUser } from "../../services";

export interface UserData {
  email: string;
  avatar?: string;
  fullName?: string;
  accessToken?: string;
  tokenExpireAt?: string;
  role: string;
}

export interface AuthState {
  isInitialized?: boolean;
  isAuthenticated?: boolean;
  user: UserData | null;
}

export enum AuthActionType {
  INITIALIZE = "INITIALIZE",
  SIGN_IN = "SIGN_IN",
  SIGN_OUT = "SIGN_OUT",
}

export interface PayloadAction<T> {
  type: AuthActionType;
  payload: T;
}

export interface AuthContextType extends AuthState {
  dispatch: Dispatch<PayloadAction<AuthState>>;
}

export const initialState: AuthState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  dispatch: () => {
    throw new Error("dispatch function must be overridden");
  },
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await getCurrentUser();
        dispatch(
          initialize({
            user: response.data.user,
            isAuthenticated: true,
          })
        );
      } catch (error) {
        console.log("error from AuthProvider", error);
        dispatch(
          initialize({
            user: null,
            isAuthenticated: false,
          })
        );
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
