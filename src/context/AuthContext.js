import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import {
  fetchUsers,
  getStoredToken,
  login as loginRequest,
  logout as logoutRequest,
} from '../services/authService';

const AuthContext = createContext(null);

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'BOOTSTRAP_START':
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'BOOTSTRAP_DONE':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: Boolean(action.payload.token),
        isLoading: false,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let isMounted = true;

    async function bootstrapAuth() {
      dispatch({ type: 'BOOTSTRAP_START' });
      const token = getStoredToken();

      if (!token) {
        dispatch({ type: 'BOOTSTRAP_DONE', payload: { token: null, user: null } });
        return;
      }

      try {
        const users = await fetchUsers(token);
        const firstUser = Array.isArray(users) ? users[0] || null : null;

        if (isMounted) {
          dispatch({
            type: 'BOOTSTRAP_DONE',
            payload: { token, user: firstUser },
          });
        }
      } catch (error) {
        if (isMounted) {
          dispatch({ type: 'LOGOUT' });
        }
      }
    }

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const tokenData = await loginRequest(credentials);
      const users = await fetchUsers(tokenData.access_token);
      const firstUser = Array.isArray(users) ? users[0] || null : null;

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: tokenData.access_token,
          user: firstUser,
        },
      });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest(state.token);
    dispatch({ type: 'LOGOUT' });
  }, [state.token]);

  // Listen for 401 signals from apiClient and force logout
  useEffect(() => {
    function handleExpired() {
      dispatch({ type: 'LOGOUT' });
    }
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
    }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
