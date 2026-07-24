import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true, // initial check
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state: AuthState,
      action: PayloadAction<{ user: User }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    logout: (state: AuthState) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setAuthLoading: (state: AuthState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuthError: (state: AuthState, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
});

export const { setCredentials, logout, setAuthLoading, setAuthError } = authSlice.actions;
export default authSlice.reducer;
