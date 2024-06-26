import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = "https://connections-api.goit.global/";

function setAuthHeader(token) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}

function clearAuthHeader() {
  axios.defaults.headers.common["Authorization"] = "";
}

export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkApi) => {
    try {
      const response = await axios.post("/users/signup", data);
      setAuthHeader(response.data.token);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk("auth/login", async (data, thunkApi) => {
  try {
    const response = await axios.post("/users/login", data);
    setAuthHeader(response.data.token);
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkApi) => {
  try {
    await axios.post("/users/logout");
    clearAuthHeader();
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkApi) => {
    const {
      auth: { token },
    } = thunkApi.getState();

    setAuthHeader(token);
    const response = await axios.get("/users/current");

    return response.data;
  },
  {
    condition: (_, { getState }) => {
      const {
        auth: { token },
      } = getState();
      return token !== null;
    },
  }
);