import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { useAuth } from "./AuthContext";
import { createUser, listUsers } from "../services/userService";

const UserContext = createContext(null);

const initialState = {
  users: [],
  isLoading: true,
  error: null,
};

function userReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, users: action.payload, isLoading: false };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "ADD":
      return { ...state, users: [...state.users, action.payload] };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      dispatch({ type: "RESET" });
      return;
    }

    let isMounted = true;

    async function load() {
      dispatch({ type: "FETCH_START" });
      try {
        const data = await listUsers(token);
        if (isMounted) {
          dispatch({
            type: "FETCH_SUCCESS",
            payload: Array.isArray(data) ? data : [],
          });
        }
      } catch (err) {
        if (isMounted) {
          dispatch({ type: "FETCH_ERROR", payload: err.message });
        }
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [token, isAuthenticated]);

  const addUser = useCallback(
    async (userData) => {
      const created = await createUser(token, userData);
      dispatch({ type: "ADD", payload: created });
      return created;
    },
    [token],
  );

  const refresh = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await listUsers(token);
      dispatch({
        type: "FETCH_SUCCESS",
        payload: Array.isArray(data) ? data : [],
      });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
    }
  }, [token]);

  const value = useMemo(
    () => ({
      ...state,
      addUser,
      refresh,
    }),
    [state, addUser, refresh],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUsers() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return ctx;
}
