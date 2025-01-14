import * as signalR from "@microsoft/signalr";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TState = { hubSignalR?: any };
const initialState: TState = {
  hubSignalR: undefined,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConnection(state, action: PayloadAction<signalR.HubConnection | undefined>) {
      state.hubSignalR = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setConnection } = chatSlice.actions;

export default chatSlice.reducer;
