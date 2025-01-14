import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TProvider, TProvidersFilter } from "src/types/provider.types";

type TState = {
  isSiderCollapsed: boolean;
  visibleItem: string | null;
  extraState: any;
  selectedProvider?: TProvider;
  gProvidersFilter: TProvidersFilter;
};

const initialState: TState = {
  isSiderCollapsed: false,
  visibleItem: null,
  extraState: null,
  gProvidersFilter: {
    formId: 20,
    maxResultCount: 10,
  },
};

const visibleSlice = createSlice({
  name: "visible",
  initialState,
  reducers: {
    setVisibleItem(state, action: PayloadAction<string | null>) {
      state.visibleItem = action.payload;
      if (action.payload === null) state.extraState = null;
    },
    setSiderCollapsed(state, action: PayloadAction<boolean>) {
      state.isSiderCollapsed = action.payload;
    },
    setSelectedProvider(state, action: PayloadAction<TProvider | undefined>) {
      state.selectedProvider = action.payload;
    },
    setGProvidersFilter(state, action: PayloadAction<TProvidersFilter>) {
      state.gProvidersFilter = action.payload;
    },
    setExtraState(state, action: PayloadAction<any>) {
      state.extraState = action.payload;
    },
  },
});

export const {
  setVisibleItem,
  setSiderCollapsed,
  setExtraState,
  setSelectedProvider,
  setGProvidersFilter,
} = visibleSlice.actions;

export default visibleSlice.reducer;
