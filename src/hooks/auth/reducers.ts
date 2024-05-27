import Cookies from "js-cookie";
import { AuthActionType, AuthState, PayloadAction } from "./AuthContext";
import { ACCESS_TOKEN_KEY_COOKIE } from "../../constants";

export interface ReducerHandler {
  INITIALIZE(state: AuthState, action: PayloadAction<AuthState>): AuthState;
  SIGN_IN(state: AuthState, action: PayloadAction<AuthState>): AuthState;
  SIGN_OUT(state: AuthState, action: PayloadAction<AuthState>): AuthState;
}

export const reducerHandlers: ReducerHandler = {
  INITIALIZE(state: AuthState, action: PayloadAction<AuthState>): AuthState {
    const { user, isAuthenticated } = action.payload;
    return {
      ...state,
      user,
      isAuthenticated,
      isInitialized: true,
    };
  },
  SIGN_IN(state: AuthState, action: PayloadAction<AuthState>): AuthState {
    const { user } = action.payload;
    return {
      ...state,
      user,
      isAuthenticated: true,
    };
  },
  SIGN_OUT(state: AuthState, action: PayloadAction<AuthState>): AuthState {
    return {
      ...state,
      user: null,
      isAuthenticated: false,
    };
  },
};

export const reducer = (state: AuthState, action: PayloadAction<AuthState>) => {
  if (!reducerHandlers[action.type]) {
    return state;
  }
  return reducerHandlers[action.type](state, action);
};

export const initialize = (state: AuthState): PayloadAction<AuthState> => {
  return {
    type: AuthActionType.INITIALIZE,
    payload: state,
  };
};

export const signin = (state: AuthState): PayloadAction<AuthState> => {
  return {
    type: AuthActionType.SIGN_IN,
    payload: state,
  };
};

export const signout = (): PayloadAction<AuthState> => {
  Cookies.remove(ACCESS_TOKEN_KEY_COOKIE);
  return {
    type: AuthActionType.SIGN_OUT,
    payload: {
      user: null,
    },
  };
};
