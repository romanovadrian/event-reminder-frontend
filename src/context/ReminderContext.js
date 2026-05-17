import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { useAuth } from "./AuthContext";
import {
  createReminder,
  deleteReminder,
  listReminders,
  updateReminder,
} from "../services/reminderService";

const ReminderContext = createContext(null);

const initialState = {
  reminders: [],
  isLoading: true,
  error: null,
};

function reminderReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, reminders: action.payload, isLoading: false };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "ADD":
      return { ...state, reminders: [...state.reminders, action.payload] };
    case "UPDATE":
      return {
        ...state,
        reminders: state.reminders.map((r) =>
          r.id === action.payload.id ? action.payload : r,
        ),
      };
    case "REMOVE":
      return {
        ...state,
        reminders: state.reminders.filter((r) => r.id !== action.payload),
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function ReminderProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(reminderReducer, initialState);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      dispatch({ type: "RESET" });
      return;
    }

    let isMounted = true;

    async function load() {
      dispatch({ type: "FETCH_START" });
      try {
        const data = await listReminders(token);
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

  const addReminder = useCallback(
    async (reminderData) => {
      const created = await createReminder(token, reminderData);
      dispatch({ type: "ADD", payload: created });
      return created;
    },
    [token],
  );

  const editReminder = useCallback(
    async (id, reminderData) => {
      const updated = await updateReminder(token, id, reminderData);
      dispatch({ type: "UPDATE", payload: updated });
      return updated;
    },
    [token],
  );

  const removeReminder = useCallback(
    async (id) => {
      await deleteReminder(token, id);
      dispatch({ type: "REMOVE", payload: id });
    },
    [token],
  );

  const refresh = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await listReminders(token);
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
      addReminder,
      editReminder,
      removeReminder,
      refresh,
    }),
    [state, addReminder, editReminder, removeReminder, refresh],
  );

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminders() {
  const ctx = useContext(ReminderContext);
  if (!ctx) {
    throw new Error("useReminders must be used within a ReminderProvider");
  }
  return ctx;
}
